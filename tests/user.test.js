const request = require("supertest");
const bcrypt = require("bcrypt");

const { User } = require("../models/User");
let { server, client } = require("../index");

const users = [
  {
    email: "user1@admin.com",
    firstName: "nine",
    lastName: "sense",
    phoneNumber: "090000",
    password: "password",
    confirm_password: "password",
    isAdmin: true
  },
  {
    email: "user2@user.com",
    firstName: "user2",
    lastName: "user2",
    phoneNumber: "9999999",
    password: "password",
    confirm_password: "password",
    isAdmin: false
  }
];

describe(" /POST Register Users", () => {
  beforeEach(() => {
    // open the server on a separate test port
    // server.listen(8888);
  });
  afterEach(async () => {
    // server.close();
    await User.deleteMany();
  });

  it("should register the user", done => {
    request(server)
      .post("/api/register")
      .set("Accept", "application/json")
      .send(users[1])
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
          expect(foundUser.email).toBe(users[1].email);
          expect(
            bcrypt.compare(users[1].password, foundUser.password)
          ).toBeTruthy();
          done();
        } catch (error) {
          done(error);
        }
      });
  });

  it("should not register user if email is taken", async done => {
    // We add the user before making the request

    const newUser = new User(users[1]);
    await newUser.save();

    // make the request
    request(server)
      .post("/api/register")
      .send(users[1])
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
});

describe("/POST Login Users", () => {
  it("should login the user", async done => {
    //add the user before making the request
    const user = new User(users[1]);
    await user.save();

    //  get user auth
    const { email, password } = users[1];
    // make the request
    request(server)
      .post("/api/login")
      .send({
        email,
        password
      })
      .expect(200)
      .expect(response => {
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("isAdmin");
        expect(client.KEYS("xAuthToken")).toBeTruthy();
      })
      .end(done);
  });

  it("should not login the user, no login credential", async done => {
    request(server)
      .post("/api/login")
      .send({})
      .expect(400)
      .end(done);
  });

  // it("should get the current user", done => {
  //   request(server)
  //     .get("/api/users/me")
  //     .done();
  // });
});
