const { DataTypes } = require("sequelize");
const db = require("../db");

const Report = db.define('report', {
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

module.exports = Report;