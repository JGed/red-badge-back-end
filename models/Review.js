const { DataTypes } = require("sequelize");
const db = require("../db");

const Review = db.define('review', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    rating: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    text: {
        type: DataTypes.STRING(10000),
        allowNull: false
    },
})

module.exports = Review;