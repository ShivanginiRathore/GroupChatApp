const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const User = sequelize.define('user', {
  email: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true

  },  
  // id:{
  //       type: Sequelize.INTEGER,
  //       autoIncrement: true,
  //       allowNull: false
  //   },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    
    password : {
      type: Sequelize.STRING,
      allowNull: false
    },
    phoneNumber: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    }
});

module.exports = User;