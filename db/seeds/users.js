exports.seed = function(knex, Promise) {
  return knex('users').del()
    .then(function () {
      return Promise.all([
        knex('users').insert({username: 'Alice'}),
        knex('users').insert({username: 'Bob'}),
        knex('users').insert({username: 'Charlie'})
      ]);
    });
};
