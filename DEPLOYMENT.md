# 🚀 Deployment Guide - Shree Raam Hardware

## 📋 Pre-Deployment Checklist

### ✅ Backend Preparation
1. MongoDB Atlas is already configured
2. Environment variables are set in `.env`
3. All dependencies are listed in `package.json`

### ✅ Frontend Preparation
1. Update API URLs in `src/config.js`
2. Build optimized production version
3. Configure environment variables

## 🌐 Hosting Options

### **Option 1: Railway (Recommended - Free)**

#### Backend Deployment:
1. **Create Railway Account**: [railway.app](https://railway.app)
2. **Connect GitHub**: Link your repository
3. **Deploy Backend**:
   - Select `backend` folder
   - Add environment variables:
     ```
     MONGODB_URI=your_mongodb_connection_string
     PORT=5000
     ```
4. **Get Backend URL**: Copy the generated URL

#### Frontend Deployment:
1. **Update API URL** in `src/config.js`:
   ```javascript
   API_URL: 'https://your-backend-url.railway.app'
   ```
2. **Deploy to Netlify**:
   - Drag & drop `build` folder to [netlify.com](https://netlify.com)
   - Or connect GitHub repository

### **Option 2: Render (Alternative Free)**

#### Backend:
1. **Create Render Account**: [render.com](https://render.com)
2. **New Web Service** → Connect GitHub
3. **Environment Variables**:
   ```
   MONGODB_URI=your_connection_string
   ```

#### Frontend:
1. **Static Site** on Render
2. **Build Command**: `npm run build`
3. **Publish Directory**: `build`

### **Option 3: Vercel (Frontend) + Railway (Backend)**

#### Backend: Railway (as above)
#### Frontend: Vercel
1. **Install Vercel CLI**: `npm i -g vercel`
2. **Deploy**: `vercel --prod`
3. **Environment Variables** in Vercel dashboard

## 🔧 Environment Variables

### Backend (.env):
```
MONGODB_URI=mongodb+srv://nileshsingh:Mnbvcxz%40123@srm.qfmvhaz.mongodb.net/shree-raam-hardware?retryWrites=true&w=majority&appName=SRM
PORT=5000
NODE_ENV=production
```

### Frontend:
```
REACT_APP_API_URL=https://your-backend-url.railway.app
```

## 📱 Custom Domain (Optional)

### Free Options:
- **Netlify**: yourstore.netlify.app
- **Vercel**: yourstore.vercel.app
- **Railway**: yourstore.railway.app

### Custom Domain:
1. **Buy Domain**: Namecheap, GoDaddy, etc.
2. **Configure DNS**: Point to hosting provider
3. **SSL Certificate**: Automatic with most providers

## 🔄 Continuous Deployment

### Auto-Deploy on Code Changes:
1. **Connect GitHub** to hosting platform
2. **Enable Auto-Deploy** from main branch
3. **Push changes** → Automatic deployment

## 💰 Cost Breakdown

### Free Tier (Perfect for Start):
- **MongoDB Atlas**: 512MB free
- **Railway**: 500 hours/month free
- **Netlify**: 100GB bandwidth free
- **Total**: $0/month

### Paid Plans (For Growth):
- **MongoDB Atlas**: $9/month (2GB)
- **Railway**: $5/month (8GB RAM)
- **Netlify Pro**: $19/month
- **Total**: ~$33/month

## 🛠 Post-Deployment

### Testing:
1. **Test all features** on live site
2. **Check mobile responsiveness**
3. **Verify database connections**
4. **Test payment flows** (if added)

### Monitoring:
1. **Railway Dashboard**: Monitor backend performance
2. **Netlify Analytics**: Track frontend usage
3. **MongoDB Atlas**: Monitor database usage

## 🔄 Making Changes After Hosting

### Code Changes:
1. **Edit locally** → Test → Push to GitHub
2. **Auto-deployment** will update live site
3. **Database changes** reflect immediately

### Adding Features:
1. **New components** → Deploy automatically
2. **New API routes** → Backend redeploys
3. **Database schema changes** → Update models

## 📞 Support & Maintenance

### Regular Tasks:
- **Monitor performance** weekly
- **Update dependencies** monthly
- **Backup database** regularly
- **Check security** updates

Your store will be live and accessible worldwide! 🌍✨