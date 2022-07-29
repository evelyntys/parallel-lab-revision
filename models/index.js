// one model class represents one table
const bookshelf = require('../bookshelf');

//convention:
//* name of the model must be first alphabet upper case and singular
// * first argument to bookshelf.Model is the NAME of the model
const Poster = bookshelf.model('Poster', {
    tableName: 'poster',
    media_property(){
        return this.belongsTo('MediaProperty')
    },
    tags(){
        return this.belongsToMany('Tag')
    }
})

const MediaProperty = bookshelf.model('MediaProperty', {
    tableName: 'media_properties',
    posters(){
        return this.hasMany('Poster');
    }
})

const Tag = bookshelf.model('Tag', {
    tableName: 'tags',
    posters(){
        return this.belongsToMany('Poster')
    }
})

const User = bookshelf.model('User', {
    tableName: 'users'
})

module.exports = {
    Poster, MediaProperty, Tag, User
}

// module.exports = {
//     Poster: Poster
// };
// no need braces if only exporting out one thing