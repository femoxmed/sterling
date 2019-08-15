const request = require("supertest");

const { Team } = require("../models/Team");
const { Fixtures } = require("../models/Fixtures");

const { server } = require("../index");

afterEach(async () => {
  await Team.deleteMany();
  await Fixtures.deleteMany();
});

describe("/GET Search", () => {
  it("should search for teams", async done => {
    await Team.collection.insertMany([
      { name: "Chelsea" },
      { name: "Manchester United" },
      { name: "Enyimba" },
      { name: "Kano Pillars" }
    ]);
    const query = "Chelsea";

    request(server)
      .get("api/search/teams")
      .query({ name: query })
      .expect(200)
      .end(async (err, response) => {
        if (err) {
          return done(err);
        }

        try {
          const teams = await Team.find({ name: query });
          //   expect(response.body.length).toBe(teams.length);
          expect(teams.length).toEqual(1);
          done();
        } catch (error) {
          done(error);
        }
      });
  });
});
