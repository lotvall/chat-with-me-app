import React from 'react'
import Dropzone from 'react-dropzone'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const createFileMessageMutation = gql`
  mutation($groupId: Int!, $file: Upload!) {
    createMessage(groupId: $groupId, file: $file)
  }
`

const FileUpload = ({ children, noClick, groupId }) => (
  <Mutation mutation={createFileMessageMutation}>
    {mutate => (
      <Dropzone noClick={noClick} noKeyboard onDrop={async ([file]) =>  {
        const response = await mutate({ variables: { groupId: parseInt(groupId, 10), file } })
        return response

        }
        
        }>
        {({ getRootProps, getInputProps }) => (
          <div style={{ border: 'none' }} {...getRootProps({ className: 'dropzone' })}>
            <input {...getInputProps()} />
            {children}
          </div>
        )}
      </Dropzone>
    )}
  </Mutation>
)

export default FileUpload