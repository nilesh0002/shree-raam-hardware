// API Configuration for Vercel
const config = {
  development: {
    API_URL: 'http://localhost:5000'
  },
  production: {
    API_URL: 'https://srmhardwarestore-git-main-nileshs-projects-ad1a54cb.vercel.app'
  }
};

const environment = process.env.NODE_ENV || 'development';
export const API_URL = config[environment].API_URL;