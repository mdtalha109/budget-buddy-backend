export const expenseTypeDef = `#graphql

scalar Date

type Expense {
  id: ID
  description: String
  amount: Float
  date: String
  category: String
  userId: ID
}

type RecurringMetadata {
  frequency: String
  interval: Int
  endDate: String
  occurrences: Int
  currentOccurrence: Int
  nextOccurrence: String
  paused: Boolean
  recurringMetadata: RecurringMetadata
}

type ApiResponse {
  success: Boolean!
  data: Expense
  message: String!
}

type getExpensesApiResponse {
  success: Boolean!
  data: [Expense]!
  message: String!
}

extend type Query {
  getExpenses(startDate: String!, endDate: String!): getExpensesApiResponse!
  getExpenseById(id: ID!): Expense
  totalExpenses(startDate: String!, endDate: String!): Float!
}



extend type Mutation {
  addExpense(
    description: String!, 
    amount: Float!, 
    date: String!, 
    category: String,
    frequency: String, 
    interval: Int, 
    endDate: String, 
    occurrences: Int, 
    nextOccurrence: String, 
    paused: Boolean
  ): ApiResponse!
  
  updateExpense(
    id: ID!, 
    description: String, 
    amount: Float, 
    date: Date, 
    category: String,
    frequency: String, 
    interval: Int, 
    endDate: String, 
    occurrences: Int, 
    nextOccurrence: String, 
    paused: Boolean
  ): ApiResponse!
  deleteExpense(id: ID!): ApiResponse!
  pauseExpense(id: ID!): ApiResponse!
  resumeExpense(id: ID!): ApiResponse!
}

`;
