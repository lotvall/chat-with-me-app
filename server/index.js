import { ApolloServer }  from 'apollo-server'
import path from 'path';
import dotenv from 'dotenv'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models/index'
import jwt from 'jsonwebtoken'

dotenv.config()

const SECRET = process.env.SECRET1
const SECRET2= process.env.SECRET2

const types = fileLoader(path.join(__dirname, './schema'));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const typeDefs = mergeTypes(types, { all: true });

const server = new ApolloServer({ typeDefs, resolvers,
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      const { token, refreshToken } = connectionParams
      if (token && refreshToken) {
        try { 
          const { user } = jwt.verify(token, SECRET)
          return { models, user }
        } catch (err) {
          const { user } = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
          return { models, user } 
        }
      }
      
    } 
  },
  context: ({ req, connection }) => {

    // const token = req.headers.token || '';
    // if (token){
    //   const { user } = jwt.verify(token, SECRET)
    //   return { 
    //     models,
    //     user,
    //     SECRET,
    //     SECRET2,
    //   };
    // }
    return {
      models,
      user: connection ? connection.context.user : req.user,
      SECRET,
      SECRET2,
    }
    
  }
});

const PORT = 8080

models.sequelize.sync().then(function () {
  server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  }); 
});
