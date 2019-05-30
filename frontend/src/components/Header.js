import React from 'react'
import styled from 'styled-components'
import { Header, Icon, Button, Label } from 'semantic-ui-react'

const Root = styled.div`
    grid-column: 3;
    grid-row: 1;
    margin-top: 10px;
    padding-left: 30px;
`

export default ({ groupName }) => (
    <Root>
        <Header>
        <div style={{fontSize: '14px'}}>

        <Button compact style={{paddingRight: '5px!important', background: 'none'}} size='small' content='4' icon='user outline' />
        {  }
         #{groupName}

        
        </div>

        {/* 
        
        <Button as='div' labelPosition='right'>
      <Button basic color='blue'>
        <Icon name='fork' />
        Fork
      </Button>
      <Label as='a' basic color='blue' pointing='left'>
        2,048
      </Label>
    </Button>
        
         */}
        

         

         {/* <Icon name="circle add" size='tiny'/> */}
        </Header>
    </Root>
)