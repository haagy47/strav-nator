const sequelize = require("../../src/db/models/index").sequelize;
const User = require("../config/db/models").User;

describe("User", () => {

  beforeEach((done) => {
    sequelize.sync({force: true})
    .then(() => {
      done();
    })
    .catch((err) => {
      console.log(err);
      done();
    });

  });

  describe("#create()", () => {

    it("should create a User object with a valid StravaId, token and name", (done) => {
      User.create({
        stravaId: 00001111,
        token: "4308504n0n8000000HelloStrava",
        name: "Jojo Fluffy-Muffin"
      })
      .then((user) => {
        expect(user.stravaId).toBe(00001111);
        expect(user.id).toBe(1);
        done();
      })
      .catch((err) => {
        console.log(err);
        done();
      });
    });

  });

});
