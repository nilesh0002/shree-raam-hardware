# Quick Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account
- Git

## Installation Steps

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd shree-raam-hardware
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Setup environment variables**
   ```bash
   cd backend
   cp .env.example .env
   # Edit .env with your MongoDB Atlas connection string
   ```

4. **Start the application**
   ```bash
   # Terminal 1 - Backend
   npm run start-backend
   
   # Terminal 2 - Frontend
   npm run start-frontend
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## Default Admin Credentials
- Username: `admin`
- Password: `shree@123`

## MongoDB Atlas Setup
1. Create account at https://cloud.mongodb.com
2. Create new cluster
3. Get connection string
4. Replace in backend/.env file