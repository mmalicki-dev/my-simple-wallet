import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app";
import UserModel from "../../models/User";
import { DEFAULT_CATEGORIES } from "../../config/defaultCategories";

vi.mock("../../config/email", () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

const validCategory = {
  name: "Car Loan",
  type: "expense",
};
const validUser = {
  email: "test@example.com",
  name: "John Doe",
  password: "password123",
};

describe("Category endpoints", () => {
  let token: string;
  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const user = await UserModel.findOne({ email: validUser.email });
    await request(app).get(
      `/api/auth/verify-email?token=${user?.verificationToken}`,
    );
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: validUser.password });
    token = res.body.data.token;
  });

  describe("GET /api/category/", () => {
    it("fetches all users categories", async () => {
      const res = await request(app)
        .get("/api/category/")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      expect(res.body.categories).toHaveLength(DEFAULT_CATEGORIES.length);
    });
    it("return 401 without token", async () => {
      const res = await request(app).get("/api/category/");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/category/", () => {
    it("creates a new category", async () => {
      const res = await request(app)
        .post("/api/category/")
        .set("Authorization", `Bearer ${token}`)
        .send(validCategory);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(validCategory.name);
    });
    it("returns 400 with invalid data", async () => {
      const res = await request(app)
        .post("/api/category/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "x", type: "invalid" });

      expect(res.status).toBe(400);
    });
  });
  describe("PUT /api/category/", () => {
    it("updates a category", async () => {
      const getRes = await request(app)
        .get("/api/category/")
        .set("Authorization", `Bearer ${token}`);
      const categoryId = getRes.body.categories[0]._id;

      const res = await request(app)
        .put(`/api/category/${categoryId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(validCategory);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(validCategory.name);
    });
    it("return 401 without token", async () => {
      const getRes = await request(app)
        .get("/api/category/")
        .set("Authorization", `Bearer ${token}`);
      const categoryId = getRes.body.categories[0]._id;

      const res = await request(app)
        .put(`/api/category/${categoryId}`)
        .send(validCategory);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
    it("returns 404 with a non-existent id", async () => {
      const res = await request(app)
        .put("/api/category/000000000000000000000000")

        .set("Authorization", `Bearer ${token}`)
        .send(validCategory);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Category not found");
    });
  });
  describe("DELETE /api/category/", () => {
    it("deletes a category", async () => {
      const getRes = await request(app)
        .get("/api/category/")
        .set("Authorization", `Bearer ${token}`);
      const categoryId = getRes.body.categories[0]._id;

      const res = await request(app)
        .delete(`/api/category/${categoryId}`)
        .set("Authorization", `Bearer ${token}`)
        .send(validCategory);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe("Category deleted");
    });
    it("return 401 without token", async () => {
      const getRes = await request(app)
        .get("/api/category/")
        .set("Authorization", `Bearer ${token}`);
      const categoryId = getRes.body.categories[0]._id;

      const res = await request(app)
        .delete(`/api/category/${categoryId}`)
        .send(validCategory);

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });
    it("returns 404 with a non-existent id", async () => {
      const res = await request(app)
        .delete("/api/category/000000000000000000000000")

        .set("Authorization", `Bearer ${token}`)
        .send(validCategory);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe("Category not found");
    });
  });
});
