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

const updateGameRating = async (review, options) => {
    try {
        const game = await review.getGame();
        const {count, rows} = await Review.findAndCountAll({
            where: {
                gameId: game.id
            }
        })
        game.rating = rows.reduce((acc, cur) => {
            return acc + cur.rating
        }, 0) / count;
        await game.save();
    }
    catch(error) {
    }
}
Review.afterCreate('updateRating', updateGameRating);
Review.afterUpdate('updateRating', updateGameRating);

Report.afterUpdate('updateReport', async (report, options) => {
   if(report.status === 'removal') {
       try {
        const review = await report.getReview();
        const user = await review.getUser();
        await user.increment('offences');
        await review.destroy();
       }
       catch(e) {

       }
   } 
})
module.exports = {
    User,
    Game,
    Review,
    Report
}