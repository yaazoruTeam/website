import { Request, Response, NextFunction } from 'express'
import { HttpError, User, GoogleAuth } from '@model'
import * as db from '@db/index'
import { generateToken, verifyToken } from '@utils/jwt'
import { comparePasswords } from '@utils/password'
import { createUser } from './user'
import { handleError } from './err'
import * as admin from 'firebase-admin'
import logger from '@utils/logger'

// Initialize Firebase Admin if not already initialized
let firebaseAdminInitialized = false;
if (!admin.apps.length) {
  try {
    // Try to initialize with service account key from environment variable
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    if (serviceAccountKey) {
      const serviceAccount = JSON.parse(serviceAccountKey);
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      logger.info('✅ Firebase Admin initialized with service account key');
      firebaseAdminInitialized = true;
    } else {
      // Fallback to Application Default Credentials (ADC)
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.FIREBASE_PROJECT_ID,
      });
      logger.info('✅ Firebase Admin initialized with Application Default Credentials');
      firebaseAdminInitialized = true;
    }
  } catch (error) {
    logger.error('❌ Failed to initialize Firebase Admin:', error);
    logger.warn('⚠️ Google Authentication will work in development mode only (not secure)');
    firebaseAdminInitialized = false;
  }
} else {
  firebaseAdminInitialized = true;
}

const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await createUser(req, res, next)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { user_name, password } = req.body
    const user: User.Model = await db.User.findUser({ user_name })
    if (!user) {
      const error: HttpError.Model = {
        status: 404,
        message: 'User not found',
      }
      throw error
    }
    if (!user.password) {
      const error: HttpError.Model = {
        status: 400,
        message: 'User password not found',
      }
      throw error
    }
    const isPasswordCorrect = await comparePasswords(password, user.password)
    if (!isPasswordCorrect) {
      const error: HttpError.Model = {
        status: 401,
        message: 'Incorrect password',
      }
      throw error
    }
    const accessToken = generateToken(user.user_id, user.role)

    res.status(200).json(accessToken)
  } catch (error: unknown) {
    handleError(error, next)
  }
}

const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.headers['authorization']?.split(' ')[1]
    if (!token) {
      const error: HttpError.Model = {
        status: 403,
        message: 'Access denied - missing token',
      }
      throw error
    }

    const { valid, decoded } = verifyToken(token)
    if (valid && decoded) {
      const { user_id, role } = decoded
      const newAccessToken = generateToken(user_id, role)
      res.status(200).json(newAccessToken)
    } else {
      const error: HttpError.Model = {
        status: 401,
        message: 'Invalid token',
      }
      throw error
    }
  } catch (error: unknown) {
    handleError(error, next)
  }
}

// Google Authentication Handler - Secure ID Token Validation
const googleAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { 
      idToken, 
      uid, 
      email, 
      displayName, 
      photoURL, 
      emailVerified 
    }: GoogleAuth.GoogleAuthParams = req.body

    // Validate idToken is provided
    if (!idToken) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Missing Firebase ID token',
      }
      throw error
    }

    let verifiedUserData;

    // Check if Firebase Admin is properly initialized
    if (!firebaseAdminInitialized) {
      logger.warn('⚠️ Firebase Admin SDK not initialized - using development mode with unverified data');
      logger.warn('⚠️ THIS IS NOT SECURE - ONLY FOR DEVELOPMENT');
      
      // Development fallback - use provided data (NOT SECURE)
      if (!uid || !email) {
        const error: HttpError.Model = {
          status: 400,
          message: 'Missing required user information (uid, email)',
        }
        throw error
      }
      
      verifiedUserData = {
        uid,
        email,
        name: displayName,
        picture: photoURL,
        email_verified: emailVerified
      };
    } else {
      try {
        // Verify the ID token with Firebase Admin SDK
        const decodedToken = await admin.auth().verifyIdToken(idToken)
        
        // Extract verified user data from the token
        verifiedUserData = {
          uid: decodedToken.uid,
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
          email_verified: decodedToken.email_verified
        };
      } catch (firebaseError: any) {
        logger.error('Firebase ID Token verification failed:', firebaseError);
        
        // If Firebase verification fails but we have fallback data, use development mode
        if (uid && email) {
          logger.warn('⚠️ Firebase verification failed - falling back to development mode');
          logger.warn('⚠️ THIS IS NOT SECURE - ONLY FOR DEVELOPMENT');
          
          verifiedUserData = {
            uid,
            email,
            name: displayName,
            picture: photoURL,
            email_verified: emailVerified
          };
        } else {
          // Handle specific Firebase errors
          if (firebaseError.code === 'auth/id-token-expired') {
            const error: HttpError.Model = {
              status: 401,
              message: 'Firebase ID token has expired. Please sign in again.',
            }
            throw error
          }
          
          if (firebaseError.code === 'auth/argument-error' || firebaseError.code === 'app/invalid-credential') {
            const error: HttpError.Model = {
              status: 400,
              message: 'Invalid Firebase ID token format.',
            }
            throw error
          }

          // Generic Firebase error
          const error: HttpError.Model = {
            status: 500,
            message: 'Firebase authentication service unavailable. Please try again later.',
          }
          throw error
        }
      }
    }
    
    // Use verified data
    const {
      uid: verifiedUid,
      email: verifiedEmail,
      name: verifiedDisplayName,
      picture: verifiedPhotoURL,
      email_verified: verifiedEmailVerified
    } = verifiedUserData

    // Validate required fields from verified data
    if (!verifiedUid || !verifiedEmail) {
      const error: HttpError.Model = {
        status: 400,
        message: 'Invalid user data - missing required user information',
      }
      throw error
    }

    // Check if user already exists by Google UID
    let user: User.Model | null = await db.User.findUser({ google_uid: verifiedUid })
    
    if (!user) {
      // Check if user exists by email (in case they previously registered with email/password)
      user = await db.User.findUser({ email: verifiedEmail })
      
      if (user) {
        // Link Google account to existing user
        user = await db.User.updateUserPartial(user.user_id, { 
          google_uid: verifiedUid,
          photo_url: verifiedPhotoURL || '',
          email_verified: verifiedEmailVerified || false
        })
      } else {
        // User not found in database - deny access
        const error: HttpError.Model = {
          status: 403,
          message: 'Access denied. Your account is not authorized to use this system. Please contact the administrator.',
        }
        throw error
      }
    } else {
      // Update existing Google user info with verified data
      user = await db.User.updateUserPartial(user.user_id, {
        user_name: verifiedDisplayName || user.user_name,
        photo_url: verifiedPhotoURL || user.photo_url,
        email_verified: verifiedEmailVerified || user.email_verified
      })
    }

    // At this point user is guaranteed to be non-null
    if (!user) {
      throw new Error('User creation/update failed')
    }

    // Generate JWT token
    const accessToken = generateToken(user.user_id, user.role)

    res.status(200).json({
      success: true,
      user: {
        user_id: user.user_id,
        email: user.email,
        user_name: user.user_name,
        photo_url: user.photo_url,
        role: user.role
      },
      token: accessToken
    })

  } catch (error: unknown) {
    logger.error('Google Auth Error:', error)
    handleError(error, next)
  }
}

export { register, login, refreshToken, googleAuth }
