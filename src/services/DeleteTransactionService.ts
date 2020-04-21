import {
  getRepository,
  Transaction,
  getConnectionOptions,
  getCustomRepository,
} from 'typeorm';
import AppError from '../errors/AppError';

import TransactionsRepository from '../repositories/TransactionsRepository';
import Category from '../models/Category';

interface Request {
  id: string;
}

class DeleteTransactionService {
  public async execute({ id }: Request): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionsRepository);
    const transaction = await transactionsRepository.findOne({
      where: { id },
    });

    if (!transaction) {
      throw new AppError('Transaction with suplied id not found!', 404);
    }

    await transactionsRepository.remove(transaction);
  }
}

export default DeleteTransactionService;
