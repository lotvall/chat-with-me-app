import React from 'react'
import styled from 'styled-components'
import { Header } from 'semantic-ui-react'

const Root = styled.div`
    grid-column: 3;
    grid-row: 1;
    margin-top: 10px;
`

export default ({ groupName }) => (
    <Root>
        <Header textAlign="center"># Group Name</Header>
    </Root>
)