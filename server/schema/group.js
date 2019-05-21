export default `
    type Group {
        id: Int!
        name: String!
        messages: [Message!]!
        members: [User!]!
        admin: Boolean!
        public_group: Boolean!
    }

    type GroupResponse {
        ok: Boolean!
        group: Group
        error: [Error!]
    }
    type GroupInvite {
        group: Group,
        inviter: User
    }
    type Query {
        getGroupMembers(groupId: Int!): [User!]!
        getPublicGroups: [Group!]!
        getPendingGroupInvites: [GroupInvite!]!
    }
    type Mutation {
        createGroup (name: String!, publicGroup: Boolean!) : GroupResponse!
        joinPublicGroup(groupId: Int!) : GroupResponse!
        inviteToGroup(groupId: Int!, userId: Int!): Boolean!
        handleGroupInvite(joining: Boolean!, groupId: Int!): GroupResponse!
    }

`;