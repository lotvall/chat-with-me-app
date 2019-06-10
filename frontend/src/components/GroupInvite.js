import React from 'react'
import { Card, Button } from 'semantic-ui-react'
import { Mutation } from 'react-apollo'
import { HANDLE_GROUP_INVITE, GET_GROUP_INVITES } from '../graphql/groups'
import { USER_QUERY } from '../graphql/user'


const GroupInvite = ({ group, inviter }) => {

  const handleAccept = (handleGroupInvite) => {
    handleGroupInvite({ variables: { joining: true, groupId: group.id } })
  }

  const handleDecline = (handleGroupInvite) => {
    handleGroupInvite({ variables: { joining: false, groupId: group.id } })
  }
  return (
    <Mutation mutation={HANDLE_GROUP_INVITE}
      update={(cache, { data: { handleGroupInvite } }) => {

        // add to grouplist
        if (handleGroupInvite.group) {
          const groupData = cache.readQuery({ query: USER_QUERY });

       

          groupData.getUser.groups.push(handleGroupInvite.group)
          
          cache.writeQuery({
            query: USER_QUERY,
            data: groupData
          });
        }


        const inviteData = cache.readQuery({ query: GET_GROUP_INVITES });

        const newInviteData = inviteData.getPendingGroupInvites.filter(invite => invite.group.id !== group.id)

        cache.writeQuery({
          query: GET_GROUP_INVITES,
          data: { getPendingGroupInvites: newInviteData }
        });



      }}




    >
      {(handleGroupInvite) => (

        <Card style={{ width: '100%' }}>
          <Card.Content >
            <Card.Header>{group.name}</Card.Header>
            <Card.Meta>{group.members.length} {group.members.length === 1 ? "member" : "members"}</Card.Meta>
            <Card.Description>
              {inviter ? inviter.username : "Somebody"} wants to add you to the group <strong>{group.name}</strong>
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            <div className='ui two buttons'>
              <Button basic color='green' onClick={() => handleAccept(handleGroupInvite)}>
                Approve
          </Button>
              <Button basic color='red' onClick={() =>  handleDecline(handleGroupInvite)}>
                Decline
          </Button>
            </div>
          </Card.Content>
        </Card>
      )}
    </Mutation>
  )
}

export default GroupInvite