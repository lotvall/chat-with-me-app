import gql from 'graphql-tag'

export const CREATE_GROUP = gql`
mutation ($input: GroupInput!){
  createGroup(input: $input) {
    ok
    group {
      name
      id
      public_group
    }
  }
}`

export const PUBLIC_GROUP_QUERY = gql`
query{
  getPublicGroups{
    id
    name
    admin
    members {
      id
    }
  }
}
`

export const JOIN_PUBLIC_GROUP = gql`
mutation($groupId: Int!) {
  joinPublicGroup(groupId: $groupId) {
  group {
    name
    public_group
    id
    admin
    
  }
}
}`

export const GET_GROUP_INVITES = gql`
query {
  getPendingGroupInvites {
    group {
      name
      id
      members {
        id
      }
    }
    inviter {
      id
      username
    }
  }
}
`

export const HANDLE_GROUP_INVITE = gql `
mutation ($joining: Boolean!, $groupId: Int!){
  handleGroupInvite(joining: $joining, groupId: $groupId) {
    ok
    group {
      id
      name
    }
  }
}
`