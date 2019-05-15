import React from 'react'
import AppLayout from '../components/AppLayout'
import Header from '../components/Header'
import Groups from '../components/Groups'
// import Sidebar from '../containers/Sidebar'
// import MessageContainer from '../containers/MessageContainer'

const App = () => {

  return (

    <AppLayout>
      {/* <Sidebar/> */}
        <Groups/>
        <Header/>
        {/* <MessageContainer/> */}
    </AppLayout>

  )
}

export default (App)