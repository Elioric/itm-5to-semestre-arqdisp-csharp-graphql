import axios, { AxiosInstance } from 'axios';
import config from '../config';

export interface CountryData {
    id: number;
    name: string;
    abbreviation: string;
    capital: string;
    currency: string;
    phone: string;
    population: number;
    media: {
        flag: string;
        emblem: string;
        orthographic: string;
    };
}

export interface CountryValidation {
    isValid: boolean;
    countryInfo?: CountryData;
    suggestions: string[];
    message: string;
}

export class CountriesService {
    private readonly axiosInstance: AxiosInstance;
    private readonly baseUrl: string;
    private countriesCache: CountryData[] = [];
    private cacheExpiry: number = 0;
    private readonly CACHE_DURATION: number;

    constructor() {
        this.baseUrl = config.countriesApiUrl;
        this.CACHE_DURATION = config.countriesCacheDuration;
        
        this.axiosInstance = axios.create({
            timeout: config.countriesApiTimeout,
            headers: {
                'User-Agent': 'BoardGameAPI/1.0'
            }
        });
    }

    /**
     * Obtener todos los países (con cache)
     */
    async getAllCountries(): Promise<CountryData[]> {
        try {
            // Verificar cache
            if (this.countriesCache.length > 0 && Date.now() < this.cacheExpiry) {
                return this.countriesCache;
            }

            const response = await this.axiosInstance.get(this.baseUrl);
            this.countriesCache = response.data;
            this.cacheExpiry = Date.now() + this.CACHE_DURATION;

            return this.countriesCache;
        } catch (error) {
            console.error('Error fetching countries:', error);
            
            if (this.countriesCache.length > 0) {
                return this.countriesCache;
            }
            
            throw new Error('Unable to fetch countries data');
        }
    }

    /**
     * Buscar país por nombre exacto
     */
    async getCountryByName(countryName: string): Promise<CountryData | null> {
        try {
            const countries = await this.getAllCountries();
            
            // Búsqueda exacta (case insensitive)
            const exactMatch = countries.find(
                country => country.name.toLowerCase() === countryName.toLowerCase()
            );

            return exactMatch || null;
        } catch (error) {
            console.error('Error searching country:', error);
            return null;
        }
    }

    /**
     * Validar país y obtener sugerencias
     */
    async validateCountry(countryName: string): Promise<CountryValidation> {
        try {
            const countries = await this.getAllCountries();
            
            // Búsqueda exacta
            const exactMatch = countries.find(
                country => country.name.toLowerCase() === countryName.toLowerCase()
            );

            if (exactMatch) {
                return {
                    isValid: true,
                    countryInfo: exactMatch,
                    suggestions: [],
                    message: 'Valid country found'
                };
            }

            // Búsqueda de países similares
            const suggestions = this.findSimilarCountries(countryName, countries);

            return {
                isValid: false,
                suggestions,
                message: suggestions.length > 0 
                    ? 'Country not found, but here are some suggestions'
                    : 'Country not found and no similar countries available'
            };

        } catch (error) {
            console.error('Error validating country:', error);
            return {
                isValid: false,
                suggestions: [],
                message: 'Error validating country'
            };
        }
    }

    /**
     * Buscar países similares usando algoritmo simple
     */
    private findSimilarCountries(searchTerm: string, countries: CountryData[]): string[] {
        const term = searchTerm.toLowerCase();
        const suggestions = new Set<string>();

        countries.forEach(country => {
            const countryName = country.name.toLowerCase();
            
            // Coincidencia parcial al inicio
            if (countryName.startsWith(term)) {
                suggestions.add(country.name);
            }
            
            // Coincidencia parcial en cualquier lugar
            else if (countryName.includes(term)) {
                suggestions.add(country.name);
            }
            
            // Coincidencia por palabras
            else if (term.length > 3) {
                const words = term.split(' ');
                const hasWordMatch = words.some(word => 
                    word.length > 2 && countryName.includes(word)
                );
                if (hasWordMatch) {
                    suggestions.add(country.name);
                }
            }
        });

        // Limitar a 5 sugerencias
        return Array.from(suggestions).slice(0, 5);
    }

    /**
     * Obtener países por continente/región (basado en nombre)
     */
    async getCountriesByRegion(region: string): Promise<CountryData[]> {
        try {
            const countries = await this.getAllCountries();
            const regionLower = region.toLowerCase();

            // Esta es una aproximación simple basada en nombres
            // En una implementación real, necesitarías datos de región
            return countries.filter(country => {
                const countryName = country.name.toLowerCase();
                
                // Ejemplos de filtros por región
                switch (regionLower) {
                    case 'america':
                    case 'americas':
                        return countryName.includes('states') || 
                               countryName.includes('brazil') ||
                               countryName.includes('canada') ||
                               countryName.includes('mexico') ||
                               countryName.includes('argentina');
                    
                    case 'europe':
                        return countryName.includes('spain') ||
                               countryName.includes('france') ||
                               countryName.includes('germany') ||
                               countryName.includes('italy') ||
                               countryName.includes('united kingdom');
                    
                    default:
                        return [];
                }
            });
        } catch (error) {
            console.error('Error filtering countries by region:', error);
            return [];
        }
    }

    /**
     * Formatear datos del país para GraphQL
     */
    formatCountryForGraphQL(country: CountryData) {
        return {
            id: country.id,
            name: country.name,
            abbreviation: country.abbreviation,
            capital: country.capital,
            currency: country.currency,
            phone: country.phone,
            population: country.population,
            flag: country.media.flag,
            emblem: country.media.emblem,
            orthographic: country.media.orthographic
        };
    }
}
