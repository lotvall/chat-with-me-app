import React from 'react'
import { Dropdown } from 'semantic-ui-react'
import { Query } from 'react-apollo';
import { ALL_USERS_QUERY } from '../graphql/user'

const SelectMultiUsers = ({ userId, selectedMembers, currentMembers = [], handleChange, placeholder }) => {

  return (
    <Query query={ALL_USERS_QUERY}>
      {
        ({ loading, error, data: { allUsers = [] }, }) => {

          return (

            <Dropdown
              multiple={true}
              placeholder={placeholder}
              fluid
              search
              selection
              value={selectedMembers}
              onChange={handleChange}
              options={allUsers
                .filter(user => user.id !== userId)
                .filter((user) => !currentMembers.find(({ id }) => user.id === id))
                .map(m => ({ key: m.id, value: m.id, text: m.username }))}

            />
          )
        }
      }
    </Query>

  )
}

export default SelectMultiUsers
