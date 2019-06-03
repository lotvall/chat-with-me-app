import gql from "graphql-tag"
export const MESSAGES_QUERY = gql`
    query($groupId: Int!, $cursor: String) {
        messages(groupId: $groupId, cursor: $cursor) {
            cursor
            messages {
                text
                id
                url
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

export const MESSAGES_SUBSCRIPTION = gql`
    subscription($groupId: Int!) {
        newGroupMessage(groupId: $groupId) {
            id
            user {
                username
            }
            text
            created_at
            filetype
        }
    }
`
