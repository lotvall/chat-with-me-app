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
    input GroupInput {
        name: String!
        publicGroup: Boolean!
        members: [Int!]
    }
    input InviteInput {
       groupId: Int!
       userIds: [Int!]! 
    }

    type InviteResponse {
        ok: Boolean!,
        userId: Int!,
        error: String
    }

    type Mutation {
        createGroup (input: GroupInput!) : GroupResponse!
        joinPublicGroup(groupId: Int!) : GroupResponse!
        inviteToGroup(input: InviteInput!): [InviteResponse!]!
        handleGroupInvite(joining: Boolean!, groupId: Int!): GroupResponse!
    }

`;