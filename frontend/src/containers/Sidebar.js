import React, {useState} from 'react'

import Groups from '../components/Groups'
import AddGroupModal from '../components/AddGroupModal'




const Sidebar = ({groups, username, userId}) => {
  const [ openCreateGroupModal, setOpenCreateGroupModal ] = useState(false)

    return (
                                <>
                                    <Groups 
                                        groups={groups} 
                                        username={username}
                                        openCreateGroupModal={openCreateGroupModal}
                                        setOpenCreateGroupModal={setOpenCreateGroupModal}
                                    />
                                    <AddGroupModal 
                                        open={openCreateGroupModal}
                                        onClose={setOpenCreateGroupModal}
                                        userId={userId}
                                    />
                                </>
        )
    } 

export default Sidebar