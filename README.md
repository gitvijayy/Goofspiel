# Goofspiel

Goofspiel is a two player card game web application developed by [gitvijayy](https://github.com/gitvijayy) and [JerChuang](https://github.com/JerChuang) for the Lighthouse labs web development bootcamp midterm project. 

The application allows players to choose their usernames, and play a game of Goofspiel against another player.


## Card Game Rules
Goofspiel is a two player card game where each player receives a suit of cards, and use the cards in their hands to bid for a the cards in a third suit that's designated as prize cards.

On each turn, a card from the prize suit is revealed, and the players have to place a card from their hand. The player with the bigger card will win the prize cards. On tie conditions, the prize card will be discarded.

The cards are worth their face value in points, with A being worth 1 point, J worth 11 points, Q worth 12 points, and K worth 13 points.

The game ends when there's no more prize cards left. On game end, each player count their total number of points and determine who's the winner

##Final Product
!["Login page"](https://github.com/gitvijayy/Goofspiel/blob/master/public/images/gameplay.png)
!["Gameplay"](https://github.com/gitvijayy/Goofspiel/blob/master/public/images/login.png)


## Getting Started

1. Clone this repository
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the server: `npm run local`
7. Visit `http://localhost:8080/`

## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
- "body-parser": "^1.15.2",
- "dotenv": "^2.0.0",
- "ejs": "^2.4.1",
- "express": "^4.13.4",
- "knex": "^0.16.5",
- "knex-logger": "^0.1.0",
- "morgan": "^1.7.0",
- "node-sass-middleware": "^0.9.8",
- "pg": "^6.0.2"
