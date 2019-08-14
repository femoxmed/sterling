const request = require("supertest");
const bcrypt = require("bcrypt");

const { User } = require("../models/User");

let server;

describe("USERS", () => {
  const user = {
    email: "user1@admin.com",
    firstName: "nine",
    lastName: "sense",
    phoneNumber: "090000",
    password: "password",
    confirm_password: "password"
  };

  beforeEach(() => (server = require("../index")));
  afterEach(async () => {
    server.close();
    await User.deleteMany();
  });

  it("should register the user", done => {
    request(server)
      .post("/api/register")
      .set("Accept", "application/json")
      .send(user)
      .expect(200)
      .expect(response => {
        expect(response.body).toBeDefined();
        expect(response.body).toHaveProperty("success");
      })
      .end(async (err, response) => {
        if (err) {
          return done(err);
        }

        try {
          //   Query the database for the Added data
          const foundUser = await User.findOne({ email: user.email });
          expect(foundUser.email).toBe(user.email);
          expect(
            bcrypt.compare(user.password, foundUser.password)
          ).toBeTruthy();
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it("should not register user if email is taken", async done => {
    // We add the user before making the request
    const newUser = new User(user);
    await newUser.save();

    // make the request
    request(server)
      .post("/api/register")
      .send(user)
      .expect(400)
      .end(done);
  });

  it("should not register user, if no request body", done => {
    request(server)
      .post("/api/register")
      .send({})
      .expect(400)
      .end(done);
  });

  it("should login the user", done => {
    //  get user auth
    const { email, password } = user;
    // make the request
    request(server)
      .post("/api/login")
      .send({
        email,
        password
      })
      .expect(200)
      .expect(response => {
        expect(email).toBe(response.body.email);
        expect(response.header)
          .toHaveProperty("x-auth-token")
          .end(done);
      });
    // make ur assertions
  });
});
