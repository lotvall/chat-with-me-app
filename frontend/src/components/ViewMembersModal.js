import React from 'react'
import { Modal, Card, Button, Icon } from 'semantic-ui-react'
import { Query } from 'react-apollo';
import { GET_GROUP_MEMBERS } from '../graphql/groups'
import GroupMemberCard from './GroupMemberCard'

const ViewMembersModal = ({ open, onClose, groupId, currentMembers, groupName}) => {

  return (

    <Query query={GET_GROUP_MEMBERS} variables={{groupId}}>
      {({ loading, data: { getGroupMembers = [] }, error }) => {
        console.log(getGroupMembers)
        
        return (
          <Modal dimmer={"blurring"} open={true} style={{ width: '50%', height: '50%' }}>
            <Modal.Header>Current Members of {groupName} </Modal.Header>
            <Modal.Content scrolling style={{ height: '100%' }}>
              <Card.Group>
                {getGroupMembers.map(user => {
                  console.log(user)
                  return <GroupMemberCard key={user.id} name={user.username} active={false}/>
                
                })}


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


export default ViewMembersModal
