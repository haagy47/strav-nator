'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    stravaId: DataTypes.STRING,
    token: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
