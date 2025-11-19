import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: process.env.PORT,
    mongoUrl: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
    // Configuración de la API de países
    countriesApiUrl: process.env.COUNTRIES_API_URL || 'https://api.sampleapis.com/countries/countries',
    countriesApiTimeout: parseInt(process.env.COUNTRIES_API_TIMEOUT || '5000'),
    countriesCacheDuration: parseInt(process.env.COUNTRIES_CACHE_DURATION || '86400000')
}

export default config;