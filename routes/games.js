"use strict";

const express = require('express');
const router  = express.Router();

module.exports = (knex) => {

  router.put("/", (req, res) => {
    // knex
    //   .select("*")
    //   .from("games")
    //   .then((results) => {
    //     res.json(results);
    // });
  });

  // router.get("/:id", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("users")
  //     .then((results) => {
  //       res.json(results);
  //   });
  // });

  // router.put("/:id", (req, res) => {
  //   knex
  //     .select("*")
  //     .from("users")
  //     .then((results) => {
  //       res.json(results);
  //   });
  // });
  return router;
}