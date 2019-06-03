import React, { useState } from 'react'
import AppLayout from '../components/AppLayout'
import Header from '../components/Header'
import Sidebar from '../containers/Sidebar'
import MessageContainer from '../containers/MessageContainer'
import { Query } from 'react-apollo'

import { USER_QUERY } from '../graphql/user'
import GroupMembersModal from '../components/GroupMembersModal'
import ViewMembersModal from '../components/ViewMembersModal';
import {withRouter} from 'react-router-dom'

const App = ({match: {params: {groupId}}, history}) => {

  const [openGroupMemeberModal, setOpenGroupMemeberModal] = useState(false)
  const [openViewMembersModal, setOpenViewMembersModal] = useState(false)

  console.log( 'groupid',groupId)
  return (
    <Query query={USER_QUERY}>{

      ({ loading, error, data}) => {
        if (loading || !data) {
          return null
        }
        if (error) {
          console.log(error)
        }

        if (data) {
          console.log(data.getUser.groups) 
        }

        const {groups, username, id } = data.getUser

        const selectedGroup = groups.find(g => {
          return g.id === parseInt(groupId, 10)
        })

        const hasGroups = data.getUser.groups.length === 0 ? false : true
        const userId = id 

        if(hasGroups && !selectedGroup) {
          history.push(`/app/${groups[0].id}`)
        }

        console.log(selectedGroup)       
        return (


          <AppLayout>
            <Sidebar groups={groups} username={username} userId={userId} />
            {hasGroups && <Header admin={selectedGroup.admin} groupName={selectedGroup.name} groupMembers={selectedGroup.members}  
              openAdd={openGroupMemeberModal} closeAdd={setOpenGroupMemeberModal}
              
              openCheck={openViewMembersModal} closeCheck={setOpenViewMembersModal}

            /> }
            {hasGroups && <MessageContainer groupName={selectedGroup.name} groupId={groupId}/>}
            {hasGroups && <GroupMembersModal currentMembers={selectedGroup.members} userId={userId} groupId={selectedGroup.id} groupName={selectedGroup.name} open={openGroupMemeberModal} onClose={setOpenGroupMemeberModal}/> }

            {hasGroups && <ViewMembersModal 
              currentMembers={selectedGroup.members} userId={userId} groupId={selectedGroup.id} groupName={selectedGroup.name} open={openViewMembersModal} onClose={setOpenViewMembersModal}/> }

            </AppLayout>

        )
      }

    }</Query>)


}

export default withRouter(App)