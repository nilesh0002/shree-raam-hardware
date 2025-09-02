// API Configuration
const config = {
  development: {
    API_URL: 'http://localhost:5000'
  },
  production: {
    API_URL: 'https://your-backend-url.railway.app' // Replace with your hosted backend URL
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_URL = config[environment].API_URL;