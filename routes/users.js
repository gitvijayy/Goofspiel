"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  //testing if data being retrieved -- to be removed before project submission
  // router.get("/", (req, res) => {
  //   knex('users')
  //     .select('*')
  //     .then((results) => {
  //       res.json(results);
  //     });
  // });

  // insert username to database when put request to /users/
  router.put("/", (req, res) => {
    knex('users')
      .insert({username: req.body.username})
      .then(res.status(200).send())
      .catch(
        function(error) {
          res.status(500).json({error});
        }
      );
  });

  // on get requests to /users/:username  -> return all data in games table where player1 or player2 = username
  // missing: information for leaderboard
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
