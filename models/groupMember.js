const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const GroupMember = sequelize.define('groupMember', {
    id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,

    },
    groupName: {
      type: Sequelize.STRING,
      allowNull: false,

    }
});

module.exports = GroupMember;