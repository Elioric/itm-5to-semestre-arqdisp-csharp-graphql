import { MongoClient, Db, MongoClientOptions } from 'mongodb'
import config from '../config';
const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as MongoClientOptions;
  
export default class MongoLib {
    private readonly client: MongoClient
    private readonly dbName: string = config.dbName || 'boardgamesdb';
    private readonly mongoUri: string = config.mongoUrl || 'mongodb://admin:secret@localhost:27017';
    private static connection: Db
    /**
     *
     */
    
    constructor() {
        this.client = new MongoClient(this.mongoUri, options)
    }
    async connect() {
        if (!MongoLib.connection) {
            try {
                await this.client.connect()
                console.log('Connected successfully to mongo');
                MongoLib.connection = this.client.db(this.dbName)
            } catch (error) {
                console.error('Failed to connect to MongoDB:', error);
                throw new Error('MongoDB connection failed');
            }
        }
        
        if (!MongoLib.connection) {
            throw new Error('MongoDB connection is not available');
        }
        
        return MongoLib.connection
    }
}