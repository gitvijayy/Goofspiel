"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // insert username to database when put request to /users/
  router.post("/", (req, res) => {
    knex('users')
      .insert({username: req.body.username, games_played:0, games_won:0})
      .then(res.status(200).send())
      .catch(
        function(error) {
          console.error(error);
        }
      );
  });

  // on get requests to /users/:username  -> return all data in games table where player1 or player2 = username

  router.get("/:username", (req, res) => {
    knex('games')
      .select('*')
      .where('player1', req.params.username)
      .orWhere('player2', req.params.username)
      .then((results) => {
        res.json(results);
      });
    });
  return router;
}
