import gql from 'graphql-tag'

export const USER_QUERY = gql`
query {
  getUser{
    username
    id
    groups {
      members {
        username
        id
      }
      id
      name
      public_group
    }
  }
}
`

export const ALL_USERS_QUERY = gql `
query {
  allUsers {
    username
    id
  }
}
`
