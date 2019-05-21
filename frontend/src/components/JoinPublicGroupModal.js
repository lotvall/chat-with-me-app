import React, { useState } from 'react'
import { Dropdown, Form, Input, Button, Modal } from 'semantic-ui-react'
import { Mutation, Query } from 'react-apollo';
import { JOIN_PUBLIC_GROUP, PUBLIC_GROUP_QUERY } from '../graphql/groups'
import { USER_QUERY } from '../graphql/user'

const JoinPublicGroupModal = ({ open, onClose, userId }) => {

  const [groupId, setGroupId] = useState(-1)
  const [groupOptions, setGroupOptions] = useState([])


  const handleSubmit = async (joinPublicGroup) => {
    if (groupId < 1) {
      return
    }
    const response = await joinPublicGroup({ variables: { groupId } })
    setGroupId(-1)
    onClose(!open)
  }
  return (
    <Query query={PUBLIC_GROUP_QUERY}>
      {
        ({ loading, error, data: { getPublicGroups = [] }, }) => {

          return (
            <Mutation
              mutation={JOIN_PUBLIC_GROUP}
              update={(cache, { data: { joinPublicGroup } }) => {
                const data = cache.readQuery({ query: USER_QUERY });
                data.getUser.groups.push(joinPublicGroup.group)

                cache.writeQuery({
                  query: USER_QUERY,
                  data
                });
              }}

            >
              {(joinPublicGroup) => (
                <Modal open={open}>
                  <Modal.Header>Join a public group</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Field>
                        <Dropdown
                          placeholder='Select a group'
                          fluid
                          search
                          selection
                          options={getPublicGroups.filter((group) => {
                            if (group.members.filter(m => m.id === parseInt(userId, 10)).length === 0) {
                              return group
                            }

                          })
                            .map(g => ({ key: g.id, value: g.id, text: g.name }))}
                        />
                      </Form.Field>
                      <Form.Group width="equal">
                        <Button type="button" fluid onClick={() => {
                          setGroupId(-1)
                          onClose(!open)
                        }}
                        >Cancel</Button>
                        <Button type="submit" onClick={() => handleSubmit(joinPublicGroup)}
                          fluid>Join Group</Button>
                      </Form.Group>
                    </Form>

                  </Modal.Content>
                </Modal>
              )}
            </Mutation>
          )
        }
      }
    </Query>

  )
}

export default JoinPublicGroupModal
