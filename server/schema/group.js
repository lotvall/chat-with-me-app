export default `
    type Group {
        id: Int!
        name: String!
        messages: [Message!]!
        members: [User!]!
        admin: Boolean!
    }

    type GroupResponse {
        ok: Boolean!
        group: Group
        error: [Error!]
    }
    type Query {
        getGroupMembers(groupId: Int!): [User!]!
    }
    type Mutation {
        createGroup (name: String!) : GroupResponse!
        joinGroup(groupId: Int!): GroupResponse!
    }

`;