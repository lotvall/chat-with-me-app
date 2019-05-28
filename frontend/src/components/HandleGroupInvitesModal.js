import React from 'react'
import { Modal, Card, Button, Icon } from 'semantic-ui-react'
import { Query } from 'react-apollo';
import { GET_GROUP_INVITES } from '../graphql/groups'
import GroupInvite from './GroupInvite'

const HandleGroupInvitesModal = ({ open, onClose }) => {

  return (

    <Query query={GET_GROUP_INVITES}>
      {({ loading, data: { getPendingGroupInvites = [] }, error }) => {
        console.log(getPendingGroupInvites)
        return (
          <Modal dimmer={"blurring"} open={open} style={{ width: '50%', height: '50%' }}>
            <Modal.Header>Pending Invites</Modal.Header>
            <Modal.Content scrolling style={{ height: '100%' }}>
              <Card.Group>
                {getPendingGroupInvites.map(gi => <GroupInvite key={gi.group.id} group={gi.group} inviter={gi.inviter} />)}


              </Card.Group>

            </Modal.Content>

            <Modal.Actions >
          
              <Button color='green' onClick={() => onClose(!open)}><Icon name='checkmark' /> Done</Button>
            </Modal.Actions>
          </Modal>

        )

      }


      }
    </Query>

  )
}


export default HandleGroupInvitesModal
