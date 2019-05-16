import { ApolloServer }  from 'apollo-server'
import path from 'path';
import dotenv from 'dotenv'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models/index'
import jwt from 'jsonwebtoken'
import { refreshTokens } from './helpers/auth'

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
      console.log('is token here?', token, refreshToken)

      if (token && refreshToken) {
        try { 
          const { user } = jwt.verify(token, SECRET)
          console.log('try,', user)
          return { models, user }
        } catch (err) {
          console.log('catch block')

          const { user } = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
          if (!user) {
            throw new Error ('Not authenticated')
          }

          return { models, user } 
        }
      } else {
        throw new Error ('Not authenticated')
      }
      
    } 
  },
  context: async ({ req, connection }) => {

    connection ? 
      console.log('is the user here connection', connection.context.user) : 
      console.log('is the user here req', req.user)
      console.log(req.headers.token)

      if (!connection && !req.user) {
        const { token, refreshtoken } = req.headers
      

        if (token && refreshtoken) {
          try { 

            const { user } = await jwt.verify(token, SECRET)
            console.log('user', user)
            return { models, user, SECRET, SECRET2, }
          } catch (err) {
  
            const { user } = await refreshTokens(token, refreshToken, models, SECRET, SECRET2);
  
            return { models, user, SECRET, SECRET2, }
          }
        }

      }

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
