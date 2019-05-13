export default `

    type User {
        id: Int!
        username: String!
        password: String
        groups: [Group!]!
    }

    type Query {
        getUser: User!
        singleUser(userId: Int!): User
        allUsers: [User!]!
    }

    type RegisterResponse {
        ok: Boolean!
        user: User
        errors: [Error!]
    }

    type LoginResponse {
        ok: Boolean!
        token: String
        refreshToken: String
        errors: [Error!]
    }

    type Mutation {
        registerUser(username: String!, password: String!): RegisterResponse!
        login(username: String!, password: String!): LoginResponse!

    }
`