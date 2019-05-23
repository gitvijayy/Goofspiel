
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('turns', function(table){
      table.increments('id');
      table.integer('games_id');
      table.integer('prize');
      table.integer('bet1');
      table.integer('bet2');
      table.string('winner');
      table.integer('points');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('turns')
  ])
};
