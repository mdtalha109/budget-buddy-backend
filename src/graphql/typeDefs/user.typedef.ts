
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

  type UpdatedUser {
    success: Boolean!
    data: User
    message: String!
  }

  type ApiUpdatePasswordResponse {
    success: Boolean!
    data: User
    message: String!
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): AuthPayload!
    login(email: String!, password: String!): AuthPayload!
    updateUser(id: ID!, name: String, email: String, password: String): UpdatedUser!
    deleteUser(id: ID!): User!
    updatePassword(currentPassword: String, newPassword: String): ApiUpdatePasswordResponse!
  }

`;
