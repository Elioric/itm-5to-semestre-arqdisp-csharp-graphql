import {GraphQLSchema} from 'graphql';
import 'graphql-import-node';
import  boardGameSchema from './schemas/boardgame.graphql';
import  userSchema from './schemas/user.graphql';
import { makeExecutableSchema } from '@graphql-tools/schema';
import mergeTypeDefs from 'graphql-tools-merge-typedefs';
import boardGameResolver from './resolvers/boardgame';
import userResolver from './resolvers/user';

export const schema: GraphQLSchema = makeExecutableSchema({
    typeDefs: mergeTypeDefs([
        boardGameSchema,
        userSchema
    ]),
    resolvers: [boardGameResolver, userResolver]
});