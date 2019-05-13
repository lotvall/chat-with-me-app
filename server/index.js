import { ApolloServer }  from 'apollo-server'
import path from 'path';
import dotenv from 'dotenv'
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models/index'

dotenv.config()

console.log(process.env.dbUsername)
const types = fileLoader(path.join(__dirname, './schema'));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const typeDefs = mergeTypes(types, { all: true });

const server = new ApolloServer({ typeDefs, resolvers,
  context: ({ req, connection }) => {
    return { 
      models,
      user: connection ? connection.context.user : req.user,
      SECRET: process.env.SECRET1,
      SECRET2: process.env.SECRET2,

    };
  }
});

const PORT = 8080

models.sequelize.sync().then(function () {
  server.listen(PORT).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
  }); 
});
