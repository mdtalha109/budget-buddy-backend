import Joi from 'joi';

export const incomeSchema = Joi.object({
  description: Joi.string().required().messages({
    'string.base': 'Description should be a type of string',
    'string.empty': 'Description cannot be an empty field',
    'any.required': 'Description is a required field',
  }),
  amount: Joi.number().positive().required().messages({
    'number.base': 'Amount should be a type of number',
    'number.positive': 'Amount must be a positive number',
    'any.required': 'Amount is a required field',
  }),
  date: Joi.date().required().messages({
    'date.base': 'Date should be a valid date',
    'any.required': 'Date is a required field',
  }),
  category: Joi.string().optional().allow(null, '').messages({
    'string.base': 'Category should be a type of string',
  }),
});