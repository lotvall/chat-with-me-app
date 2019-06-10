import React from 'react'
import styled from 'styled-components'
import { Header, Button } from 'semantic-ui-react'

const Root = styled.div`
    grid-column: 3;
    grid-row: 1;
    margin-top: 10px;
    padding-left: 30px;
`

export default ({ admin, groupName, groupMembers, openAdd, closeAdd, openCheck, closeCheck }) => (
    <Root>
        <Header>
        <div style={{fontSize: '14px'}}>

         { admin && <Button onClick={()=> closeAdd(!openAdd)} compact style={{paddingRight: '5px!important', background: 'none'}} size='small' icon='plus'/> 
         }

         <Button onClick={()=> closeCheck(!openCheck)} compact style={{paddingRight: '5px!important', background: 'none'}} size='small' content={groupMembers.length} icon='user outline' />
         #{groupName}

        
        </div>

    
        
        </Header>
    </Root>
)