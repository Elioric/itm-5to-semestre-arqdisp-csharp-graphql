import dotenv from 'dotenv';
dotenv.config();

const config = {
    port: Number.parseInt(process.env.PORT || '4001'),
    mongoUrl: process.env.MONGO_URI,
    dbName: process.env.DB_NAME,
    // Configuración de la API de países
    countriesApiUrl: process.env.COUNTRIES_API_URL || 'https://api.sampleapis.com/countries/countries',
    countriesApiTimeout: Number.parseInt(process.env.COUNTRIES_API_TIMEOUT || '5000'),
    countriesCacheDuration: Number.parseInt(process.env.COUNTRIES_CACHE_DURATION || '86400000')
}

export default config;