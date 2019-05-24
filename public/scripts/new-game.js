$(document).ready(function () {
  $(document).on(`click`, `.new-game`, function () {
    $(`.player-1`).empty();
    $(`.player-2`).empty();
    $(`.player-1-turn`).empty();
    $(`.player-2-turn`).empty();
    $(`header .block-1`).removeClass("playerTurns")
    $(`footer .block-1`).removeClass("playerTurns")
    $(`.player-1-turn`).empty()
    $(`.player-2-turn`).empty()
    $(`main .block-2 article`).addClass("hide-display")
    $(`main .block-2`).addClass("flip");
    for (var i = 1 ;i<14 ;i++) {
      $(`.player-1`).append(`<img id ="${i}" src ="images/${i}C.png")>`)
      $(`.player-2`).append(`<img id ="${i}" src ="images/${i}H.png")>`)
    }
    setTimeout(function () {
      $(`main .block-2`).removeClass("flip");
      $(`main .block-2 article`).removeClass(`hide-display`)
        }, 2000);
// const suits = ["C","S","H"]
// const suit1 = Math.floor(Math.random()*suits.length);
 const prizeCard = Math.floor(Math.random()*14)
// let suit2 = 0;
// if (suit1 === 0) {
//   suit2 = 1
// } else if (suit1 === 1) {
//   suit2 = 2
// } else if (suit1 === 2) {
//   suit2 = 0
// }
let turn = Math.floor(Math.random()*2)
  $(`.player-1`).data("turn",turn)
  // $(`.player-1`).data("playedCards","")
  // $(`.player-2`).data("playedCards","")
  // $(`.prize`).data("cardIndex",`${prizeCard}`)
  // $(`.prize`).data("calculateTurn",0)
  // $(`.prize`).data("prizeCards",prizeCard)
  $(`.prize img`).attr("src",`images/${prizeCard}D.png`)
  $(`.bet-1 img`).attr("src","images/blackBack")
  $(`.bet-2 img`).attr("src","images/blackBack")
if (turn === 1) {
  $(`.player-1-turn`).text("Your Turn")
 // $(`header .block-1`).addClass("playerTurns")
} else {
  $(`.player-2-turn`).text("Your Turn")
  $(`.player-2`).data("turn",1)
  //$(`footer .block-1`).addClass("playerTurns")
}
  });
});
