import React, {useState} from 'react'
import { Checkbox, Form, Input, Button, Modal } from 'semantic-ui-react'
import { Mutation } from 'react-apollo';

const AddGroupModal = ({ open, onClose, userId }) => {

  const [groupName, setGroupName ] = useState("")
  console.log(open)
  return (
  <Modal open={open}>
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
        <Form.Group width="equal">
          <Button type="button" fluid onClick={() => {
            setGroupName("")
    onClose(!open)
          }}
          >Cancel</Button>
          <Button type="submit" onClick={()=> console.log('submit')} fluid>Add Group</Button>
        </Form.Group>
      </Form>

    </Modal.Content>
  </Modal>
)
}

export default AddGroupModal
