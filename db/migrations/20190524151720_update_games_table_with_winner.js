
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('games', function (table){
      table.string('winner')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table){
      table.dropColumn('winner');
    })
  ])
};