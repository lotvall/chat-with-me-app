import React, { useState } from 'react'
import { Checkbox, Form, Input, Button, Modal, Icon } from 'semantic-ui-react'
import { Mutation } from 'react-apollo';
import { CREATE_GROUP } from '../graphql/groups'
import { USER_QUERY } from '../graphql/user'
import SelectMultiUsers from './SelectMultiUsers'
import { withRouter } from 'react-router-dom'

const AddGroupModal = ({ open, onClose, userId, history }) => {

  const [groupName, setGroupName] = useState("")
  const [publicGroup, setPublicGroup] = useState(true)
  const [groupMembers, setGroupMembers] = useState([])



  const handleSubmit = async (createGroup) => {
    if (!groupName || !groupName.trim()) {
      return
    }

    const GroupInput = {
      name: groupName,
      publicGroup,
      members: groupMembers
    }
    await createGroup({ variables: { input: GroupInput } })
    setGroupName("")
    setPublicGroup(true)
    setGroupMembers([])
    onClose(!open)
  }
  return (
    <Mutation
      mutation={CREATE_GROUP}
      update={(cache, { data: { createGroup } }) => {
        const data = cache.readQuery({ query: USER_QUERY });

        const newGroup = {
          ...createGroup.group,
          admin: true
        }
        data.getUser.groups.push(newGroup)

        cache.writeQuery({
          query: USER_QUERY,
          data
        });

        history.push(`/app/${newGroup.id}`)
      }}

    >
      {(createGroup) => (
        <Modal dimmer={"blurring"} open={open} style={{ width: '50%', height: 'fit-content' }}>
          <Modal.Header>Create Group</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <Input
                  fluid
                  icon="group"
                  iconPosition="left"
                  placeholder="Group Name"
                  onChange={e => setGroupName(e.target.value)}
                  value={groupName} />
              </Form.Field>
              <Form.Field>
                <SelectMultiUsers
                  selectedMembers={groupMembers}
                  handleChange={(e, { value }) => setGroupMembers(value)}
                  placeholder="Select users to invite to your group"
                  userId={userId}
                />
              </Form.Field>
              <Form.Field>
                <Checkbox
                  checked={publicGroup}
                  label='Public Group'
                  onChange={() => setPublicGroup(!publicGroup)}
                  toggle

                />
              </Form.Field>

            </Form>

          </Modal.Content>
          <Modal.Actions >
            <Button type="button" color='red' onClick={() => {
              setGroupName("")
              onClose(!open)
            }}
            > <Icon name='close' />Cancel</Button>
            <Button type="submit" onClick={() => handleSubmit(createGroup)} color='green' ><Icon name='checkmark' /> Create</Button>

          </Modal.Actions>
        </Modal>
      )}
    </Mutation>
  )
}

export default withRouter(AddGroupModal)
