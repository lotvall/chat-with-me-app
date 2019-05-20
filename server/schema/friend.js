export default `

    type Friend {
        id: Int!
        user1: Int!
        user2: Int!
        active: Boolean!
        created_at: String!
    }
    type Query {
      getFriends: [User!]!
      getPendingFriends: [User!]!
    }
    
    type Mutation {
      createFriendRequest(userId: Int!): Boolean!
      handleFriendRequest(accepting: Boolean!, friendId: Int!): Boolean!
    }
`
