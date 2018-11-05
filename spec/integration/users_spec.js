const request = require("request");
const server = require("../../server");
const base = "http://localhost:3000/users";
const User = require("../config/db/models").User;
const sequelize = require("../config/db/models/index").sequelize;

describe("routes : users", () => {

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

  describe("GET /profile", () => {

    beforeEach((done) => {
      User.create({
           stravaId: 00001111,
           token: "4308504n0n8000000HelloStrava",
           name: "Jojo Fluffy-Muffin"
         })
         .then((res) => {
           this.user = res;
         }
    });

    it("should render a view with user profile", (done) => {
      request.get(`${base}profile`, (err, res, body) => {
        User.findOne({where: {stravaId: 00001111}})
          .then((user) => {
            expect(user).not.toBeNull();
            expect(user.token).toBe("4308504n0n8000000HelloStrava");
            expect(user.name).toBe("Jojo Fluffy-Muffin");
            done();
          })
          .catch((err) => {
            console.log(err);
            done();
          });
        });
    });

  });

});
