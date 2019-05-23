"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  // insert username to database when put request to /users/
  router.put("/", (req, res) => {
    knex('users')
      .insert({username: req.body});
  });

  // on get requests to /users/:username  -> return all data in games table where player1 or player2 = username
  // missing: information for leaderboard
  router.get("/:username", (req, res) => {
    knex('games')
      .select('*')
      .where('player1', '=', req.params.username)
      .orWhere('player2', '=', req.params.username)
      .then((results) => {
        res.json(results);
    });

  });



  

  return router;
}
