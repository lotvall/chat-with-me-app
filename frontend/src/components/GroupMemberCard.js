import React from 'react'
import { Card } from 'semantic-ui-react'


const GroupMemberCard = ({name, active}) => {

  return (
        <Card style={{ width: '100%' }}>
          <Card.Content >
            <Card.Header>{name}</Card.Header>
            <Card.Meta>{active ? "Member" :"Invited"} </Card.Meta>
          </Card.Content>
          {!active && <Card.Content extra>
            Invite to the group is pending.
          </Card.Content>}
        </Card>
  )
}

export default GroupMemberCard