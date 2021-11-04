const User = require('./User');
const Game = require('./Game');
const Review = require('./Review');
const Report = require('./Report');

User.hasMany(Review);
Review.belongsTo(User);

Game.hasMany(Review);
Review.belongsTo(Game);

User.hasMany(Report);
Report.belongsTo(User);

Review.hasMany(Report);
Report.belongsTo(Review);

module.exports = {
    User,
    Game,
    Review,
    Report
}