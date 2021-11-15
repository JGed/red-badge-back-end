const { DataTypes } = require("sequelize");
const db = require("../db");
const Game = db.define('game', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    releaseDate: {
        type: DataTypes.DATE,
    },
    platform: {
        type: DataTypes.STRING,
    },
    genre: {
        type: DataTypes.STRING,
    },
    rating: {
        type: DataTypes.DECIMAL
    },
    photoURL {
        type: DataTypes.STRING
    }

})

module.exports = Game;