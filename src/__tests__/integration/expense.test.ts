// src/__tests__/ExpenseResolver.test.ts

import request from 'supertest';
import { Application } from 'express';
import { startServer } from '../..';
import prisma from '../../utils/prisma';

describe('Expense Management', () => {
  let token: string;

  let app: Application;
  let expenseId: number;

  beforeAll(async () => {
    app = await startServer();

    const res = await request(app)
      .post('/graphql')
      .send({
        query: `
                mutation {
                    login(email: "testuser@example.com", password: "password123") {
                        token
                        user {
                            id
                            name
                            email
                        }
                    }
                }
            `,
      });

    token = res.body.data.login.token;
  });

  it('should add a new expense', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
              mutation {
                addExpense(description: "Test Expense", amount: 50.0, date: "2023-06-22", category: "Test") {
                  id
                  description
                  amount
                  date
                  category
                  userId
                }
              }
            `,
      });

    const expense = res.body.data.addExpense;
    expenseId = expense.id;

    expect(expense).toHaveProperty('id');
    expect(expense.description).toBe('Test Expense');
    expect(expense.amount).toBe(50.0);
    expect(expense.category).toBe('Test');
  });

  it('should get expenses for the user', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
                    query {
                        getExpenses {
                        id
                        description
                        amount
                        date
                        category
                        userId
                        }
                    }
                `,
      });

    const expenses = res.body.data.getExpenses;

    expect(expenses).toBeInstanceOf(Array);
    expect(expenses.length).toBeGreaterThan(0);
    expect(expenses[0]).toHaveProperty('id');
  });

  it('should get expense by id', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
                    query {
                        getExpenseById(id: ${expenseId}) {
                        id
                        description
                        amount
                        date
                        category
                        userId
                        }
                    }
                `,
      });

    const expense = res.body.data.getExpenseById;

    expect(expense).toHaveProperty('id');
    expect(expense.id).toBe(expenseId);
  });

  it('should update an expense', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
                    mutation {
                        updateExpense(id: ${expenseId}, description: "Updated Expense", amount: 75.0, date: "2023-06-23", category: "Updated") {
                            id
                            description
                            amount
                            date
                            category
                            userId
                        }
                    }
                `,
      });

    const expense = res.body.data.updateExpense;

    expect(expense).toHaveProperty('id');
    expect(expense.description).toBe('Updated Expense');
    expect(expense.amount).toBe(75.0);
  });

  it('should delete an expense', async () => {
    const res = await request(app)
      .post('/graphql')
      .set('Authorization', `Bearer ${token}`)
      .send({
        query: `
                    mutation {
                        deleteExpense(id: ${expenseId}) {
                        id
                        }
                    }
                `,
      });

    const deletedExpense = res.body.data.deleteExpense;

    expect(deletedExpense).toHaveProperty('id');
    expect(deletedExpense.id).toBe(expenseId);
  });
});
