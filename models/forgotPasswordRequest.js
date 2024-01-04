const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const forgotPasswordRequest = sequelize.define('forgotPasswordRequest',{
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  isActive: Sequelize.BOOLEAN,
  
});

module.exports = forgotPasswordRequest;
