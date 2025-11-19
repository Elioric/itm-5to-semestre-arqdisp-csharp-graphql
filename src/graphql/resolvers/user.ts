import { IResolvers } from '@graphql-tools/utils';
import { Db, ObjectId } from 'mongodb';
import { CountriesService } from '../../services/countriesService';

const countriesService = new CountriesService();

const userResolver: IResolvers = {
    Query: {
        getUsers: async (parent, args, context: Db) => {
            try {
                const users = await context.collection('users').find().toArray();
                return users ?? [];
            } catch (error) {
                console.log(error);
                throw new Error("Error fetching users");
            }
        },
        
        getUser: async (parent, args, context: Db) => {
            try {
                const user = await context.collection('users').findOne({ _id: new ObjectId(args.id) });
                if (!user) throw new Error("User not found");
                return user;
            } catch (error) {
                console.log(error);
                throw new Error("Error fetching user");
            }
        },

        getUsersByCountry: async (parent, args, context: Db) => {
            try {
                // Primero validar que el país existe
                const countryValidation = await countriesService.validateCountry(args.countryName);
                if (!countryValidation.isValid) {
                    throw new Error(`Invalid country: ${args.countryName}`);
                }

                const users = await context.collection('users').find({ 
                    pais: new RegExp(args.countryName, 'i') 
                }).toArray();
                
                return users ?? [];
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        getCountryInfo: async (parent, args) => {
            try {
                const country = await countriesService.getCountryByName(args.countryName);
                if (!country) throw new Error("Country not found");
                
                return countriesService.formatCountryForGraphQL(country);
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        getAllCountries: async () => {
            try {
                const countries = await countriesService.getAllCountries();
                return countries.map(country => countriesService.formatCountryForGraphQL(country));
            } catch (error) {
                console.log(error);
                throw new Error("Error fetching countries");
            }
        },

        validateCountry: async (parent, args) => {
            try {
                const validation = await countriesService.validateCountry(args.countryName);
                
                return {
                    isValid: validation.isValid,
                    countryInfo: validation.countryInfo 
                        ? countriesService.formatCountryForGraphQL(validation.countryInfo)
                        : null,
                    suggestions: validation.suggestions,
                    message: validation.message
                };
            } catch (error) {
                console.log(error);
                throw new Error("Error validating country");
            }
        }
    },

    Mutation: {
        createUser: async (parent, args, context: Db) => {
            try {
                const { user } = args;
                
                // Validar email único
                const reg_ex = new RegExp(user.email, 'i');
                const existingUser = await context.collection('users').findOne({ email: reg_ex });
                if (existingUser) {
                    throw new Error("User with this email already exists");
                }

                // Validar país
                const countryValidation = await countriesService.validateCountry(user.pais);
                if (!countryValidation.isValid) {
                    const suggestions = countryValidation.suggestions.length > 0 
                        ? ` Suggestions: ${countryValidation.suggestions.join(', ')}` 
                        : '';
                    throw new Error(`Invalid country: ${user.pais}.${suggestions}`);
                }

                const newUser = {
                    ...user,
                    pais: countryValidation.countryInfo!.name, // Usar nombre oficial
                    fechaRegistro: new Date().toISOString(),
                    juegosComprados: [],
                    activo: true
                };

                await context.collection('users').insertOne(newUser);
                return "User created successfully";
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        updateUser: async (parent, args, context: Db) => {
            try {
                const { _id, user } = args;
                
                const existingUser = await context.collection('users').findOne({ _id: new ObjectId(_id) });
                if (!existingUser) {
                    throw new Error("User not found");
                }

                // Si se está actualizando el país, validarlo
                if (user.pais) {
                    const countryValidation = await countriesService.validateCountry(user.pais);
                    if (!countryValidation.isValid) {
                        const suggestions = countryValidation.suggestions.length > 0 
                            ? ` Suggestions: ${countryValidation.suggestions.join(', ')}` 
                            : '';
                        throw new Error(`Invalid country: ${user.pais}.${suggestions}`);
                    }
                    user.pais = countryValidation.countryInfo!.name; // Usar nombre oficial
                }

                // Si se está actualizando el email, verificar que sea único
                if (user.email && user.email !== existingUser.email) {
                    const reg_ex = new RegExp(user.email, 'i');
                    const emailExists = await context.collection('users').findOne({ 
                        email: reg_ex,
                        _id: { $ne: new ObjectId(_id) }
                    });
                    if (emailExists) {
                        throw new Error("Email already in use by another user");
                    }
                }

                await context.collection('users').updateOne(
                    { _id: new ObjectId(_id) },
                    { $set: user }
                );

                return "User updated successfully";
            } catch (error) {
                console.log(error);
                throw error;
            }
        },

        deleteUser: async (parent, args, context: Db) => {
            try {
                const { _id } = args;
                
                const existingUser = await context.collection('users').findOne({ _id: new ObjectId(_id) });
                if (!existingUser) {
                    throw new Error("User not found");
                }

                await context.collection('users').deleteOne({ _id: new ObjectId(_id) });
                return "User deleted successfully";
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    },

    User: {
        async countryInfo(parent) {
            try {
                if (!parent.pais) return null;
                
                const country = await countriesService.getCountryByName(parent.pais);
                if (!country) return null;
                
                return countriesService.formatCountryForGraphQL(country);
            } catch (error) {
                console.log(error);
                return null;
            }
        }
    }
};

export default userResolver;
