import { RequestHandler } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { AppError } from "../../lib/AppError.js";
import Category from "../../models/Category.js";
import { validate } from "../validators/authValidator.js";
import { categorySchema } from "shared";

export const get: RequestHandler = asyncHandler(async (req, res) => {
  const userId = req.user!._id;
  const categories = await Category.find({ user: userId });
  res.status(200).json({ success: true, categories });
});

export const create: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(categorySchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const category = await Category.create({
    ...result.data,
    user: req.user!._id,
  });

  res.status(201).json({ success: true, data: category });
});

export const update: RequestHandler = asyncHandler(async (req, res) => {
  const result = validate(categorySchema, req.body);
  if (!result.success) throw new AppError(result.error, 400);

  const category = await Category.findOne({
    _id: req.params.id,
    user: req.user!._id,
  });
  if (!category) throw new AppError("Category not found", 404);

  Object.assign(category, result.data);
  await category.save();

  res.status(200).json({ success: true, data: category });
});

export const remove: RequestHandler = asyncHandler(async (req, res) => {
  const category = await Category.findOneAndDelete({
    _id: req.params.id,
    user: req.user!._id,
  });
  if (!category) throw new AppError("Category not found", 404);

  res.status(200).json({ success: true, message: "Category deleted" });
});
