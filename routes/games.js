/* eslint-disable no-console */
'use strict';

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {
//on put request to /games check (create new game) if any games missing player2, and if user already in a game waiting for player2
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
          console.error(error);
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

//on put request to /games/:gameid (submitting turn information) - enter new information into turns
//Find all turns with gameid, if there's an entry with no bet2, that turn's unfinished, put bet into bet2
//After bet2 is updated with new value, turn is finished - calculate winner & points won
  router.put('/:gameid', (req, res) => {


    knex('turns')
    .select('id', 'bet1', 'prize')
    .where('games_id', req.params.gameid)
    .whereNull('bet2')
    .then((results) => {
      //logic check to see who wins
      if(results[0]){
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
          .then((result) => {
            if (req.body.status!== 'done'){ 
              res.status(200).send()
            }
          }); 
      } else {
        knex('turns')
          .where('id', results)
          .insert({games_id:req.params.gameid, prize:req.body.prize, bet1:req.body.bet})
          .then(function(result){
              if (req.body.status!== 'done'){
                console.log(result);
                res.status(200).send()
              }
          }); 
      }
    })
    .catch(
      function(error) {
        console.error(error);
      }
    );


    // if game status = done
    if (req.body.status === 'done'){
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
            .then((results) =>{
              console.log('results for player2 points', results)
              let p2 = results[0].sum;
              console.log('p1:',p1, 'p2',p2);
              
              if (p1 > p2) {
                console.log('player1 winning if loop triggered')
                knex('games')
                  .select('player1', 'player2')
                  .where('id', req.params.gameid)
                  .then((results) =>{
                    let name1 = results[0].player1;
                    let name2 = results[0].player2;
                    knex('games')
                      .where('id', req.params.gameid)
                      .update({'winner':name1, 'status':'done'})
                      .then((result) => { 
                        // incrementing games played/won
                        knex('users')
                          .where('username', name1)
                          .increment({games_played:1, games_won:1})
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
                        function(error) {
                          console.error(error);
                        }
                      )                                     
                  })
              } else if (p2 > p1) {
                console.log('player2 winning if loop triggered')
                knex('games')
                  .select('player1','player2')
                  .where('id', req.params.gameid)
                  .then((results) =>{
                    let name1 = results[0].player1;
                    let name2 = results[0].player2;
                    knex('games')
                      .where('id', req.params.gameid)
                      .update({'winner':name2, 'status':'done'})
                      .then((result) => { 
                        knex('users')
                          .where('username', name2)
                          .increment({games_played:1, games_won:1})
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
                        function(error) {
                          console.error(error);
                        }
                      )                  
                  })     
              } else { // tie condition 
                console.log('tie condition triggered')             
                knex('games')
                  .select('player1', 'player2')
                  .where('id', req.params.gameid)
                  .then((results) =>{
                    let name1 = results[0].player1;
                    let name2 = results[0].player2;
                    knex('games')
                      .where('id', req.params.gameid)
                      .update({'status':'done'})
                      .then((result) => { 
                        knex('users')
                          .where('username', name1)
                          .orWhere('username', name2)
                          .increment({games_played:1})
                          .then((results) => {
                            res.status(200).send()
                          })
                      })
                      .catch(
                        function(error) {
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
