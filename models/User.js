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
    offences: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    },
    passwordHash: {
        type: DataTypes.STRING,
        allowNull: false
    },
})

module.exports = User;