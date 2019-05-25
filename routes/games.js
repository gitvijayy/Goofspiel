'use strict';

const express = require('express');
const router = express.Router();

module.exports = (knex) => {
  //on put request to /games check if any games missing player2, and if user already in a game waiting for player2
  //if game found waiting for player2 where player1 is not user, update database with player2
  //if game not found with missing player2 or if only game missing player2 is current user's game, create another new game
  router.put('/', (req, res) => {
    knex
      .select('id')
      .from('games')
      .whereNull('player2')
      .where('player1', '!=', req.body.username)
      .then((results) => {
        if (results[0]) {
          knex('games')
            .where('id', results[0].id)
            .update({ player2: req.body.username, status: 'active' })
            .then(res.status(200).send());
        } else {
          knex('games')
            .insert({ player1: req.body.username, status: 'inactive' })
            .then(res.status(200).send());
        }
      })
      .catch(
        function (error) {
          res.status(500).json({ error });
        }
      );
  });

  //on get request to /games/:gameid - retrieve all turn info related to the game
  router.get('/:gameid', (req, res) => {
    knex
      .select('*')
      .from('turns')
      .where('games_id', '=', req.params.gameid)
      .then((results) => {
        res.json(results);
      });
  });

  //on put request to /games/:gameid - enter new information into turns
  //Find all turns with gameid, if there's an entry with no bet2, that turn's unfinished, put bet into bet2
  //After bet2 is updated with new value, turn is finished - calculate winner & points won
  router.put('/:gameid', (req, res) => {

   if (req.body.type === "prize") {
    knex('turns')
    //.where('id', results)
    .insert({ games_id: req.params.gameid, prize: req.body.prize })
    .then(res.status(200).send());
    }




      knex('turns')
        .select('id', 'prize')
        .where('games_id', req.params.gameid)
        .whereNull('bet2')
        .then((results) => {
          //logic check to see who wins
          if (results[0]) {


            if (req.body.type === "bet1") {
              knex('turns')
                .where('id', results[0].id)
                .update({ 'bet1': req.body.bet,prize: req.body.prize,games_id: req.params.gameid })
                .then(res.status(200).send());
            }

            if (req.body.type === "bet2") {
              let winner = '';
              let points = results[0].prize;
              //console.log(points)
              //console.log(results[0].prize)
             // console.log(req.body.bet)
              console.log("bet1",results[0].bet1)
              if (results[0].bet1 > req.body.bet) {
                winner = 'player1'
              } else if (results[0].bet1 < req.body.bet) {
                winner = 'player2'
              }
              //update database with bet2, winner, prize
              knex('turns')
                .where('id', results[0].id)
                .update({ 'bet2': req.body.bet, 'winner': winner, 'points': points })
                .then(res.status(200).send());
            }

          // } else {
          //   knex('turns')
          //     .where('id', results)
          //     .insert({ 'bet1': req.body.bet, games_id: req.params.gameid, prize: req.body.prize })
          //     .then(res.status(200).send());
          // }
          }

        })
        .catch(
          function (error) {
            res.status(500).json({ error });
          }
        );
    // }
  });
  return router;
}
