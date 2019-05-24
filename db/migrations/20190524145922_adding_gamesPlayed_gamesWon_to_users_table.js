
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table){
      table.integer('games_played')
      table.integer('games_won')
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table){
      table.dropColumn('games_played');
      table.dropColumn('games_won');
    })
  ])
};