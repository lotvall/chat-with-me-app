export default `
    type Group {
        id: Int!
        name: String!
        messages: [Message!]!
        members: [User!]
    }

    type GroupResponse {
        ok: Boolean!
        group: Group
        error: [Error!]
    }
    type Mutation {
        createGroup (name: String!) : GroupResponse!
    }

`;