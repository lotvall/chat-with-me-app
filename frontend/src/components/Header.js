import React from 'react'
import styled from 'styled-components'
import { Header, Icon, Button, Label } from 'semantic-ui-react'

const Root = styled.div`
    grid-column: 3;
    grid-row: 1;
    margin-top: 10px;
    padding-left: 30px;
`

export default ({ groupName, groupMembers, open, onClose }) => (
    <Root>
        <Header>
        <div style={{fontSize: '14px'}}>

         <Button onClick={()=> onClose(!open)} compact style={{paddingRight: '5px!important', background: 'none'}} size='small' content={groupMembers.length} icon='user outline' />
         #{groupName}

        
        </div>

    
        
        </Header>
    </Root>
)