import gql from "graphql-tag"
export const MESSAGES_QUERY = gql`
    query($groupId: Int!, $cursor: String) {
        messages(groupId: $groupId, cursor: $cursor) {
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

export const CREATE_MESSAGE = gql`
    mutation($groupId: Int!, $text: String!) {
        createMessage(groupId: $groupId, text: $text)
    }
`
