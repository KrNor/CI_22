const request = require("supertest");
const app = require("./app");

const Person = require("./models/person");
jest.mock("./models/person");

describe("testing /api/persons", () => {
  beforeEach(() => {
    Person.find.mockResolvedValue([
      {
        name: "Arto Hellas",
        number: "040-123456",
        id: "1",
      },
      {
        name: "Ada Lovelace",
        number: "39-44-5323523",
        id: "2",
      },
    ]);
  });
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

    // console.log(res.body);
    await res.body.forEach((person) => {
      expect(person).toHaveProperty("id");
      expect(person).toHaveProperty("name");
      expect(person).toHaveProperty("number");
    });
  });
});
