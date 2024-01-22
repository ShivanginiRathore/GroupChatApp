const Sequelize = require('sequelize');

const sequelize = require('../util/database') ;

const Grant = sequelize.define ('grant', {
    id: {
        type: Sequelize.INTEGER, 
        primaryKey: true, 
        autoIncrement: true, 
        allowNull: false
    },
    selfGranted: Sequelize.BOOLEAN 
});

module.exports = Grant;