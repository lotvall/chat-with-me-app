import React from 'react'
import { Query } from 'react-apollo';
import { Comment } from 'semantic-ui-react'
import moment from 'moment'
import SendMessage from '../components/SendMessage'
import { MESSAGES_QUERY } from '../graphql/message'



const Message = ({ url, text, filetype }) => {

    return <Comment.Text>{text}</Comment.Text>

}
const message = ({ id, text, user, created_at, url, filetype }) => (
    <Comment key={`message-${id}`}>
        <Comment.Content>
            <Comment.Author as='a'>{user.username}</Comment.Author>
            <Comment.Metadata>
                <div>
                    {moment(created_at, "ddd MMM D YYYY HH:mm:ss").fromNow()}
                </div>
            </Comment.Metadata>

            <Message url={url} text={text} filetype={filetype} />

            <Comment.Actions>
                <Comment.Action>Reply</Comment.Action>
            </Comment.Actions>
        </Comment.Content>
    </Comment>
);


const MessageContainer = ({ groupId, groupName }) => {
    console.log(groupId,'from groupid')
    return (
        <Query
            query={MESSAGES_QUERY}
            variables={{ groupId: parseInt(groupId, 10), cursor: null }}
            fetchPolicy={"network-only"}
        >
            {
                ({ loading, error, data }) => {
                    if (loading) return null
                    if (error) console.log(error)
                    if (data) console.log('data', data)

                    const messages = data.messages ? data.messages.messages : []
                    const cursor = data.messages ? data.messages.cursor : null
                    return (
                        <div
                            style={{
                                gridColumn: 3,
                                gridRow: 2,
                                paddingLeft: '20px',
                                paddingRight: '20px',
                                display: 'flex',
                                flexDirection: 'column-reverse',
                                overflowY: 'auto',
                            }}

                        >
                            <SendMessage
                                groupName={groupName}
                                groupId={groupId}
                            />
                            <Comment.Group>
                                {[...messages].reverse().map(message)}
                            </Comment.Group>

                        </div>
                    )
                }
            }
        </Query>
    )
}

export default MessageContainer