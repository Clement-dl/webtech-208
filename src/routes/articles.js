const request = require("supertest")
const app = require("../app")
const { expect } = require("chai")

describe("GET /articles", () => {
  it("should return a list of articles", async () => {
    const res = await request(app).get("/articles")
    expect(res.status).to.equal(200)
    expect(res.body).to.be.an("array")
  })
})
