# Git Hooks Setup for Prettier

This repository is configured with git hooks that automatically run prettier formatting before each commit.

## How it works

The pre-commit hook will:
1. Detect files staged for commit in the `lib/FE/` and `lib/backend/` directories
2. Run prettier on those files with the appropriate configuration
3. Add the formatted files back to the commit
4. Allow the commit to proceed

## Supported file types

The hook will format these file types:
- `.js`, `.jsx` - JavaScript files
- `.ts`, `.tsx` - TypeScript files  
- `.json` - JSON files
- `.css`, `.scss` - Stylesheets
- `.html` - HTML files
- `.md` - Markdown files

## Manual formatting

You can also manually format files using npm scripts:

### Frontend (FE)
```bash
cd lib/FE
npm run format        # Format all files
npm run format:check  # Check formatting without changing files
```

### Backend
```bash
cd lib/backend
npm run format        # Format all files
npm run format:check  # Check formatting without changing files
```

## Configuration

Prettier configuration is stored in:
- `lib/FE/.prettierrc` - Frontend configuration
- `lib/backend/.prettierrc` - Backend configuration
- `lib/FE/.prettierignore` - Files to ignore in frontend
- `lib/backend/.prettierignore` - Files to ignore in backend

## Disabling the hook

If you need to commit without running prettier (not recommended), you can use:
```bash
git commit --no-verify
```

## Troubleshooting

If the hook fails:
1. Make sure Node.js and npm are installed
2. Run `npm install` in both `lib/FE/` and `lib/backend/` directories
3. Check that prettier is installed as a dev dependency
4. Verify the hook file exists at `.git/hooks/pre-commit` and is executable

## Testing the hook

To test if the hook is working:
1. Make changes to a file in `lib/FE/` or `lib/backend/`
2. Stage the file with `git add`
3. Commit with `git commit`
4. You should see prettier running before the commit completes



1234567890
