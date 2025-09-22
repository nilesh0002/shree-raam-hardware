# Multi-Tenant E-commerce Admin Panel

🚀 **Full-stack e-commerce admin panel with multi-tenant support, built with React, Node.js, and PostgreSQL.**

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with role-based access control
- bcrypt password hashing
- Super Admin vs Merchant Admin roles
- Protected routes and API endpoints

### 🏪 Multi-Tenant Architecture
- Subdomain-based tenant isolation (`store1.platform.com`)
- Complete data separation by merchant
- Super Admin can manage all merchants
- Scalable for unlimited stores

### 📦 Product Management
- Full CRUD operations for products
- Image upload to Cloudflare R2
- Stock management with low stock alerts
- Category organization

### 📋 Order Management
- Order status tracking (pending/shipped/delivered)
- Customer information display
- Status filtering and updates
- Order history per user

### 👥 User Management
- User account management
- Block/unblock functionality
- User order history viewing
- Registration tracking

### 📊 Dashboard & Analytics
- Real-time metrics (sales, orders, users, stock)
- Low stock alerts with email notifications
- Visual indicators and status badges
- Role-based dashboard views

### 📧 Email Notifications
- Automated out-of-stock alerts
- Daily low stock summaries
- Professional HTML email templates
- Gmail SMTP integration

## 🛠️ Tech Stack

**Frontend:**
- React 18 with Hooks
- Tailwind CSS for styling
- Axios for API calls
- React Router for navigation
- JWT decode for authentication

**Backend:**
- Node.js with Express
- PostgreSQL (Supabase)
- JWT for authentication
- Multer for file uploads
- Nodemailer for emails
- node-cron for scheduled tasks

**Storage & Services:**
- Cloudflare R2 for image storage
- Gmail SMTP for email delivery
- Supabase for PostgreSQL hosting

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- PostgreSQL database (Supabase recommended)
- Cloudflare R2 account
- Gmail account with App Password

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-admin-panel
   ```

2. **Install all dependencies**
   ```bash
   npm run install-deps
   ```

3. **Database Setup**
   ```bash
   # Run SQL files in order:
   # 1. database/schema.sql
   # 2. database/products-schema.sql
   # 3. database/orders-schema.sql
   # 4. database/users-schema.sql
   # 5. database/multi-tenant-schema.sql
   
   # Generate admin password hash
   node database/generate-hash.js
   ```

4. **Environment Configuration**
   
   **Backend (.env):**
   ```env
   JWT_SECRET=your_super_secret_jwt_key_here
   DATABASE_URL=your_supabase_connection_string
   PORT=5000
   FRONTEND_URL=http://localhost:3000
   
   # Cloudflare R2
   R2_ENDPOINT=https://xxxxxx.r2.cloudflarestorage.com
   R2_ACCESS_KEY_ID=your_r2_access_key_id
   R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
   R2_BUCKET_NAME=my-ecom-images
   R2_PUBLIC_URL=https://pub-xxx.r2.dev
   
   # Email Configuration
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ADMIN_EMAIL=admin@yourstore.com
   ```
   
   **Frontend (.env):**
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

5. **Start Development Servers**
   ```bash
   npm run dev
   ```
   
   This starts both backend (port 5000) and frontend (port 3000)

## 📁 Project Structure

```
ecommerce-admin-panel/
├── backend/
│   ├── routes/          # API routes
│   ├── middleware/      # Auth & tenant middleware
│   ├── utils/          # Utilities (email, R2, cron)
│   └── server.js       # Express server
├── frontend/src/
│   ├── components/     # React components
│   └── App.js         # Main app component
├── database/          # SQL schemas and utilities
└── README.md
```

## 🔑 Default Accounts

**Super Admin:**
- Email: `superadmin@platform.com`
- Password: `admin123` (change in production)
- Access: All merchants and platform management

**Merchant Admin:**
- Email: `admin@store1.com`
- Password: `admin123` (change in production)
- Access: Store 1 data only

⚠️ **Important:** Change default passwords before production deployment

## 🌐 Multi-Tenant Access

- **Super Admin:** `admin.yourplatform.com/admin/login`
- **Store 1:** `store1.yourplatform.com/admin/login`
- **Store 2:** `store2.yourplatform.com/admin/login`

## 📊 API Endpoints

### Authentication
- `POST /admin/login` - Admin login

### Products
- `GET /admin/products` - List products
- `POST /admin/products` - Create product
- `PUT /admin/products/:id` - Update product
- `DELETE /admin/products/:id` - Delete product
- `GET /admin/products/low-stock` - Low stock products

### Orders
- `GET /admin/orders` - List orders
- `PUT /admin/orders/:id` - Update order status

### Users
- `GET /admin/users` - List users
- `PUT /admin/users/:id/toggle-active` - Toggle user status
- `GET /admin/users/:id/orders` - User order history

### Dashboard
- `GET /admin/dashboard/stats` - Dashboard statistics

### Merchants (Super Admin only)
- `GET /admin/merchants` - List merchants
- `POST /admin/merchants` - Create merchant
- `PUT /admin/merchants/:id/toggle-active` - Toggle merchant status

## 🔒 Security Features

- **Data Isolation:** Complete tenant separation
- **Role-Based Access:** Super admin vs merchant admin
- **Input Validation:** Server-side validation
- **File Upload Security:** Type and size validation
- **CORS Protection:** Domain whitelisting
- **JWT Security:** Token expiration and validation

## 📧 Email Setup (Gmail)

1. Enable 2-Factor Authentication
2. Generate App Password: Google Account → Security → App passwords
3. Use App Password in `EMAIL_PASS` environment variable

## 🚀 Deployment

### Backend Deployment
- Deploy to Heroku, Railway, or similar
- Set environment variables
- Ensure PostgreSQL database is accessible

### Frontend Deployment
- Build: `npm run build`
- Deploy to Vercel, Netlify, or similar
- Set `REACT_APP_API_URL` to your backend URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error logs and environment details

---

**Built with ❤️ for modern e-commerce management**