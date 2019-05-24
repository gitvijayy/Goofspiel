'use strict';

const express = require('express');
const router  = express.Router();

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
        if(results[0]){
          knex('games')
          .where('id', results[0].id)
          .update({player2: req.body.username, status:'active'})
          .then(res.status(200).send());
        } else {
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
//Find all turns with gameid, if there's an entry with no bet2, that turn's unfinished, put bet into bet2
//After bet2 is updated with new value, turn is finished - calculate winner & points won
  router.put('/:gameid', (req, res) => {
<<<<<<< HEAD

    knex('turns')
      .select('id', 'bet1', 'prize')
      .where('games_id', req.params.gameid)
      .whereNull('bet2')
      .then((results) => {
        //logic check to see who wins
        if(results[0]){
          let score = results[0].bet1 - req.body.bet;
          let winner = '';
          let points = results[0].prize;
          console.log(results[0]);
          if (score > 0){
            winner = 'player1'
          } else if (score < 0) {
            winner = 'player2'
          } else {
            winner = null;
            points = 0;
          }
          //update database with bet2, winner, prize
          console.log(results[0]);
          knex('turns')
            .where('id', results[0].id)
            .update({'bet2':req.body.bet, 'winner':winner, 'points':points})
            .then(res.status(200).send());
        } else {
          knex('turns')
            .where('id', results)
            .insert({games_id:req.params.gameid, prize:req.body.prize, bet1:req.body.bet})
            .then(res.status(200).send());
        }
      })
=======
    //if game status = done
    // if (req.body.status === 'done'){
    //   // select all turns that matches game id
    //   knex('turns')
    //     .select('points')
    //     .where('games_id', req.params.gameid)
    //     // select where winner = player1 and count the total points compare value, then select winner with id and player1/2 from games, update status, winner     
    //     .where('winner', 'player1')
    //     .sum('points')
    //     .then((results) => {
    //       let p1 = results[0].points;
    //       // select where winner = player 2 and count the total points
    //       knex('turns')
    //         .select('points')
    //         .where('games_id', req.params.gameid)
    //         .sum('points')
    //         //compare who has more points
    //         .then((results) =>{
    //           let p2 = results[0].points;
    //           if (p1>p2){
    //             knex('games')
    //               .select('player1')
    //               .where('id', req.params.gameid)
    //               .then((results) =>{
    //                 knex('games')
    //                   .where('id', req.params.gameid)
    //                   .update('winner', results[0].player1)
                    
    //               })

    //           }if (p2>p1) {

    //           } else {
    //             // ties
    //           }

              
    //         })
    //     })
      
      
      knex('games')
      .where('id', req.params.gameid)
      .update({'status':'done'})
      .then(
        res.status(200).send())
>>>>>>> 705f51b12672a7d119fb466e8eca41b373ead2a4
      .catch(
        function(error) {
          res.status(500).json({error});
        }
      );
    // else games is not over, update each turn 
    } else {
      knex('turns')
        .select('id', 'bet1', 'prize')
        .where('games_id', req.params.gameid)
        .whereNull('bet2')
        .then((results) => {
          //logic check to see who wins
          if(results[0]){
            // let score = results[0].bet1 - req.body.bet;
            let winner = '';
            let points = results[0].prize;
            if (results[0].bet1 > req.body.bet){
              winner = 'player1'
            } else if (results[0].bet1 < req.body.bet) {
              winner = 'player2'
            } else {
              winner = null;
              points = 0;
            }
            //update database with bet2, winner, prize  
            knex('turns')
              .where('id', results[0].id)
              .update({'bet2':req.body.bet, 'winner':winner, 'points':points})
              .then(res.status(200).send()); 
          } else {
            knex('turns')
              .where('id', results)
              .insert({games_id:req.params.gameid, prize:req.body.prize, bet1:req.body.bet})
              .then(res.status(200).send()); 
          }
        })
        .catch(
          function(error) {
            res.status(500).json({error});
          }
        );
    }
  });
  return router;
}
