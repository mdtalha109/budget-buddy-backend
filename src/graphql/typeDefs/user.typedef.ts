export const userTypeDef = `#graphql
type User {
    id: ID!
    name: String!
    email: String!
    password: String!
  }

  type AuthPayload {
    token: String!
    user: User!
  }

  type Query {
    getUser(id: ID!): User
    me: User
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(id: ID!, name: String, email: String, password: String): User!
    deleteUser(id: ID!): User!
  }

`;
