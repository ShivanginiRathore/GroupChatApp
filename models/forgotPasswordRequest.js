const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const ForgotPasswordRequest = sequelize.define('forgotpasswordrequest',{
  id: {
    type: Sequelize.UUID,
    allowNull: false,
    primaryKey: true
  },
  isActive: Sequelize.BOOLEAN
  
});

module.exports = ForgotPasswordRequest;