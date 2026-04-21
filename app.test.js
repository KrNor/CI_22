const request = require("supertest");
const app = require("./app");

describe("testing /api/persons", () => {
  it("returns status code 200", async () => {
    const res = await request(app).get("/api/persons");

    expect(res.statusCode).toBe(200);
  });

  it("returns a non-empty list", async () => {
    const res = await request(app).get("/api/persons");

    // console.log(res.body.length);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("returns valid persons list/array", async () => {
    const res = await request(app).get("/api/persons");

    await res.body.forEach((person) => {
      expect(person).toHaveProperty("id");
      expect(person).toHaveProperty("name");
      expect(person).toHaveProperty("number");
    });
  });
});
