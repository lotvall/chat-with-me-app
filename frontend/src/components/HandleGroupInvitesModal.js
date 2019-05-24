import React, { useState } from 'react'
import { Modal, Card } from 'semantic-ui-react'
import { Mutation, Query } from 'react-apollo';
import { GET_GROUP_INVITES } from '../graphql/groups'
import GroupInvite from './GroupInvite'

const HandleGroupInvitesModal = ({ open, onClose, userId }) => {

  const [groupName, setGroupName] = useState("")
  const [publicGroup, setPublicGroup] = useState(true)


  const handleSubmit = async (createGroup) => {
    if (!groupName || !groupName.trim()) {
      return
    }
    const response = await createGroup({ variables: { name: groupName, public: publicGroup } })
    setGroupName("")
    onClose(!open)
  }
  return (

    <Query query={GET_GROUP_INVITES} fetchPolicy="network-only">
      {({ loading, data: { getPendingGroupInvites = []}, error }) => {
        console.log(getPendingGroupInvites)
        return (
          <Modal dimmer={"blurring"} open={true} style={{ width: '50%', height: '50%' }}>
            <Modal.Header>Pending Invites</Modal.Header>
            <Modal.Content scrolling style={{ height: '100%' }}>
              <Card.Group>
                {getPendingGroupInvites.map(gi => <GroupInvite key={gi.group.id} group={gi.group} inviter={gi.inviter} />)}
              </Card.Group>
            </Modal.Content>
          </Modal>

        )

      }


      }
    </Query>

  )
}


export default HandleGroupInvitesModal
