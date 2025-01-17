// config.js
const isDevelopment = () => {
    return window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.hostname.includes('.local');
};

const config = {
    development: {
        baseURL: 'http://localhost:8084'
    },
    production: {
        baseURL: 'https://imaginative-charisma-production.up.railway.app'
    }
};

export const baseURL = isDevelopment() ? config.development.baseURL : config.production.baseURL;
