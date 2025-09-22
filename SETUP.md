# Setup Guide

## Prerequisites

- Node.js 16+ and npm 8+
- PostgreSQL database (Supabase recommended)
- Cloudflare R2 account for image storage
- Gmail account with App Password enabled

## Step-by-Step Setup

### 1. Database Setup

1. Create a PostgreSQL database (Supabase recommended)
2. Run SQL files in this exact order:
   ```sql
   -- 1. Basic admin and authentication
   database/schema.sql
   
   -- 2. Product management
   database/products-schema.sql
   
   -- 3. Order management
   database/orders-schema.sql
   
   -- 4. User management
   database/users-schema.sql
   
   -- 5. Multi-tenant support
   database/multi-tenant-schema.sql
   ```

3. Generate password hashes:
   ```bash
   node database/generate-hash.js
   ```

### 2. Cloudflare R2 Setup

1. Create Cloudflare account
2. Go to R2 Object Storage
3. Create a bucket (e.g., "my-ecom-images")
4. Get API credentials:
   - Account ID
   - Access Key ID
   - Secret Access Key
5. Set up custom domain for public access

### 3. Gmail SMTP Setup

1. Enable 2-Factor Authentication on Gmail
2. Go to Google Account → Security → App passwords
3. Generate an app password for "Mail"
4. Use this password in environment variables

### 4. Environment Configuration

**Backend `.env`:**
```env
# Database
DATABASE_URL=postgresql://user:pass@host:port/database

# JWT
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters

# Server
PORT=5000
FRONTEND_URL=http://localhost:3000

# Cloudflare R2
R2_ENDPOINT=https://your-account-id.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=my-ecom-images
R2_PUBLIC_URL=https://your-custom-domain.com

# Email
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-16-character-app-password
ADMIN_EMAIL=admin@yourstore.com
```

**Frontend `.env`:**
```env
REACT_APP_API_URL=http://localhost:5000
```

### 5. Installation

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install

# Or use the convenience script
npm run install-deps
```

### 6. Development

```bash
# Start both servers
npm run dev

# Or start individually
npm run server  # Backend only
npm run client  # Frontend only
```

### 7. Default Login Credentials

**Super Admin:**
- URL: `http://localhost:3000/admin/login`
- Email: `superadmin@platform.com`
- Password: `admin123` (CHANGE IN PRODUCTION)

**Merchant Admin:**
- URL: `http://localhost:3000/admin/login`
- Email: `admin@store1.com`
- Password: `admin123` (CHANGE IN PRODUCTION)

⚠️ **Security Warning:** These are default development credentials. Always change passwords and use strong credentials in production.

## Production Deployment

### Backend (Heroku/Railway)

1. Set all environment variables
2. Deploy backend code
3. Run database migrations
4. Ensure database is accessible

### Frontend (Vercel/Netlify)

1. Set `REACT_APP_API_URL` to your backend URL
2. Build and deploy frontend
3. Configure custom domain if needed

### Domain Setup for Multi-Tenant

1. Set up wildcard DNS: `*.yourplatform.com`
2. Configure SSL certificates
3. Point subdomains to your application
4. Update CORS settings in backend

## Troubleshooting

### Database Connection Issues
- Check DATABASE_URL format
- Ensure database is accessible from your IP
- Verify credentials and database name

### Email Not Working
- Confirm Gmail App Password is correct
- Check if 2FA is enabled
- Verify EMAIL_USER and EMAIL_PASS

### Image Upload Issues
- Verify R2 credentials
- Check bucket permissions
- Ensure R2_PUBLIC_URL is correct

### CORS Errors
- Update FRONTEND_URL in backend .env
- Check if frontend URL matches exactly
- Verify CORS configuration in server.js

## Security Checklist

- [ ] Strong JWT_SECRET (32+ characters)
- [ ] Database credentials secured
- [ ] R2 credentials not exposed to frontend
- [ ] Gmail App Password used (not regular password)
- [ ] CORS properly configured
- [ ] Environment files in .gitignore
- [ ] Default passwords changed in production

## Performance Optimization

- Enable database connection pooling
- Set up Redis for session storage
- Configure CDN for static assets
- Implement database indexing
- Add API rate limiting
- Enable gzip compression