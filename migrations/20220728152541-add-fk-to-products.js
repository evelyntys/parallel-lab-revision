'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db) {
  return db.addColumn('poster', 'media_property_id', {
    type: 'int',
    unsigned: true,
    notNull: true,
    foreignKey: {
      name: 'poster_media_property_fk',
      table: 'media_properties',
      rules: {
        onDelete: 'cascade',
        onUpdate: 'restrict'
      },
      mapping: 'id'
    }
  })
};

exports.down = function(db) {
  return db.dropColumn('poster', 'media_property_id')
};

exports._meta = {
  "version": 1
};
