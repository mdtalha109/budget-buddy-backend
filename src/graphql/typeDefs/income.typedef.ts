export const incomeTypeDef = `#graphql


scalar Date

type Income {
  id: ID!
  description: String!
  amount: Float!
  date: Date!
  category: String
  userId: ID!
}


type Query {
  getIncomes: [Income!]!
  getIncomeById(id: ID!): Income
}

type Mutation {
  addIncome(
    description: String!,
    amount: Float!,
    date: Date!,
    category: String
  ): Income!

  updateIncome(
    id: ID!,
    description: String,
    amount: Float,
    date: Date,
    category: String
  ): Income!

  deleteIncome(id: ID!): Income!
}

`;
