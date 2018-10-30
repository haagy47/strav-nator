'use strict';
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define('User', {
    stravaId: DataTypes.INTEGER,
    token: DataTypes.STRING,
    name: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
