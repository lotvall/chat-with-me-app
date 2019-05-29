import React, { useState } from 'react'
import { Checkbox, Form, Input, Button, Modal, Icon } from 'semantic-ui-react'
import { Mutation } from 'react-apollo';
import { CREATE_GROUP } from '../graphql/groups'
import { USER_QUERY } from '../graphql/user'
import SelectMultiUsers from './SelectMultiUsers'

const AddGroupModal = ({ open, onClose, userId }) => {

  const [groupName, setGroupName] = useState("")
  const [publicGroup, setPublicGroup] = useState(true)
  const [groupMembers, setGroupMembers] = useState(null)



  const handleSubmit = async (createGroup) => {
    if (!groupName || !groupName.trim()) {
      return
    }
    const response = await createGroup({ variables: { name: groupName, public: publicGroup, members: groupMembers } })
    setGroupName("")
    onClose(!open)
  }
  return (
    <Mutation
      mutation={CREATE_GROUP}
      update={(cache, { data: { createGroup } }) => {
        const data = cache.readQuery({ query: USER_QUERY });

        console.log(createGroup.group)
        data.getUser.groups.push(createGroup.group)

        cache.writeQuery({
          query: USER_QUERY,
          data
        });
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

export default AddGroupModal
