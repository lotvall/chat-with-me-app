import React from 'react'
import AppLayout from '../components/AppLayout'
import Header from '../components/Header'
import Sidebar from '../containers/Sidebar'
import MessageContainer from '../containers/MessageContainer'
import { Query } from 'react-apollo'

import { USER_QUERY } from '../graphql/user'

const App = ({match: {params: {groupId}}}) => {
  console.log( 'groupid',groupId)
  return (
    <Query query={USER_QUERY} fetchPolicy={"network-only"} notifyOnNetworkStatusChange={true}>{

      ({ loading, error, data, networkStatus}) => {
        console.log('.....networkStatus', networkStatus);
        if (loading || !data) {
          return null
        }
        if (error) {
          console.log(error)
        }

        if (data) {
          console.log(data) 
        }

        const {groups, username, id } = data.getUser

        const selectedGroup = groups.find(g => {
          return g.id === parseInt(groupId, 10)
        })
        const userId = id        
        return (

          <AppLayout>
            <Sidebar groups={groups} username={username} userId={userId} />
            <Header groupName={selectedGroup.name} />
            <MessageContainer groupName={selectedGroup.name} groupId={groupId}/>
          </AppLayout>

        )
      }

    }</Query>)


}

export default (App)