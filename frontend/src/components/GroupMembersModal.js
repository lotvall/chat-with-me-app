import React, { useState } from 'react'
import { Form, Button, Modal, Icon } from 'semantic-ui-react'
import { Query, Mutation } from 'react-apollo';
import { INVITE_MEMBERS, GET_GROUP_MEMBERS } from '../graphql/groups'

import SelectMultiUsers from './SelectMultiUsers'

const GroupMembersModal = ({ open, onClose, userId, groupId, groupName }) => {

  const [memberInvites, setMemberInvites] = useState([])
  const [groupMembers, setGroupMembers] = useState([])


  const handleSubmit = async (inviteToGroup) => {
    if (!memberInvites.length === 0) {
      return
    }

    const MemberInviteInput = {
      groupId: parseInt(groupId, 10),
      userIds: memberInvites
    }
    await inviteToGroup({ variables: { input: MemberInviteInput } })
    setMemberInvites([])
    onClose(!open)
  }
  return (
    <Query query={GET_GROUP_MEMBERS} variables={{groupId}}>
      {
        ({ loading, error, data: { getGroupMembers = [] }, refetch }) => {

          if (getGroupMembers.length > 0) {
            setGroupMembers(getGroupMembers)
          }

          return (
            <Mutation
      mutation={INVITE_MEMBERS}
      update={(cache, { data: { inviteToGroup } }) => {
        
        refetch()

      }}

    >
      {(inviteToGroup) => (
        <Modal dimmer={"blurring"} open={open} style={{ width: '50%', height: 'fit-content' }}>
          <Modal.Header>Invite Members to {groupName}</Modal.Header>
          <Modal.Content>
            <Form>
            
              <Form.Field>
                <SelectMultiUsers
                  selectedMembers={memberInvites}
                  handleChange={(e, { value }) => setMemberInvites(value)}
                  placeholder="Select users to invite to the group"
                  userId={userId}
                  currentMembers={groupMembers}
                />
              </Form.Field>

            </Form>

          </Modal.Content>
          <Modal.Actions >
            <Button type="button" color='red' onClick={() => {
              setMemberInvites([])
              onClose(!open)
            }}
            > <Icon name='close' />Cancel</Button>
            <Button type="submit" onClick={() => handleSubmit(inviteToGroup)} color='green' ><Icon name='checkmark' /> Create</Button>

          </Modal.Actions>
        </Modal>
      )}
    </Mutation>
          )

        }
        
      }
    </Query>
    
  )
}

export default  GroupMembersModal