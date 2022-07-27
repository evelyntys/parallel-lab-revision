// one model class represents one table
const bookshelf = require('../bookshelf');

//convention:
//* name of the model must be first alphabet upper case and singular
// * first argument to bookshelf.Model is the NAME of the model
const Poster = bookshelf.model('Poster', {
    tableName: 'poster'
})

module.exports = {
    Poster
}

// module.exports = {
//     Poster: Poster
// };
// no need braces if only exporting out one thing