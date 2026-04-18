import { RequestHandler } from "express";
import {
  asyncHandler,
  AppError,
  ok,
  created,
  deleted,
} from "../../lib/index.js";
import { RecurringPaymentModel } from "../../models/index.js";
import { validate } from "../validators/authValidator.js";
import {
  createRecurringPaymentSchema,
  updateRecurringPaymentSchema,
} from "shared";

export const get: RequestHandler = asyncHandler(async (req, res) => {
  const recurringPayments = await RecurringPaymentModel.find({
    user: req.user!._id,
  });
  ok(res, recurringPayments);
});

export const create: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(createRecurringPaymentSchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const recurringPayment = await RecurringPaymentModel.create({
    ...result.data,
    user: req.user!._id,
    account: req.body.account,
  });

  created(res, recurringPayment);
});

export const update: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(updateRecurringPaymentSchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const recurringPayment = await RecurringPaymentModel.findOne({
    _id: req.params.id,
    user: req.user!._id,
    account: req.query.account,
  });
  if (!recurringPayment) throw new AppError("Recurring Payment not found", 404);

  Object.assign(recurringPayment, result.data);
  await recurringPayment.save();

  ok(res, recurringPayment);
});

export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const recurringPayment = await RecurringPaymentModel.findOne({
    _id: req.params.id,
    user: req.user!._id,
    account: req.query.account,
  });
  if (!recurringPayment) throw new AppError("Recurring Payment not found", 404);

  await recurringPayment.deleteOne();

  deleted(res, "Recurring Payment deleted");
});
