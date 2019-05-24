'use strict';

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
//on put request to /games check if any games missing player2, and if user already in a game waiting for player2
//if game found waiting for player2 where player1 is not user, update database with player2
//if game not found with missing player2 or if only game missing player2 is current user's game, create another new game
  router.put('/', (req, res) => {
    console.log('req.body:',req.body);
      knex
      .select('id')
      .from('games')
      .whereNull('player2')
      .where('player1', '!=', req.body.username)
      .then((results) => {
        console.log('results:', results);
        if(results[0]){
          console.log('if block triggered');
          knex('games')
          .where('id', results[0].id)
          .update({player2: req.body.username, status:'active'})
          .then(res.status(200).send());
        } else { 
          console.log('triggered else block');
          console.log('username:',req.body.username);
          knex('games')
          .insert({player1: req.body.username, status: 'inactive'})
          .then(res.status(200).send());      
        } 
      })
      .catch(
        function(error) {
          res.status(500).json({error});
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
  router.put('/:gameid', (req, res) => {
    knex('turns')
      .select('id')
      .where('games_id', '=', req.params.gameid)
      .whereNull('bet2', '=', null)
      .then((results) => {
        if(results){
          knex('turns')
            .where('id', '=', results)
            .update({'bet2':req.body.bet})
        } else {
          knex('turns')
            .where('id' , '=', results)
            .insert({games_id:req.params.gameid, prize:req.body.prize, bet1:req.body.bet1})
        }
        res.json(results);
      })
      .catch(
        function(error) {
          res.status(500).json({error});
        }
      );
  });
  return router;
}