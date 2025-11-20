import express, { Application } from "express";
import cors from "cors";
import { ApolloServer } from "apollo-server-express";
import { schema } from "./graphql";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core"
import MongoLib from "./mongo";
import config from "./config";

const app: Application = express();  
app.use(cors());

// Crear una instancia única de MongoDB
const mongoLib = new MongoLib();

const server = new ApolloServer({
    schema,
    introspection: true,
    plugins: [
        ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    context: async () => {
        try {
            const db = await mongoLib.connect();
            return db;
        } catch (error) {
            console.error('Error connecting to database in context:', error);
            throw new Error('Database connection failed');
        }
    }
})


async function startServer() {
    try {
        // Verificar conexión a MongoDB antes de iniciar el servidor
        await mongoLib.connect();
        console.log('✅ MongoDB connection verified');
        
        // Iniciar Apollo Server
        await server.start();
        server.applyMiddleware({ app });

        const port = config.port;
        app.listen({ port }, () => {
            console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`);
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}

startServer();