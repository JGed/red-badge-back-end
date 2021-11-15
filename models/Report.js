const { DataTypes } = require("sequelize");
const db = require("../db");

// report status types:
/*
    unhandled - the report has not yet been evaluated by a mod or admin
    removal - the report has been evaluated and the review was removed
    handled - the report was evaluated and the review was not removed
*/
const Report = db.define('report', {
    reason: {
        type: DataTypes.STRING,
        allowNull: false
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'unhandled'
    },
    handledBy: {
        type: DataTypes.INTEGER,
        allowNull: true
    }
})

module.exports = Report;