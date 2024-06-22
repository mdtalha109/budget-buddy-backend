export const expenseTypeDef = `#graphql

type Expense {
  id: ID!
  description: String!
  amount: Float!
  date: String!
  category: String
  userId: ID!
}

extend type Query {
  getExpenses: [Expense!]!
  getExpenseById(id: ID!): Expense
}

extend type Mutation {
  addExpense(description: String!, amount: Float!, date: String!, category: String): Expense!
  updateExpense(id: ID!, description: String, amount: Float, date: String, category: String): Expense!
  deleteExpense(id: ID!): Expense!
}

`;
