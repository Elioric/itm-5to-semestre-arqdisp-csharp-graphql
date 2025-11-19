import { IResolvers } from '@graphql-tools/utils';
import GMR from 'graphql-merge-resolvers';
import boardgame from './boardgame';
import user from './user';

const resolver: any = GMR.merge({
    boardgame,
    user
})



export default resolver;