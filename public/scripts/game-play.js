
$(document).ready(function () {
  //   const pointsCounter = (player1, prize, player2) => {
  // if (player1 > player2) {
  //   $(`header .block-2`).append {
  //   }
  // }
  //   };
  // var game = {
  //   id: 2,
  //   games_id: 1,
  //   prize:10,
  //   bet1:8,
  //   bet2:9,
  //   winner:"player1",
  //   points:10
  // }
  // var activeGame = {
  //   id: 2,
  //   //games_id: 1,
  //   player1:"jason",
  //   player2:"joe",
  //   status:"active"
  // }
  console.log(activeGame["status"])
  $(document).on(`click`, `.player-1 img`, function () {
    let turnCheck = $(`.player-1`).data("turn");
    console.log(turnCheck)
    if (turnCheck === 1) {
      let player1Bet = $(this).attr("id").split("")[0];
      // let player2Bet = $(`.bet-1`).attr("id").split("")[0];
      // let prizePoint = $(`.prize`).data("cardIndex")
      let holder = $(`.player-1`).data("playedCards") +
        $(this).attr("id") + ","
      $(`.player-1`).data("playedCards", holder)
      $(`.bet-1`).data("value", player1Bet)
      $(`.player-1`).data("turn", 0);
      $(`.player-2`).data("turn", 1);
      $(`.bet-1 img`).attr("src", `images/${$(this).attr("id")}.png`)
      activeGame["status"] = "active"
      $(this).remove()
      $(`.player-2-turn`).text("Your Turn")
      //$(`footer.block-1`).addClass("playerTurns")
      $(`.player-1-turn`).empty()
      //$(`header .block-1`).removeClass("playerTurns")
      // ab+=1
      // console.log(ab)
      // let prizeCalculate = $(`.prize`).data("calculateTurn");
      // if (prizeCalculate === 2) {
      //   pointsCounter(player1Bet,prizePoint,player2Bet)
      // }else {
      //   prizeCalculate += 1;
      //   $(`.prize`).data("calculateTurn",prizeCalculate)
      // }
    }
  });
  $(document).on(`click`, `.player-2 img`, function () {
    let turnCheck = $(`.player-2`).data("turn");
    console.log(turnCheck)
    if (turnCheck === 1) {
      // let player1Bet = $(`.bet-1`).attr("id").split("")[0];
      let player2Bet = $(this).attr("id").split("")[0];
      // let prizePoint = $(`.prize`).data("cardIndex")
      let holder = $(`.player-2`).data("playedCards") +
        $(this).attr("id") + ","
      $(`.player-2`).data("playedCards", holder)
      $(`.bet-2`).data("value", player2Bet)
      $(`.player-2`).data("turn", 0);
      $(`.player-1`).data("turn", 1);
      // ab+=1
      // console.log(ab)
      $(`.bet-2 img`).attr("src", `images/${$(this).attr("id")}.png`)
      // console.log($(`.bet-2`).data("value"))
      $(this).remove()
      $(`.player-1-turn`).text("Your Turn")
      //$(`header .block-1`).addClass("playerTurns")
      $(`.player-2-turn`).empty()
      //$(`footer .block-1`).removeClass("playerTurns")
      // let prizeCalculate = $(`.prize`).data("calculateTurn");
      activeGame["status"] = "Inactive"
      console.log(activeGame["status"])
      // prizeCalculate += 1;
    }
  });
});
