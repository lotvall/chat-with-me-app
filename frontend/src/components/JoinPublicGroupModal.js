import React, { useState } from 'react'
import { Dropdown, Form, Icon, Button, Modal } from 'semantic-ui-react'
import { Mutation, Query } from 'react-apollo';
import { JOIN_PUBLIC_GROUP, PUBLIC_GROUP_QUERY } from '../graphql/groups'
import { USER_QUERY } from '../graphql/user'
import { withRouter } from 'react-router-dom'

const JoinPublicGroupModal = ({ open, onClose, userId , history}) => {

  const [groupId, setGroupId] = useState(-1)

  const handleSubmit = async (joinPublicGroup) => {
    if (groupId < 1) {
      return
    }
    await joinPublicGroup({ variables: { groupId } })
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

                const publicGroupData = cache.readQuery({ query:PUBLIC_GROUP_QUERY})


                const newPublicGroupData = {
                  getPublicGroups: publicGroupData.getPublicGroups.filter(group => group.id !== joinPublicGroup.group.id)
                  }

                cache.writeQuery({
                  query: PUBLIC_GROUP_QUERY,
                  data:newPublicGroupData
                })

                return
                
              }}

            >
              {(joinPublicGroup) => (
                <Modal dimmer={"blurring"} open={open} style={{ width: '50%', height: 'fit-content' }}>
                  <Modal.Header>Join a public group</Modal.Header>
                  <Modal.Content>
                    <Form>
                      <Form.Field>
                        <Dropdown
                          placeholder='Select a group'
                          fluid
                          search
                          selection
                          value={groupId}
                          onChange={(e, { value }) => setGroupId(value)}
                          options={
                            getPublicGroups.filter((group) => {
                              if (group.members.filter(m => m.id === parseInt(userId, 10)).length === 0) {
                                return group
                              }
                              return null
                            })
                            .map(g => ({ key: g.id, value: g.id, text: g.name }))
                          }
                        />
                      </Form.Field>
                      <Modal.Actions >
                        <Button type="button" color='red' onClick={() => {
                          setGroupId(-1)
                          onClose(!open)
                        }}
                        > <Icon name='close'/> Cancel</Button>
                        <Button type="submit" color='green' onClick={() => handleSubmit(joinPublicGroup)}
                          ><Icon name='checkmark' /> Join Group</Button>
                      </Modal.Actions>
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

export default withRouter(JoinPublicGroupModal)
