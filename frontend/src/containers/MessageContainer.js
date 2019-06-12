import React, { useState } from 'react'
import { Query } from 'react-apollo';
import { Comment } from 'semantic-ui-react'
import moment from 'moment'
import SendMessage from '../components/SendMessage'
import { MESSAGES_QUERY, MESSAGES_SUBSCRIPTION } from '../graphql/message'
import FileUpload from '../components/FileUpload'
import RenderTextFile from '../components/RenderTextFile'




const Message = ({ url, text, filetype }) => {

    if (url) {
        if (filetype.startsWith('image')) {
            return <div><img alt="" src={`${url}`} /></div>
        } else if (filetype === 'text/plain') {
             return <RenderTextFile url ={url}/>
        } else if (filetype.startsWith('audio')) {
            return <div><audio controls>
                <source src={url} type={filetype} />
            </audio> </div>
        }
    }

    return <Comment.Text>{text}</Comment.Text>

}
const message = ({ id, text, user, created_at, url, filetype }) => (
    <Comment key={`message-${id}`}>
        <Comment.Content>
            <Comment.Author as='a'>{user.username}</Comment.Author>
            <Comment.Metadata>
                <div>
                    {moment(created_at, "ddd MMM D YYYY HH:mm:ss Z").fromNow()}
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

    const [hasMoreMessages, setHasMoreMessages] = useState(true)

    
    

    let unsubscribe = null;
    return (
        <Query
            query={MESSAGES_QUERY}
            variables={{ groupId: parseInt(groupId, 10), cursor: null }}

        >
            {
                ({ loading, error, data, subscribeToMore, fetchMore }) => {
                    if (loading || !data) {
                        return null
                    }
                    if (error) console.log(error)

                    if (!unsubscribe) {
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
                                    return newData
                                }
                            },
                            onError: err => console.error(err),
                        })
                    }

                    const messages = data.messages ? data.messages.messages : []
                    const cursor = data.messages ? data.messages.cursor : null
                    let scrolling = null

                    const handleScroll = () => {
                        if (
                            scrolling &&
                            scrolling.scrollTop < 100 &&
                            hasMoreMessages &&
                            messages.length >= 35 &&
                            messages.length < 1000 && // prevent infinite loop
                            !!cursor
                        ) {

                            fetchMore({
                                variables: {
                                    groupId: parseInt(groupId, 10),
                                    cursor,
                                },
                                updateQuery: (previousResult, { fetchMoreResult }) => {

                                    if (!fetchMoreResult) {
                                        return previousResult;
                                    }

                                    if (fetchMoreResult.messages.length < 35) {
                                        setHasMoreMessages( false);
                                    }
                                    const newResult = {
                                        messages: {
                                            ...previousResult,
                                            cursor: fetchMoreResult.messages.cursor,
                                            messages: [...previousResult.messages.messages, ...fetchMoreResult.messages.messages.filter(message => !previousResult.messages.messages.some(PrevMessage => message.id === PrevMessage.id))],
                                            __typename: "MessagesResponse"
                                        }
                                        
                                    }

                                    return newResult
                                },
                            });
                        }
                    }

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
                            onScroll={handleScroll}
                            ref={scroller => {
                                scrolling = scroller
                            }}

                        >
                            <SendMessage
                                groupName={groupName}
                                groupId={groupId}
                            />
                            <FileUpload noClick groupId={groupId}>

                                <Comment.Group>
                                    {[...messages].reverse().map(message)}
                                </Comment.Group>
                            </FileUpload>


                        </div>
                     
                    )
                }
            }
        </Query>
    )
}

export default MessageContainer