
exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table){
      table.renameColumn('name','username');
      table.dropColumn('id')
      table.unique('username');
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users', function (table){
      table.dropUnique('username');
      table.renameColumn('username', 'name');
      table.increments('id');
    })
  ])
};
