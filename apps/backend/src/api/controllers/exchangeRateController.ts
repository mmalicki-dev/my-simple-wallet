import { RequestHandler } from "express";
import { asyncHandler } from "../../lib/asyncHandler.js";
import { ok } from "../../lib/response.js";
import { AppError } from "../../lib/index.js";
import { CURRENCIES } from "shared/dist/index.js";

const FRANKFURTER_URL = "https://api.frankfurter.app";

export const getExchangeRates: RequestHandler = asyncHandler(
  async (req, res) => {
    const { from } = req.params;

    if (!CURRENCIES.includes(from as never)) {
      throw new AppError(`Unsupported currency: ${from}`, 400);
    }

    const response = await fetch(`${FRANKFURTER_URL}/latest?from=${from}`);

    if (!response.ok) {
      throw new AppError("Failed to fetch exchange rates", 502);
    }

    const data = await response.json();
    ok(res, data);
  },
);
