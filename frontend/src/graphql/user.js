import gql from 'graphql-tag'

export const USER_QUERY = gql`
query {
  getUser{
    username
    id
    groups {
      id
      name
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