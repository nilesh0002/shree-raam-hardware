# Security Notice

## Important Security Information

⚠️ **NEVER commit sensitive files to GitHub:**

- `backend/.env` - Contains MongoDB credentials
- Any files with passwords, API keys, or connection strings

## Before Uploading to GitHub

1. **Verify .env is excluded:**
   ```bash
   git status
   # Should NOT show backend/.env in the list
   ```

2. **If .env appears in git status:**
   ```bash
   git rm --cached backend/.env
   git commit -m "Remove sensitive .env file"
   ```

3. **Always use .env.example instead:**
   - Copy `backend/.env.example` to `backend/.env`
   - Fill in your actual credentials locally
   - Only commit the `.env.example` file

## Environment Variables Required

Create `backend/.env` with:
```
MONGODB_URI=your_actual_mongodb_connection_string
PORT=5000
ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_admin_password
```

## Default Credentials (Change in Production)
- Admin Username: `admin`
- Admin Password: `shree@123`

**⚠️ Change these credentials before deploying to production!**