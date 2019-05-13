import { ApolloServer, gql }  from 'apollo-server'
import { Pool, Client } from 'pg'

const connectionString = `postgressql://${process.env.dbUser}:${process.env.dbPassword}@localhost:5432/chat_with_me`

const client = new Client({
  connectionString
})

client.connect()

client.query('SELECT * FROM users', (err, res) => {
  console.log(err, res)
  client.end()
})

const types = fileLoader(path.join(__dirname, './schema'));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')))
const typeDefs = mergeTypes(types, { all: true });

const server = new ApolloServer({ typeDefs, resolvers });

const PORT = 8080

server.listen(PORT).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});