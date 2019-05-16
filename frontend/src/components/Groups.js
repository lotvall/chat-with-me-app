import React from 'react';
import styled from 'styled-components';
import { Icon } from 'semantic-ui-react'

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

const paddingLeft = 'padding-left: 30px';

const SideBarListItem = styled.li`
  padding: 2px;
  ${paddingLeft};
  &:hover {
    background: #3e313c;
  }
`;

const SideBarListHeader = styled.li`${paddingLeft};`;

const PushLeft = styled.div`${paddingLeft};`;

const Green = styled.span`color: #38978d;`;

const Bubble = ({ on = true }) => (on ? <Green>●</Green> : '○');

export default () => (
  <GroupWrapper>
    <PushLeft>
      <TeamNameHeader>Username</TeamNameHeader>
      
    </PushLeft>
    <div>
      <SideBarList>
        <SideBarListHeader>Groups <Icon onClick={console.log('clicked Groups')} name="add circle"/></SideBarListHeader> 
      </SideBarList>
    </div>
    <div>
      <SideBarList>
        <SideBarListHeader>Friends{ <Icon onClick={console.log('Friends')} name="add circle"/> }</SideBarListHeader> 
      </SideBarList>
    </div>
  </GroupWrapper>
);