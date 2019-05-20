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