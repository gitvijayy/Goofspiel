
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('games', function(table){
      table.increments('id');
      table.string('player1');
      table.string('player2');
      table.string('status');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('games')
  ])
  
};
