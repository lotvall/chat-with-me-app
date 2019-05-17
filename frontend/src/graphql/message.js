import gql from 'graphql-tag'
export const MESSAGES_QUERY = gql`
query {
  messages(groupId: 1, cursor:null) {
    cursor
    messages {
      text
      id
      filetype
      created_at
      user {
        username
      }
    }
  }
}
`