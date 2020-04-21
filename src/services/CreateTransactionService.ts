import { getCustomRepository, getRepository } from 'typeorm';
import AppError from '../errors/AppError';

import Transaction from '../models/Transaction';
import Category from '../models/Category';
import TransactionsRepository from '../repositories/TransactionsRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const categoriesRepository = getRepository(Category);
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    let categoryObj = await categoriesRepository.findOne({
      where: { title: category },
    });

    if (!categoryObj) {
      categoryObj = categoriesRepository.create({
        title: category,
      });
      await categoriesRepository.save(categoryObj);
    }

    if (type === 'outcome') {
      const balance = await transactionsRepository.getBalance();
      const saldo = balance.total - value;
      if (saldo < 0) {
        throw new AppError(
          `Balance cannot be negative! With this launch I would be ${saldo}`,
        );
      }
    }

    const transaction = transactionsRepository.create({
      title,
      value,
      type,
      category: categoryObj,
    });

    await transactionsRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
