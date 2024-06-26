export const expenseTypeDef = `#graphql

scalar Date

type Expense {
  id: ID!
  description: String!
  amount: Float!
  date: String!
  category: String
  userId: ID!
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

extend type Query {
  getExpenses: [Expense!]!
  getExpenseById(id: ID!): Expense
}

extend type Mutation {
  addExpense(
    description: String!, 
    amount: Float!, 
    date: Date!, 
    category: String,
    frequency: String, 
    interval: Int, 
    endDate: String, 
    occurrences: Int, 
    nextOccurrence: String, 
    paused: Boolean
  ): Expense!
  
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
  ): Expense!
  deleteExpense(id: ID!): Expense!
  pauseExpense(id: ID!): Expense!
  resumeExpense(id: ID!): Expense!
}

`;
