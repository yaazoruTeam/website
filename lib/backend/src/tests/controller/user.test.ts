import request from 'supertest'
import express from 'express'
import { createUser, getUsers, getUserById, updateUser, deleteUser } from '../../controller/user'
import { userRepository } from '../../repositories/UserRepository'
import { hashPassword } from '../../utils/password'

// Mock repositories, utilities, and models
jest.mock('../../repositories/UserRepository')
jest.mock('../../utils/password')
jest.mock('../../utils/logger', () => ({
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
  http: jest.fn(),
}))
jest.mock('../../../../model/src', () => ({
  User: {
    sanitizeBodyExisting: jest.fn(),
    sanitize: jest.fn(),
    sanitizeIdExisting: jest.fn(),
    sanitizeExistingUser: jest.fn(),
  },
  HttpError: {}
}))

import { User } from '../../../../model/src'

const app = express()
app.use(express.json())
app.post('/users', createUser)
app.get('/users', getUsers)
app.get('/users/:id', getUserById)
app.put('/users/:id', updateUser)
app.delete('/users/:id', deleteUser)

describe('User Controller', () => {
  const mockUser = {
    user_id: 123,
    user_name: 'testuser',
    email: 'test@example.com',
    id_number: '123456789',
    phone_number: '0501234567',
    additional_phone: null,
    password: 'plainPassword',
    first_name: 'John',
    last_name: 'Doe',
    city: 'Tel Aviv',
    address: '123 Main St',
    role: 'branch',
    status: 'active',
    created_at: new Date(),
    updated_at: new Date(),
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('createUser', () => {
    it('should create user successfully', async () => {
      ;(User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {})
      ;(User.sanitize as jest.Mock).mockReturnValue({
        ...mockUser,
        user_id: undefined,
      })
      ;(userRepository.findAllExistingUsers as jest.Mock).mockResolvedValue({})
      ;(hashPassword as jest.Mock).mockResolvedValue('hashedPassword')
      ;(userRepository.createUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        password: 'hashedPassword',
      })

      const res = await request(app).post('/users').send(mockUser)
      expect(res.status).toBe(201)
      expect(res.body.password).toBe('hashedPassword')
      expect(userRepository.createUser).toHaveBeenCalled()
    })

    it('should handle user already exists', async () => {
      ;(User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {})
      ;(User.sanitize as jest.Mock).mockReturnValue(mockUser)
      ;(userRepository.findAllExistingUsers as jest.Mock).mockResolvedValue({
        email: mockUser,
      })

      const res = await request(app).post('/users').send(mockUser)
      expect(res.status).toBe(409)
    })

    it('should handle general error', async () => {
      ;(User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {
        throw new Error('Invalid body')
      })

      const res = await request(app).post('/users').send(mockUser)
      expect(res.status).toBe(500)
    })
  })

  describe('getUsers', () => {
    it('should return users list with pagination', async () => {
      ;(userRepository.getUsers as jest.Mock).mockResolvedValue({
        users: [mockUser],
        total: 1,
      })

      const res = await request(app).get('/users?page=1')
      expect(res.status).toBe(200)
      expect(res.body.data).toHaveLength(1)
      expect(res.body.page).toBe(1)
      expect(res.body.total).toBe(1)
      expect(res.body.totalPages).toBe(1)
      expect(userRepository.getUsers).toHaveBeenCalledWith(0)
    })

    it('should handle pagination correctly', async () => {
      ;(userRepository.getUsers as jest.Mock).mockResolvedValue({
        users: [mockUser],
        total: 50,
      })

      const res = await request(app).get('/users?page=2')
      expect(res.status).toBe(200)
      expect(res.body.page).toBe(2)
      expect(userRepository.getUsers).toHaveBeenCalled()
    })

    it('should handle DB error', async () => {
      ;(userRepository.getUsers as jest.Mock).mockRejectedValue(
        new Error('Database connection failed')
      )

      const res = await request(app).get('/users')
      expect(res.status).toBe(500)
    })
  })

  describe('getUserById', () => {
    it('should return a user by ID', async () => {
      ;(User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {})
      ;(userRepository.getUserById as jest.Mock).mockResolvedValue(mockUser)

      const res = await request(app).get('/users/123')
      expect(res.status).toBe(200)
      expect(res.body.email).toBe('test@example.com')
      expect(res.body.user_id).toBe(123)
      expect(userRepository.getUserById).toHaveBeenCalledWith(123)
    })

    it('should return 404 if user does not exist', async () => {
      ;(User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {})
      ;(userRepository.getUserById as jest.Mock).mockResolvedValue(null)

      const res = await request(app).get('/users/999')
      expect(res.status).toBe(404)
    })

    it('should handle invalid ID parameter', async () => {
      ;(User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {
        throw { status: 400, message: 'No ID provided' }
      })

      const res = await request(app).get('/users/invalid')
      expect(res.status).toBe(400)
    })
  })

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      ;(User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {})
      ;(User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {})
      ;(User.sanitize as jest.Mock).mockReturnValue({
        ...mockUser,
        user_name: 'updatedName',
      })
      ;(hashPassword as jest.Mock).mockResolvedValue('hashedPassword')
      ;(userRepository.findAllExistingUsers as jest.Mock).mockResolvedValue({})
      ;(userRepository.updateUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        user_name: 'updatedName',
      })

      const res = await request(app)
        .put('/users/123')
        .send({ ...mockUser, user_name: 'updatedName' })
      expect(res.status).toBe(200)
      expect(res.body.user_name).toBe('updatedName')
      expect(userRepository.updateUser).toHaveBeenCalledWith(123, expect.any(Object))
    })

    it('should handle duplicate email on update', async () => {
      ;(User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {})
      ;(User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {})
      ;(User.sanitize as jest.Mock).mockReturnValue(mockUser)
      ;(hashPassword as jest.Mock).mockResolvedValue('hashedPassword')
      ;(userRepository.findAllExistingUsers as jest.Mock).mockResolvedValue({
        email: { ...mockUser, user_id: 999 },
      })

      const res = await request(app).put('/users/123').send(mockUser)
      expect(res.status).toBe(409)
    })

    it('should handle update error', async () => {
      ;(User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {})
      ;(User.sanitizeBodyExisting as jest.Mock).mockImplementation(() => {})
      ;(User.sanitize as jest.Mock).mockReturnValue(mockUser)
      ;(hashPassword as jest.Mock).mockResolvedValue('hashedPassword')
      ;(userRepository.findAllExistingUsers as jest.Mock).mockResolvedValue({})
      ;(userRepository.updateUser as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const res = await request(app).put('/users/123').send(mockUser)
      expect(res.status).toBe(500)
    })
  })

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      ;(User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {})
      ;(userRepository.deleteUser as jest.Mock).mockResolvedValue({
        ...mockUser,
        status: 'inactive',
      })

      const res = await request(app).delete('/users/123')
      expect(res.status).toBe(200)
      expect(res.body.status).toBe('inactive')
      expect(userRepository.deleteUser).toHaveBeenCalledWith(123)
    })

    it('should return 404 if user not found', async () => {
      ;(User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {})
      ;(userRepository.deleteUser as jest.Mock).mockRejectedValue({
        status: 404,
        message: 'User not found',
      })

      const res = await request(app).delete('/users/999')
      expect(res.status).toBe(404)
    })

    it('should handle deletion error', async () => {
      ;(User.sanitizeIdExisting as jest.Mock).mockImplementation(() => {})
      ;(userRepository.deleteUser as jest.Mock).mockRejectedValue(
        new Error('Database error')
      )

      const res = await request(app).delete('/users/123')
      expect(res.status).toBe(500)
    })
  })
})
