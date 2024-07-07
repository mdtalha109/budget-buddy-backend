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

type getIncomesApiResponse {
  success: Boolean!
  data: [Income]!
  message: String!
}

type ApiResponse {
  success: Boolean!
  data: Expense
  message: String!
}


type Query {
  getIncomes(startDate: String!, endDate: String!): getIncomesApiResponse!
  getIncomeById(id: ID!): Income,
  totalIncomes(startDate: String!, endDate: String!): Float!
}

type Mutation {
  addIncome(
    description: String!,
    amount: Float!,
    date: String!,
    category: String
  ): ApiResponse!

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
