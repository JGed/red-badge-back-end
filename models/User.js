const { DataTypes } = require("sequelize");
const db = require("../db");

const User = db.define('user', {
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'user'
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

module.exports = User;