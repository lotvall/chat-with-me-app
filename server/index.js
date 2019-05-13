import { ApolloServer, gql }  from 'apollo-server'

const types = fileLoader(path.join(__dirname, './schema'));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const typeDefs = mergeTypes(types, { all: true });

const server = new ApolloServer({ typeDefs, resolvers });

const PORT = 8080

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});