import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app";
import { UserModel, AccountModel } from "../../models/index";

vi.mock("../../config/email", () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

const validUser = {
  email: "test@example.com",
  name: "John Doe",
  password: "password123",
};

describe("Transaction endpoints", () => {
  let token: string;
  let categoryId: string;
  let accountId: string;

  beforeEach(async () => {
    await request(app).post("/api/auth/register").send(validUser);
    const user = await UserModel.findOne({ email: validUser.email });
    await request(app).get(
      `/api/auth/verify-email?token=${user?.verificationToken}`,
    );
    const loginRes = await request(app)
      .post("/api/auth/login")
      .send({ email: validUser.email, password: validUser.password });
    token = loginRes.body.data.token;

    const categoriesRes = await request(app)
      .get("/api/category/")
      .set("Authorization", `Bearer ${token}`);
    categoryId = categoriesRes.body.data[0]._id;

    const account = await AccountModel.create({
      user: user!._id,
      name: "Test Account",
    });
    accountId = account._id.toString();
  });

  describe("GET /api/transaction/", () => {
    it("fetches transactions without params", async () => {
      const res = await request(app)
        .get("/api/transaction/")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeInstanceOf(Array);
    });

    it("fetches transactions with date params", async () => {
      const res = await request(app)
        .get(`/api/transaction?from=2023-01-01&to=2023-01-31`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("returns 400 with invalid date params", async () => {
      const res = await request(app)
        .get("/api/transaction?from=notadate&to=alsonotadate")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("returns 401 without token", async () => {
      const res = await request(app).get("/api/transaction/");

      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/transaction/", () => {
    it("creates a transaction and returns 201", async () => {
      const res = await request(app)
        .post("/api/transaction/")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 100, type: "income", category: categoryId, account: accountId });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(100);
    });

    it("updates account balance on create", async () => {
      await request(app)
        .post("/api/transaction/")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 50, type: "income", category: categoryId, account: accountId });

      const account = await AccountModel.findById(accountId);
      expect(account?.balance).toBe(50);
    });

    it("returns 404 with non-existent category", async () => {
      const res = await request(app)
        .post("/api/transaction/")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 100, type: "income", category: "000000000000000000000000", account: accountId });

      expect(res.status).toBe(404);
    });

    it("returns 404 with non-existent account", async () => {
      const res = await request(app)
        .post("/api/transaction/")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 100, type: "income", category: categoryId, account: "000000000000000000000000" });

      expect(res.status).toBe(404);
    });

    it("returns 400 with invalid data", async () => {
      const res = await request(app)
        .post("/api/transaction/")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: -10, type: "invalid" });

      expect(res.status).toBe(400);
    });

    it("returns 401 without token", async () => {
      const res = await request(app)
        .post("/api/transaction/")
        .send({ amount: 100, type: "income", category: categoryId, account: accountId });

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/transaction/:id", () => {
    it("updates a transaction", async () => {
      const createRes = await request(app)
        .post("/api/transaction/")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 100, type: "income", category: categoryId, account: accountId });
      const transactionId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/transaction/${transactionId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 200, type: "income", category: categoryId, account: accountId });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.amount).toBe(200);
    });

    it("returns 404 with non-existent account", async () => {
      const res = await request(app)
        .put("/api/transaction/000000000000000000000000")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 100, type: "income", category: categoryId, account: "000000000000000000000000" });

      expect(res.status).toBe(404);
    });

    it("returns 404 with non-existent id", async () => {
      const res = await request(app)
        .put("/api/transaction/000000000000000000000000")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 100, type: "income", category: categoryId, account: accountId });

      expect(res.status).toBe(404);
    });

    it("returns 401 without token", async () => {
      const res = await request(app)
        .put("/api/transaction/000000000000000000000000")
        .send({ amount: 100, type: "income", category: categoryId, account: accountId });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/transaction/:id", () => {
    it("deletes a transaction", async () => {
      const createRes = await request(app)
        .post("/api/transaction/")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 100, type: "income", category: categoryId, account: accountId });
      const transactionId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/transaction/${transactionId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("reverses account balance on delete", async () => {
      const createRes = await request(app)
        .post("/api/transaction/")
        .set("Authorization", `Bearer ${token}`)
        .send({ amount: 100, type: "income", category: categoryId, account: accountId });
      const transactionId = createRes.body.data._id;

      await request(app)
        .delete(`/api/transaction/${transactionId}`)
        .set("Authorization", `Bearer ${token}`);

      const account = await AccountModel.findById(accountId);
      expect(account?.balance).toBe(0);
    });

    it("returns 404 with non-existent id", async () => {
      const res = await request(app)
        .delete("/api/transaction/000000000000000000000000")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("returns 401 without token", async () => {
      const res = await request(app).delete(
        "/api/transaction/000000000000000000000000",
      );

      expect(res.status).toBe(401);
    });
  });
});
