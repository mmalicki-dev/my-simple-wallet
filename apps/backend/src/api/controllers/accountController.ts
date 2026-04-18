import { RequestHandler } from "express";
import { asyncHandler, AppError, ok, created, deleted } from "../../lib/index.js";
import { AccountModel, TransactionModel, UserModel } from "../../models/index.js";
import { validate } from "../validators/authValidator.js";
import { createAccountSchema, updateAccountSchema } from "shared";

export const get: RequestHandler = asyncHandler(async (req, res) => {
  const accounts = await AccountModel.find({ user: req.user!._id });
  ok(res, accounts);
});

export const create: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(createAccountSchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const existingCount = await AccountModel.countDocuments({ user: req.user!._id });
  const isDefault = existingCount === 0;

  const account = await AccountModel.create({
    ...result.data,
    user: req.user!._id,
    isDefault,
  });

  await UserModel.findByIdAndUpdate(req.user!._id, {
    $push: { accounts: account._id },
  });

  created(res, account);
});

export const update: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(updateAccountSchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const account = await AccountModel.findOne({
    _id: req.params.id,
    user: req.user!._id,
  });
  if (!account) throw new AppError("Account not found", 404);

  if (result.data.isDefault && !account.isDefault) {
    await AccountModel.findOneAndUpdate(
      { user: req.user!._id, isDefault: true },
      { isDefault: false },
    );
  }

  Object.assign(account, result.data);
  await account.save();

  ok(res, account);
});

export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const account = await AccountModel.findOne({
    _id: req.params.id,
    user: req.user!._id,
  });
  if (!account) throw new AppError("Account not found", 404);
  if (account.isDefault) throw new AppError("Cannot delete the default account. Set another account as default first.", 400);

  await TransactionModel.deleteMany({ account: account._id });
  await UserModel.findByIdAndUpdate(req.user!._id, {
    $pull: { accounts: account._id },
  });
  await account.deleteOne();

  deleted(res, "Account deleted");
});
