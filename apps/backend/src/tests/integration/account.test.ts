import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import app from "../../app.js";
import { UserModel, AccountModel } from "../../models/index.js";

vi.mock("../../config/email", () => ({
  sendVerificationEmail: vi.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail: vi.fn().mockResolvedValue(undefined),
}));

const validUser = {
  email: "test@example.com",
  name: "John Doe",
  password: "password123",
};

describe("Account endpoints", () => {
  let token: string;

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
  });

  describe("GET /api/account/", () => {
    it("returns empty list when no accounts", async () => {
      const res = await request(app)
        .get("/api/account/")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it("returns 401 without token", async () => {
      const res = await request(app).get("/api/account/");
      expect(res.status).toBe(401);
    });
  });

  describe("POST /api/account/", () => {
    it("creates an account and returns 201", async () => {
      const res = await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Main Account" });

      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe("Main Account");
      expect(res.body.data.currency).toBe("NOK");
    });

    it("first account is automatically set as default", async () => {
      const res = await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "First Account" });

      expect(res.body.data.isDefault).toBe(true);
    });

    it("second account is not default", async () => {
      await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "First Account" });

      const res = await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Second Account" });

      expect(res.body.data.isDefault).toBe(false);
    });

    it("adds account to user.accounts", async () => {
      const res = await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Main Account" });

      const user = await UserModel.findOne({ email: validUser.email });
      expect(user?.accounts.map(String)).toContain(res.body.data._id);
    });

    it("returns 400 with invalid data", async () => {
      const res = await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({});

      expect(res.status).toBe(400);
    });

    it("returns 401 without token", async () => {
      const res = await request(app)
        .post("/api/account/")
        .send({ name: "Main Account" });

      expect(res.status).toBe(401);
    });
  });

  describe("PUT /api/account/:id", () => {
    it("updates account name", async () => {
      const createRes = await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Old Name" });
      const accountId = createRes.body.data._id;

      const res = await request(app)
        .put(`/api/account/${accountId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "New Name" });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe("New Name");
    });

    it("setting isDefault unsets previous default", async () => {
      await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "First Account" });

      const secondRes = await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Second Account" });
      const secondId = secondRes.body.data._id;

      await request(app)
        .put(`/api/account/${secondId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ isDefault: true });

      const accounts = await AccountModel.find({
        user: secondRes.body.data.user,
      });
      const defaults = accounts.filter((a) => a.isDefault);
      expect(defaults).toHaveLength(1);
      expect(defaults[0]._id.toString()).toBe(secondId);
    });

    it("returns 404 with non-existent id", async () => {
      const res = await request(app)
        .put("/api/account/000000000000000000000000")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "New Name" });

      expect(res.status).toBe(404);
    });

    it("returns 401 without token", async () => {
      const res = await request(app)
        .put("/api/account/000000000000000000000000")
        .send({ name: "New Name" });

      expect(res.status).toBe(401);
    });
  });

  describe("DELETE /api/account/:id", () => {
    it("deletes a non-default account", async () => {
      await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Default Account" });

      const secondRes = await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Second Account" });
      const secondId = secondRes.body.data._id;

      const res = await request(app)
        .delete(`/api/account/${secondId}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
    });

    it("removes account from user.accounts on delete", async () => {
      await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Default Account" });

      const secondRes = await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Second Account" });
      const secondId = secondRes.body.data._id;

      await request(app)
        .delete(`/api/account/${secondId}`)
        .set("Authorization", `Bearer ${token}`);

      const user = await UserModel.findOne({ email: validUser.email });
      expect(user?.accounts.map(String)).not.toContain(secondId);
    });

    it("returns 400 when deleting the default account", async () => {
      const defaultRes = await request(app)
        .post("/api/account/")
        .set("Authorization", `Bearer ${token}`)
        .send({ name: "Default Account" });

      const res = await request(app)
        .delete(`/api/account/${defaultRes.body.data._id}`)
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(400);
    });

    it("returns 404 with non-existent id", async () => {
      const res = await request(app)
        .delete("/api/account/000000000000000000000000")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(404);
    });

    it("returns 401 without token", async () => {
      const res = await request(app).delete(
        "/api/account/000000000000000000000000",
      );
      expect(res.status).toBe(401);
    });
  });
});
