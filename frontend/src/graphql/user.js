import gql from 'graphql-tag'

export const USER_QUERY = gql`
query {
  getUser{
    username
    id
    password
    groups {
      id
      admin
      name
      members {
        username
      }
    }
  }
}
`

export const ALL_USERS_QUERY = gql `
query {
  allUsers {
    username
  }
}
`