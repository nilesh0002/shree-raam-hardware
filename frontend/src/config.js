// API Configuration for Vercel
const config = {
  development: {
    API_URL: 'http://localhost:5000'
  },
  production: {
    API_URL: '' // Same domain for Vercel full-stack deployment
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_URL = config[environment].API_URL;