import gql from 'graphql-tag'

export const CREATE_GROUP = gql`mutation ($name:String!){
  createGroup(name:$name) {
    ok
    group {
      id
      name
    }
  }
}`