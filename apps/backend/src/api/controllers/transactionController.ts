import { RequestHandler } from "express";
import {
  asyncHandler,
  AppError,
  ok,
  created,
  deleted,
} from "../../lib/index.js";
import {
  TransactionModel,
  CategoryModel,
  AccountModel,
} from "../../models/index.js";
import { validate } from "../validators/authValidator.js";
import { transactionSchema } from "../../../../../packages/shared/dist/index.js";

export const get: RequestHandler = asyncHandler(async (req, res) => {
  let from: Date;
  let to: Date;
  const userId = req.user!._id;
  const query = req.query;
  if (!query.from || !query.to) {
    const now = new Date();
    from = new Date(now.getFullYear(), now.getMonth(), 1);
    to = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  } else {
    from = new Date(query.from as string);
    to = new Date(query.to as string);
  }

  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()))
    throw new AppError("Invalid date format", 400);

  const filter: Record<string, unknown> = {
    user: userId,
    date: { $gte: from, $lte: to },
  };
  if (query.accountId) filter.account = query.accountId;

  const transactions = await TransactionModel.find(filter);
  ok(res, transactions);
});

export const create: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(transactionSchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const [category, account] = await Promise.all([
    CategoryModel.findOne({ _id: result.data.category, user: req.user!._id }),
    AccountModel.findOne({ _id: result.data.account, user: req.user!._id }),
  ]);
  if (!category) throw new AppError("Category not found", 404);
  if (!account) throw new AppError("Account not found", 404);

  const transaction = await TransactionModel.create({
    ...result.data,
    user: req.user!._id,
  });
  created(res, transaction);
});

export const update: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(transactionSchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const [category, account] = await Promise.all([
    CategoryModel.findOne({ _id: result.data.category, user: req.user!._id }),
    AccountModel.findOne({ _id: result.data.account, user: req.user!._id }),
  ]);
  if (!category) throw new AppError("Category not found", 404);
  if (!account) throw new AppError("Account not found", 404);

  const transaction = await TransactionModel.findOne({
    _id: req.params.id,
    user: req.user!._id,
  });
  if (!transaction) throw new AppError("Transaction not found", 404);

  Object.assign(transaction, result.data);
  await transaction.save();

  ok(res, transaction);
});

export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const transaction = await TransactionModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user!._id,
  });
  if (!transaction) throw new AppError("Transaction not found", 404);

  const delta =
    transaction.type === "income" ? -transaction.amount : transaction.amount;
  await AccountModel.findByIdAndUpdate(transaction.account, {
    $inc: { balance: delta },
  });

  deleted(res, "Transaction deleted");
});
