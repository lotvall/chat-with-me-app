import React, {useState} from 'react'

import Groups from '../components/Groups'
import AddGroupModal from '../components/AddGroupModal'
import JoinPublicGroupModal from '../components/JoinPublicGroupModal';
import HandleGroupInvitesModal from '../components/HandleGroupInvitesModal';




const Sidebar = ({groups, username, userId}) => {
  const [ openCreateGroupModal, setOpenCreateGroupModal ] = useState(false)
  const [ openJoinGroupModal, setOpenJoinGroupModal ] = useState(false)

  console.log(userId)


    return (
                                <>
                                    <Groups 
                                        groups={groups} 
                                        username={username}

                                        //create group modal
                                        openCreateGroupModal={openCreateGroupModal}
                                        setOpenCreateGroupModal={setOpenCreateGroupModal}
                                        
                                        //join public group modal
                                        openJoinGroupModal={openJoinGroupModal}
                                        setOpenJoinGroupModal={setOpenJoinGroupModal}
                                    />
                                    <AddGroupModal 
                                        open={openCreateGroupModal}
                                        onClose={setOpenCreateGroupModal}
                                        userId={userId}
                                    />
                                    <JoinPublicGroupModal 
                                        open={openJoinGroupModal}
                                        onClose={setOpenJoinGroupModal}
                                        userId={userId}
                                    />
                                    <HandleGroupInvitesModal />
                                </>
        )
    } 

export default Sidebar