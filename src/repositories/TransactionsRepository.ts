import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    const transactions = await super.find();

    const incomes = transactions.filter(transaction => {
      return transaction.type === 'income';
    });

    const outcomes = transactions.filter(transaction => {
      return transaction.type === 'outcome';
    });

    const income = incomes.reduce((sum, transaction) => {
      return Number(sum) + Number(transaction.value);
    }, 0);

    const outcome = outcomes.reduce((sum, transaction) => {
      return Number(sum) + Number(transaction.value);
    }, 0);

    const total = income - outcome;
    const balance = { income, outcome, total };
    return balance;
  }
}

export default TransactionsRepository;
