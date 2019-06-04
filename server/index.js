import { ApolloServer }  from 'apollo-server-express'
import express from 'express'
import http from 'http'


import path from 'path';
import dotenv from 'dotenv'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models/index'
import jwt from 'jsonwebtoken'
import { refreshTokens } from './helpers/auth'

dotenv.config()

const app = express();

app.use('/uploads', express.static('uploads'))


const SECRET = process.env.SECRET1
const SECRET2= process.env.SECRET2

const types = fileLoader(path.join(__dirname, './schema'));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const typeDefs = mergeTypes(types, { all: true });

const server = new ApolloServer({ typeDefs, resolvers,
  subscriptions: {
    onConnect: async (connectionParams, webSocket) => {
      const { token, refreshtoken } = connectionParams
      console.log('are tokens in onConnect?', !!token, !!refreshtoken)

      if (token && refreshtoken) {
        try { 
          const { user } = jwt.verify(token, SECRET)
          console.log('try,', user)
          return { models, user }
        } catch (err) {
          console.log('catch block')

          const { user } = await refreshTokens(token, refreshtoken, models, SECRET, SECRET2);
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

      if (!connection && !req.user) {
        const { token, refreshtoken } = req.headers

        if (token && refreshtoken) {
          try { 
            const { user } = await jwt.verify(token, SECRET)
            return { models, user, SECRET, SECRET2, }
          } catch (err) {
            
            // refreshToken not defined, needs to be refreshtoken
          
            const { user } = await refreshTokens(token, refreshtoken, models, SECRET, SECRET2);
  
            return { models, user, SECRET, SECRET2, }
          }
        }

      }

    return {
      models,
      user: connection ? connection.context.user : req.user,
      SECRET,
      SECRET2,
      serverUrl: req.protocol + '://' + req.get('host')
    }
    
  }
});

server.applyMiddleware({ app })

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

const PORT = 8080
// { force: true }
// models.sequelize.sync().then(function () {
//   httpServer.listen(PORT).then(({ url }) => {
//     console.log(`🚀  Server ready at ${url}`);
//   }); 
// });
models.sequelize.sync().then(function () {
  httpServer.listen(PORT, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
    console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
    }); 
  });
