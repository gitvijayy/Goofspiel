
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('games', function (table){
      table.string('prizeString')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('games', function (table){
      table.dropColumn('prizeString');
    })
  ])
};
