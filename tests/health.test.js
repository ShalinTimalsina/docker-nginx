const request = require("supertest");
const app = require("../server");

describe("Health endpoint", () => {
  it("should return status OK", async () => {
    const res = await request(app).get("/health");

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: "OK",
      app: "Docker-Nginx-App",
    });
  });
});