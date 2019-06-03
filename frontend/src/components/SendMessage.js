import React, {useState} from 'react'
import { Mutation } from 'react-apollo'
import styled from 'styled-components'
import { Input, Button, Icon } from 'semantic-ui-react'
import { CREATE_MESSAGE } from '../graphql/message'
import FileUpload from './FileUpload'

const Root = styled.div`
    grid-column: 3;
    grid-row: 3;
    margin: 20px;
    display: grid;
    grid-template-columns: 50px auto;
`
const ENTER_KEY = 13

const SendMessage = ({
    groupName,
    groupId,
}) => {
    const [text, setText] = useState("")
    return (
        <Mutation mutation={CREATE_MESSAGE}>
      {(createMessage) => (
        <Root>  
                    <FileUpload groupId={groupId}>
                        <Button icon>
                            <Icon name='plus' />
                        </Button>
                    </FileUpload> 
                        
            
            <Input
                onKeyDown={async (e) => {
                    console.log(e.keyCode)
                    if (e.keyCode === ENTER_KEY) {
                        if (!text || !text.trim()) {
                            return
                        }
                        const response = await createMessage({variables: {text, groupId: parseInt(groupId, 10) }})
                        setText("")
                    }
                }}
                value={text}
                name="message"
                onChange={e => setText(e.target.value)}
                placeholder={`# ${groupName}`}
                autoComplete="off"
            />
        </Root>
      )}
      </Mutation>
    )}

export default SendMessage