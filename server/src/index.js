import { ApolloServer }  from 'apollo-server-express'
import express from 'express'
import http from 'http'
import cors from 'cors'


import path from 'path';
import dotenv from 'dotenv'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import getModels from './models/index'
import jwt from 'jsonwebtoken'
import { refreshTokens } from './helpers/auth'

dotenv.config()

const app = express();

app.use('/uploads', express.static('uploads'))
app.use(cors())


const SECRET = process.env.SECRET1
const SECRET2= process.env.SECRET2

const types = fileLoader(path.join(__dirname, './schema'));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const typeDefs = mergeTypes(types, { all: true });

getModels().then((models) => {
  if (!models) {
    console.log('Could not connect to database');
    return;
  }

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
      console.log('is req here beginning of context', 'what about now') //first no, then true
  
      connection ? 
        console.log('is the user here connection', connection.context.user) : 
        console.log('is the user here req', req.user)
  
        if (!connection && !req.user) {
          const { token, refreshtoken } = req.headers
  
          if (token && refreshtoken) {
            try { 
              const { user } = await jwt.verify(token, SECRET)
              console.log('is req here try', !!req) // true
              console.log('TESTING', req.protocol + '://' + req.get('host'))
  
  
              return { models, user, SECRET, SECRET2, serverUrl:`${req.protocol}://${req.get('host')}`
            }
            } catch (err) {
              
              // refreshToken not defined, needs to be refreshtoken
  
              console.log('is req here catch', !!req)
            
              const { user } = await refreshTokens(token, refreshtoken, models, SECRET, SECRET2);
    
              return { models, user, SECRET, SECRET2}
            }
          }
  
        }
        // console.log('TESTING', req.protocol + '://' + req.get('host'))
        // console.log('is req here last return', !!req)
  
      return {
        models,
        user: connection ? connection.context.user : req.user,
        SECRET,
        SECRET2,
  
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
      console.log(server)
      console.log(server.subscriptionServer)
      console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`)
      console.log(`🚀 Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`)
      }); 
    });  

})

