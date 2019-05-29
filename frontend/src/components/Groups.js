import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react'
import {Link} from 'react-router-dom'

const GroupWrapper = styled.div`
  display: grid;
  grid-column: 1 / span 2;
  grid-row: 1 / 4;
  background-color: #1757a6;
  color: #b5d6ff;
  padding-top: 10px;
`;

const TeamNameHeader = styled.h1`
  color: #fff;
  font-size: 20px;
  margin-top: 10px;
`;

const SideBarList = styled.ul`
  width: 100%;
  list-style: none;
  padding-left: 0px;
`;

const paddingLeft = 'padding-left: 2px';

const SideBarListItem = styled.li`
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;

const SideBarListHeader = styled.li`padding: 2px;  margin-bottom: 1em`;

const PushLeft = styled.div`padding-left: 30px;`;

const Green = styled.span`color: #38978d;`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

const group = ({ id, name, public_group }) => <Link style={{color: '#b5d6ff'}} to={`/app/${id}`} key={`group-${id}`}><SideBarListItem><PushLeft>{public_group ? <Icon name="globe" /> : <Icon name="lock" />} {name}</PushLeft></SideBarListItem></Link>

export default ({groups, username, notifications, openCreateGroupModal, setOpenCreateGroupModal, openJoinGroupModal, setOpenJoinGroupModal, openHandleGroupInvitesModal, setOpenHandleGroupInvitesModal}) => (
  <GroupWrapper>
    <div>
      <TeamNameHeader><PushLeft>{username }  
      
      <Icon.Group style={{paddingLeft: '5px'}}>
        <Icon name="bell" size="small" onClick={() => setOpenHandleGroupInvitesModal(!openHandleGroupInvitesModal)}/>
        {notifications && <Icon name="circle" corner='top right' color="red"/>}
      </Icon.Group>
      
      
      </PushLeft></TeamNameHeader>
      <SideBarList>
        <SideBarListHeader><PushLeft>Groups  <Icon onClick={() => setOpenCreateGroupModal(!openCreateGroupModal)} name="add circle"/> <Icon onClick={() => setOpenJoinGroupModal(!openJoinGroupModal)} name="search"/> </PushLeft></SideBarListHeader> 
        {groups.map(g => group(g))}
      </SideBarList>
    </div>
    
  </GroupWrapper>
);