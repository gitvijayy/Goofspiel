/* eslint-disable no-console */
'use strict';

const express = require('express');
const router = express.Router();

module.exports = (knex) => {
  
  //on put request to /games (create new game) check if any games missing player2 that wasn't created by the user
  //if game found, update database with player2 = username
  //if game not found, create another new game
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
          console.error(error);
        }
      );
  });

  //on get request to /games/:gameid - retrieve all turns info related to the game
  router.get('/:gameid', (req, res) => {
    knex
      .select('*')
      .from('turns')
      .where('games_id', '=', req.params.gameid)
      .then((results) => {
        res.json(results);
      });
  });

  //on put request to /games/:gameid (submitting turn information)
  // - enter new information into turns, calculate winner for the turn
  // - when game is done, count all points of both players and determine who won
  // - update games table winner column and username table games_played games_won column
  router.put('/:gameid', (req, res) => {
    ///////////////////// new refactor code//////////////////
  //on game begins, client sends prize card, game id info
  // if (req.body.type !== 'bet1' && req.body.type !== 'bet2'){
  //   console.log('if loop for not bet1 bet2 type triggered')
  //   knex('turns')
  //   .insert({ games_id: req.params.gameid, prize: req.body.prize})
  //   .then(res.status(200).send());
  // //after game starts, all put request from player submitting a card will be attached with type of bet1 or bet2    
  // } else if (req.body.type === 'bet1') {
  //   console.log('if loop for bet1 type triggered')
  //   knex('turns')
  //     .where('games_id', req.params.gameid)
  //     .update({'bet1': req.body.bet})
  //     .then(res.status(200).send());
  // } else if (req.body.type === 'bet2'){
  //   console.log('if loop for bet2 type triggered')
  //   knex('turns')
  //     .select('id', 'bet1', 'prize')
  //     .where('games_id', req.params.gameid)
  //     .whereNull('bet2')
  //     .then((results) => {
  //       let winner = '';
  //       let points = results[0].prize;
  //       //Caluculating who wins the turn
  //       if (results[0].bet1 > req.body.bet) {
  //         winner = 'player1'
  //       } else if (results[0].bet1 < req.body.bet) {
  //         winner = 'player2'
  //       } else {
  //         winner = null;
  //         points = 0;
  //       }
  //       //Updating the turns with calculated results
  //       knex('turns')
  //         .where('id', results[0].id)
  //         .update({ 'bet2': req.body.bet, 'winner': winner, 'points': points })
  //         .then(() => {
  //           if (req.body.status !== 'done') {
  //             res.status(200).send()
  //           }
  //         });
  //     })
  // } 
  /////////////////////////////////


  ////////////////////////// original working code //////////////////////
    knex('turns')
      .select('id', 'bet1', 'prize')
      .where('games_id', req.params.gameid)
      .whereNull('bet2')
      .then((results) => {
        //logic check to see who wins
        if (results[0]) {

          if (req.body.type === "bet2") {
            let winner = '';
            let points = results[0].prize;

            if (results[0].bet1 > req.body.bet) {
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
              .update({ 'bet2': req.body.bet, 'winner': winner, 'points': points })
              .then((result) => {
                if (req.body.status !== 'done') {
                  res.status(200).send()
                }
              });
          }

          if (req.body.type === "bet1") {
            knex('turns')
              .where('id', results[0].id)
              .update({ 'bet1': req.body.bet, prize: req.body.prize, games_id: req.params.gameid })
              .then(res.status(200).send());
          }
        } else {
          knex('turns')
            .where('id', results)
            .insert({ games_id: req.params.gameid, prize: req.body.prize, bet1: req.body.bet })
            .then(function (result) {
              if (req.body.status !== 'done') {
                //console.log(result);
                res.status(200).send()
              }
            });
        }
      })
      .catch(
        function (error) {
          console.error(error);
        }
      );

    // if game status = done
    if (req.body.status === 'done') {
      // find name of player1 and player 2
      // select all turns that matches game id
      knex('turns')
        .sum('points')
        .where('games_id', req.params.gameid)
        // select where winner = player1 and count the total points compare value, then select winner with id and player1/2 from games, update status, winner
        .where('winner', 'player1')
        .sum('points')
        .then((results) => {
          console.log('results for player1 points', results, 'results.sum', results.sum, 'typeof results', typeof results)

          let p1 = results[0].sum;

          // select where winner = player 2 and count the total points
          knex('turns')
            .sum('points')
            .where('games_id', req.params.gameid)
            .where('winner', 'player2')
            //compare who has more points and set winner in games table
            .then((results) => {
              console.log('results for player2 points', results)
              let p2 = results[0].sum;
              console.log('p1:', p1, 'p2', p2);

              if (p1 > p2) {
                console.log('player1 winning if loop triggered')
                knex('games')
                  .select('player1', 'player2')
                  .where('id', req.params.gameid)
                  .then((results) => {
                    let name1 = results[0].player1;
                    let name2 = results[0].player2;
                    knex('games')
                      .where('id', req.params.gameid)
                      .update({ 'winner': name1, 'status': 'done' })
                      .then((result) => {
                        // incrementing games played/won
                        knex('users')
                          .where('username', name1)
                          .increment({ games_played: 1, games_won: 1 })
                          .then((results) => {
                            knex('users')
                              .where('username', name2)
                              .increment('games_played')
                              .then((results) => {
                                res.status(200).send()
                              })
                          })
                      })
                      .catch(
                        function (error) {
                          console.error(error);
                        }
                      )
                  })
              } else if (p2 > p1) {
                console.log('player2 winning if loop triggered')
                knex('games')
                  .select('player1', 'player2')
                  .where('id', req.params.gameid)
                  .then((results) => {
                    let name1 = results[0].player1;
                    let name2 = results[0].player2;
                    knex('games')
                      .where('id', req.params.gameid)
                      .update({ 'winner': name2, 'status': 'done' })
                      .then((result) => {
                        knex('users')
                          .where('username', name2)
                          .increment({ games_played: 1, games_won: 1 })
                          .then((results) => {
                            knex('users')
                              .where('username', name1)
                              .increment('games_played')
                              .then((results) => {
                                res.status(200).send()
                              })
                          })
                      })
                      .catch(
                        function (error) {
                          console.error(error);
                        }
                      )
                  })
              } else { // tie condition
                console.log('tie condition triggered')
                knex('games')
                  .select('player1', 'player2')
                  .where('id', req.params.gameid)
                  .then((results) => {
                    let name1 = results[0].player1;
                    let name2 = results[0].player2;
                    knex('games')
                      .where('id', req.params.gameid)
                      .update({ 'status': 'done' })
                      .then((result) => {
                        knex('users')
                          .where('username', name1)
                          .orWhere('username', name2)
                          .increment({ games_played: 1 })
                          .then((results) => {
                            res.status(200).send()
                          })
                      })
                      .catch(
                        function (error) {
                          console.error(error);
                        }
                      )
                  })
              }
            })
        })
    } //closing bracket for if status = done
  }); //closing bracket for router.put
  return router;
} // closing bracket for export
