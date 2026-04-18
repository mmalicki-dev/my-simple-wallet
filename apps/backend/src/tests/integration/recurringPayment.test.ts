import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app";
import { UserModel } from "../../models/index";

vi.mock("../../config/email", () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

const validUser = {
  email: "test@example.com",
  name: "John Doe",
  password: "password123",
};

const validPayment = {
  name: "Netflix",
  type: "subscription",
  amount: 99,
  billingCycle: "monthly",
  nextDueDate: new Date("2026-05-01"),
};

describe("RecurringPayment endpoints", () => {
  let token: string;
  let accountId: string;
  let categoryId: string;

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

    const accountRes = await request(app)
      .post("/api/account/")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "Main Account" });
    accountId = accountRes.body.data._id;

    const categoryRes = await request(app)
      .get("/api/category/")
      .set("Authorization", `Bearer ${token}`);
    categoryId = categoryRes.body.data[0]._id;
  });

  describe("GET /api/recurringPayment/", () => {
    it("returns empty list when no recurring payments", async () => {
      const res = await request(app)
        .get("/api/recurringPayment/")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it("returns 401 without token", async () => {
      const res = await request(app).get("/api/recurringPayment/");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/recurringPayment/", () => {
    it("creates a recurring payment and returns 201", async () => {
      const res = await request(app)
        .post("/api/recurringPayment/")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...validPayment, account: accountId, category: categoryId });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Netflix");
      expect(res.body.data.amount).toBe(99);
    });

    it("isActive defaults to true", async () => {
      const res = await request(app)
        .post("/api/recurringPayment/")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...validPayment, account: accountId, category: categoryId });

      expect(res.body.data.isActive).toBe(true);
    });

    it("returns 404 with non-existent account", async () => {
      const res = await request(app)
        .post("/api/recurringPayment/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...validPayment,
          account: "000000000000000000000000",
          category: categoryId,
        });

      expect(res.status).toBe(404);
    });

    it("returns 404 with non-existent category", async () => {
      const res = await request(app)
        .post("/api/recurringPayment/")
        .set("Authorization", `Bearer ${token}`)
        .send({
          ...validPayment,
          account: accountId,
          category: "000000000000000000000000",
        });

      expect(res.status).toBe(404);
    });

    it("returns 400 with invalid data", async () => {
      const res = await request(app)
        .post("/api/recurringPayment/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Netflix", type: "invalid" });

      expect(res.status).toBe(400);
    });

    it("returns 401 without token", async () => {
      const res = await request(app)
        .post("/api/recurringPayment/")
        .send({ ...validPayment, account: accountId, category: categoryId });

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/recurringPayment/:id", () => {
    it("updates a recurring payment", async () => {
      const createRes = await request(app)
        .post("/api/recurringPayment/")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...validPayment, account: accountId, category: categoryId });
      const paymentId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/recurringPayment/${paymentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Disney+", amount: 59 });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("Disney+");
      expect(res.body.data.amount).toBe(59);
    });

    it("can deactivate a recurring payment", async () => {
      const createRes = await request(app)
        .post("/api/recurringPayment/")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...validPayment, account: accountId, category: categoryId });
      const paymentId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/recurringPayment/${paymentId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ isActive: false });

      expect(res.status).toBe(200);
      expect(res.body.data.isActive).toBe(false);
    });

    it("returns 404 with non-existent id", async () => {
      const res = await request(app)
        .put("/api/recurringPayment/000000000000000000000000")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Disney+" });

      expect(res.status).toBe(404);
    });

    it("returns 401 without token", async () => {
      const res = await request(app)
        .put("/api/recurringPayment/000000000000000000000000")
        .send({ name: "Disney+" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/recurringPayment/:id", () => {
    it("deletes a recurring payment", async () => {
      const createRes = await request(app)
        .post("/api/recurringPayment/")
        .set("Authorization", `Bearer ${token}`)
        .send({ ...validPayment, account: accountId, category: categoryId });
      const paymentId = createRes.body.data._id;

      const res = await request(app)
        .delete(`/api/recurringPayment/${paymentId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it("returns 404 with non-existent id", async () => {
      const res = await request(app)
        .delete("/api/recurringPayment/000000000000000000000000")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("returns 401 without token", async () => {
      const res = await request(app).delete(
        "/api/recurringPayment/000000000000000000000000",
      );
      expect(res.status).toBe(401);
    });
  });
});
