import gql from 'graphql-tag'

export const CREATE_GROUP = gql`
mutation ($name:String!, $public:Boolean!){
  createGroup(name:$name, publicGroup: $public) {
    group {
      name
      id
    }
  }
}`

export const PUBLIC_GROUP_QUERY = gql`
query{
  getPublicGroups{
    id
    name
    admin
    members {
      id
    }
  }
}
`

export const JOIN_PUBLIC_GROUP = gql`
mutation($groupId: Int!) {
  joinPublicGroup(groupId: $groupId) {
  group {
    name
    public_group
    id
    admin
  }
}
}`