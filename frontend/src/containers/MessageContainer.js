import React from 'react'
import { Query } from 'react-apollo';
import { Comment } from 'semantic-ui-react'
import moment from 'moment'
import SendMessage from '../components/SendMessage'
import { MESSAGES_QUERY, MESSAGES_SUBSCRIPTION } from '../graphql/message'




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


const MessageContainer = ({ groupName, groupId }) => {
    console.log(groupId,'from groupid')

    let unsubscribe = null;
    return (
        <Query
            query={MESSAGES_QUERY}
            variables={{ groupId: parseInt(groupId, 10), cursor: null }}
            
        >
            {
                ({ loading, error, data, subscribeToMore}) => {
                    if (loading || !data) {
                        return null
                    }
                    if (error) console.log(error)
                    if (data) console.log('data', data)

                    // this doesnt run sometimes when the messages array is empty
                    // removing fetchPolicy={"network-only"} fixed this for now
                    // think this will have problems once we have any users and many groups

                    if(!unsubscribe) {
                        unsubscribe = subscribeToMore({
                                    document: MESSAGES_SUBSCRIPTION,
                                    variables: { groupId: parseInt(groupId, 10) },
                                    fetchPolicy: 'network-only',
                                    updateQuery: (prev, { subscriptionData }) => {
                                        if (!subscriptionData.data) return prev;

                                        // Test to see if item is already in the store
                                        const idAlreadyExists =
                                            prev.messages.messages.filter(item => {
                                                return item.id === subscriptionData.data.newGroupMessage.id;
                                            }).length > 0;

                                        // Only add it if it isn't already there
                                        if (!idAlreadyExists) {

                                            const newData = {
                                                ...prev,
                                                messages: {
                                                    cursor,
                                                    messages: [subscriptionData.data.newGroupMessage, ...prev.messages.messages],
                                                    __typename: "MessagesResponse"

                                                }
                                            }
                                            console.log(newData)
                                            return newData
                                        }
                                    },
                                    onError: err => console.error(err),
                                })
                    }

                    const messages = data.messages ? data.messages.messages : []
                    const cursor = data.messages ? data.messages.cursor : null

                    console.log('is this running?', messages, groupName, groupId)
                    
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