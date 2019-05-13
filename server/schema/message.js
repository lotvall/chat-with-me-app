export default `

    type Message {
        id: Int!
        text: String
        user: User!
        group: Group!
        created_at: String!
        url: String
        filetype: String
    }

     input File {
        type: String!
        path: String!
    }

    type Subscription {
        newGroupMessage(groupId: Int!) : Message!
    }

    type MessagesResponse {
        cursor: String
        messages: [Message!]!
    }

    type Query {
        messages(cursor: String, groupId: Int!) :  MessagesResponse!
    }

    type Mutation {
        createMessage (groupId: Int!, text: String, file: Upload) : Boolean!
    }
`;