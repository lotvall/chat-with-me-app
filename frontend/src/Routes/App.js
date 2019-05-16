import React from 'react'
import AppLayout from '../components/AppLayout'
import Header from '../components/Header'
import Groups from '../components/Groups'
// import Sidebar from '../containers/Sidebar'
// import MessageContainer from '../containers/MessageContainer'
import { Query } from 'react-apollo'

import { USER_QUERY } from '../graphql/user'

const App = () => {
  return (
    <Query query={USER_QUERY}>{

      ({ loading, error, data }) => {
        if (loading || !data) {
          return null
        }
        if (error) {
          console.log(error)
        }

        if (data) {
          console.log(data)
        }

        return (

          <AppLayout>
            {/* <Sidebar/> */}
            <Groups />
            <Header />
            {/* <MessageContainer/> */}
          </AppLayout>

        )
      }

    }</Query>)


}

export default (App)