import { IResolvers } from '@graphql-tools/utils';
import { Db, ObjectId } from 'mongodb';

const boardGameResolver: IResolvers = {
    Query: {
        getBoardGames: async (parent, args, context: Db) => {
            try {
                const boardGames = await context.collection('boardgames').find().toArray();
                return boardGames.map(game => ({
                    ...game,
                    dependenciaIdioma: getDependenciaIdiomaEnum(game.dependenciaIdioma)
                })) ?? [];
            } catch (error) {
                console.log(error);
                throw new Error("Error fetching board games");
            }
        },
        getBoardGame: async (parent, args, context: Db) => {
            try {
                const boardGame = await context.collection('boardgames').findOne({ _id: new ObjectId(args.id) });
                if (!boardGame) throw new Error("Board game not found");
                
                return {
                    ...boardGame,
                    dependenciaIdioma: getDependenciaIdiomaEnum(boardGame.dependenciaIdioma)
                };
            } catch (error) {
                console.log(error);
                throw new Error("Error fetching board game");
            }
        }
    },
    Mutation: {
        createBoardGame: async (parent, args, context: Db) => {
            try {
                const { boardGame } = args;
                
                // Validar que minJugadores sea menor o igual a maxJugadores
                if (boardGame.minJugadores > boardGame.maxJugadores) {
                    throw new Error("Minimum players cannot be greater than maximum players");
                }
                
                // Validar dependenciaIdioma
                if (boardGame.dependenciaIdioma < 0 || boardGame.dependenciaIdioma > 2) {
                    throw new Error("Dependencia idioma must be between 0 and 2");
                }
                
                // Verificar si ya existe un juego con el mismo nombre
                const reg_ex = new RegExp(boardGame.nombre, 'i');
                const existingGame = await context.collection('boardgames').findOne({ nombre: reg_ex });
                if (existingGame) {
                    throw new Error("Board game already exists");
                }

                await context.collection('boardgames').insertOne(boardGame);
                return "Board game created successfully";
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        updateBoardGame: async (parent, args, context: Db) => {
            try {
                const { _id, boardGame } = args;
                
                const existingGame = await context.collection('boardgames').findOne({ _id: new ObjectId(_id) });
                if (!existingGame) {
                    throw new Error("Board game not found");
                }

                // Validaciones
                if (boardGame.minJugadores && boardGame.maxJugadores) {
                    if (boardGame.minJugadores > boardGame.maxJugadores) {
                        throw new Error("Minimum players cannot be greater than maximum players");
                    }
                } else if (boardGame.minJugadores && boardGame.minJugadores > existingGame.maxJugadores) {
                    throw new Error("Minimum players cannot be greater than maximum players");
                } else if (boardGame.maxJugadores && existingGame.minJugadores > boardGame.maxJugadores) {
                    throw new Error("Minimum players cannot be greater than maximum players");
                }
                
                if (boardGame.dependenciaIdioma !== undefined && (boardGame.dependenciaIdioma < 0 || boardGame.dependenciaIdioma > 2)) {
                    throw new Error("Dependencia idioma must be between 0 and 2");
                }

                await context.collection('boardgames').updateOne(
                    { _id: new ObjectId(_id) },
                    { $set: boardGame }
                );

                return "Board game updated successfully";
            } catch (error) {
                console.log(error);
                throw error;
            }
        },
        deleteBoardGame: async (parent, args, context: Db) => {
            try {
                const { _id } = args;
                
                const existingGame = await context.collection('boardgames').findOne({ _id: new ObjectId(_id) });
                if (!existingGame) {
                    throw new Error("Board game not found");
                }

                await context.collection('boardgames').deleteOne({ _id: new ObjectId(_id) });
                return "Board game deleted successfully";
            } catch (error) {
                console.log(error);
                throw error;
            }
        }
    }
};

// Helper function para convertir el número a enum
function getDependenciaIdiomaEnum(value: number): string {
    switch (value) {
        case 0:
            return 'NINGUNA';
        case 1:
            return 'PARCIAL';
        case 2:
            return 'TOTAL';
        default:
            return 'NINGUNA';
    }
}

export default boardGameResolver;
