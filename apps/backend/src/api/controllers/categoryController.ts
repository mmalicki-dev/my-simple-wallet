import { RequestHandler } from "express";
import { asyncHandler, AppError, ok, created, deleted } from "../../lib/index.js";
import { CategoryModel } from "../../models/index.js";
import { validate } from "../validators/authValidator.js";
import { categorySchema } from "shared";

export const get: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user!._id;
  const categories = await CategoryModel.find({ user: userId });
  ok(res, categories);
});

export const create: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(categorySchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const category = await CategoryModel.create({
    ...result.data,
    user: req.user!._id,
  });

  created(res, category);
});

export const update: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(categorySchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const category = await CategoryModel.findOne({
    _id: req.params.id,
    user: req.user!._id,
  });
  if (!category) throw new AppError("Category not found", 404);

  Object.assign(category, result.data);
  await category.save();

  ok(res, category);
});

export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const category = await CategoryModel.findOneAndDelete({
    _id: req.params.id,
    user: req.user!._id,
  });
  if (!category) throw new AppError("Category not found", 404);

  deleted(res, "Category deleted");
});
