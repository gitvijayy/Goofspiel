
$(document).ready(function () {
  //////////////////////////////////////////////////////////
  let handsPlayed = 0;
  let prizeCards = [];
  var socket = io.connect("http://localhost:8080")
  const socketListen = {
    gameplay: () => {
      socket.on('gameplay', (data) => {
        if (document.cookie.split(';')[1].split("=")[1] === data.gameID) {
          getGameData(data.gameID, data.prizeCard)
        }
      })
    },
    turns: () => {
      socket.on('turns', (data) => {
        if (document.cookie.split(';')[1].split("=")[1] === data.gameID) {
          $(`.bet-1-img`).attr("src", `images/${data.bet1}C.png`);
          $(`.bet-2-img`).attr("src", `images/${data.bet2}H.png`);
          if (data.bet1 > data.bet2) {
            $(`.prize`).text(`${$(`.bet-1`).text()} Won the Bet`)
          } else if (data.bet1 < data.bet2) {
            $(`.prize`).text(`${$(`.bet-2`).text()} Won the Bet`)
          } else {
            $(`.prize`).text("Its A DRAWWWW")
          }
        }
      })
    }
  }
  const socketEmit = {
    gameplay: (generatePrizeCard, pc) => {
      socket.emit('gameplay', {
        gameID: document.cookie.split(';')[1].split("=")[1],
        player1: $(`.bet-1`).text(),
        player2: $(`.bet-2`).text(),
        generatePrizeCard: generatePrizeCard,
      })
    },
    turns: (bet2, status) => socket.emit('turns', {
      gameID: document.cookie.split(';')[1].split("=")[1],
      player1: $(`.bet-1`).text(),
      player2: $(`.bet-2`).text(),
      bet1: $(`.bet-1-img`).data("id"),
      bet2: bet2,
      status: status
    })
  }
  socketListen.gameplay();
  socketListen.turns();

  const loginCheck = () => {
    if (!document.cookie) {
      $(`.user-logged-out`).css("display", "flex")
      $(`.user-logged-in`).css("display", "none")
      //$(`.user-logged-out`).addClass("vh-100")
      $(`.user-logged-out p`).empty();
      $(`.username`).val("")
    } else {
      $(`.user-logged-out`).css("display", "none")
      $(`.user-logged-in`).css("display", "block")
      getActiveGames(document.cookie.split(';')[0].split("=")[1])
      $(`main .block-2`).removeClass('game-over')
      $(`main .block-2`).removeClass('bg-alternate-2')
      $(`main .block-2`).addClass('bg-alternate-1')
    }
  }
  ///////////////////////////////////////////////////////
  const flipGameBoard = () => {
    $(`.player-1`).empty();
    $(`.player-2`).empty();
    $(`.player-1-turn`).empty();
    $(`.player-2-turn`).empty();
    $(`.player-1-turn`).empty()
    $(`.player-2-turn`).empty()
    $(`.player-1-prize`).empty();
    $(`.player-2-prize`).empty();
    $(`main .block-2 article`).removeClass(`hide-display`)
  }
  ////////////////////////////////////////////////////
  const gamePlayData = (gameId) => {
    let player1 = $(`#${gameId}`).data("player1");
    let player2 = $(`#${gameId}`).data("player2");
    if (!player1 || !player2) {
      alert("Waiting for a player to join the game")
      return false;
    }
    document.cookie = `gameid=${gameId}`
    flipGameBoard();
    $(`.bet-1`).text(player1)
    $(`.bet-2`).text(player2)
    getGameData(gameId, 0)
  }
  const generatePrizeCard = (status) => {
    let checker = 0;
    while (checker === 0) {
      let prizeCard = Math.floor(Math.random() * 14);
      if (!prizeCards.includes(prizeCard) && prizeCard != 0) {
        $.ajax({
          type: "PUT",
          url: `/games/${document.cookie.split(';')[1].split("=")[1]}`,
          data: { prize: prizeCard, type: "prize" },
          success: () => {
            socketEmit.gameplay()
          },
          error: () => {
          },
        });
        checker = 1;
      }
    }

  }
  const splitTurnsData = (turns, status) => {
    turns.sort((a, b) => { return a.id - b.id; })
    let turnsData = { player1: [], player2: [], player1prize: [], player2prize: [], prize: [] };
    let player1Points = 0;
    let player2Points = 0;
    $(`.player-1`).empty();
    $(`.player-2`).empty();
    $(`.player-1-prize`).empty();
    $(`.player-2-prize`).empty();
    turns.forEach(element => {
      turnsData["player1"].push(element.bet1)
      turnsData["player2"].push(element.bet2)
      turnsData["prize"].push(element.prize)
      if (element["winner"] === "player1") {
        turnsData["player1prize"].push(element.prize)
      }
      if (element["winner"] === "player2") {
        turnsData["player2prize"].push(element.prize)
      }
      $(`.prize`).empty()
      if (!element["bet1"]) {
        $(`.bet-1-img`).attr("src", `images/aces.png`);
        $(`.bet-2-img`).attr("src", "images/blackBack")
        $(`.player-1`).data("turn", 1);
        $(`.player-2`).data("turn", 0);
        $(`.prize`).append(`Prize <img class="prize-img" src="images/${element["prize"]}D.png">`)
        $(`.prize`).data("cardIndex", `${element["prize"]}`)
      }
      else if (!element["bet2"]) {
        if (document.cookie.split(';')[0].split("=")[1] === $(`.bet-1`).text()) {
          $(`.bet-1-img`).attr("src", `images/${element["bet1"]}C.png`);
        } else {
          $(`.bet-1-img`).attr("src", `images/blackBack`);
        }
        $(`.bet-2-img`).attr("src", `images/aces.png`);
        $(`.prize`).append(`Prize <img class="prize-img" src="images/${element["prize"]}D.png">`)
        $(`.prize`).data("cardIndex", `${element["prize"]}`)
        $(`.bet-1-img`).data("id", element["bet1"])
        $(`.player-2`).data("turn", 1);
        $(`.player-1`).data("turn", 0);
      }
    })
    for (var i = 1; i < 14; i++) {
      if (!turnsData.player1.includes(i) && document.cookie.split(';')[0].split("=")[1] == $(`.bet-1`).text()) {
        $(`.player-1`).append(`<img id ="${i}" src ="images/${i}C.png")>`)
        $(`.player-2`).append(`<img id ="${i}" src ="images/blackBack")>`)
      }
      if (!turnsData.player2.includes(i) && document.cookie.split(';')[0].split("=")[1] == $(`.bet-2`).text()) {
        $(`.player-2`).append(`<img id ="${i}" src ="images/${i}H.png")>`)
        $(`.player-1`).append(`<img id ="${i}" src ="images/blackBack")>`)
      }
      if (i <= turnsData.player1prize.length) {
        $(`.player-1-prize`).append(`<img id ="${turnsData.player1prize[i - 1]}" src ="images/${turnsData.player1prize[i - 1]}D.png")>`)
        player1Points += turnsData.player1prize[i - 1]
      }
      if (i <= turnsData.player2prize.length) {
        $(`.player-2-prize`).append(`<img id ="${turnsData.player2prize[i - 1]}" src ="images/${turnsData.player2prize[i - 1]}D.png")>`)
        player2Points += turnsData.player2prize[i - 1]
      }
    }
    if ($(`.prize`).text() === "") {
      $(`main .block-2`).removeClass('bg-alternate-2')
      $(`main .block-2`).removeClass('bg-alternate-1')
      $(`main .block-2`).addClass('game-over')
      if (player1Points > player2Points) {
        $(`.prize`).text(`${$(`.bet-1`).text()} WON`)
      } else if (player1Points < player2Points) {
        $(`.prize`).text(`${$(`.bet-2`).text()} WON`)
      } else {
        $(`.prize`).text("Its A DRAWWWW")
      }
      $(`.bet-1-img`).attr("src", `images/aces.png`);
      $(`.bet-2-img`).attr("src", `images/aces.png`);
    }
    prizeCards = turnsData["prize"]
    handsPlayed = turns.length;
    $(`header .block-2`).prepend(`<p class="btn btn-dark btn-lg" ">Total Points - ${player1Points}</p>`)
    $(`footer .block-2`).prepend(`<p class="btn btn-dark btn-lg" >Total Points - ${player2Points}</p>`)
    return turnsData;
  }
  ///////////////////////////////////////////
  const getGameData = (gameId, prizeCard) => {
    $.ajax({
      method: "GET",
      url: `games/${gameId}`
    }).done((turns) => {
      if (!turns.length) {
        generatePrizeCard()
      } else {
        splitTurnsData(turns, prizeCard)
      }
    })
  }
  /////////////////////////////////////////////////////////////
  const getActiveGames = (user) => {
    $.ajax({
      method: "GET",
      url: `users/${user}`
    }).done((users) => {
      console.log(users)
      $(`main .block-1 p`).remove()
      users.forEach(element => {
        if (element.player1 === user || element.player2 === user) {
          if (element.status === "inactive") {
            $(`main .block-1`).append(`<p id = ${element.id} class="btn btn-light btn-lg btn-block">${element.id}</p>`)
          } else if (element.status === "active") {
            $(`main .block-1`).append(`<p id = ${element.id} class="btn btn-dark btn-lg btn-block">${element.id}</p>`)
          }
          $(`main .block-1 #${element.id}`).data("player1", element.player1)
          $(`main .block-1 #${element.id}`).data("player2", element.player2)
        }
      });
      //loginCheck()
    })
  }
  //////////////////////////////////////////////////////////////
  //////////////////////////////////////////////////////////////
  const addNewUser = (user) => {
    $.ajax({
      type: "POST",
      url: "/users",
      data: { username: user },
      success: () => {
        document.cookie = `username=${$(".username").val()}`
        loginCheck()

      },
      error: () => {
        document.cookie = `username=${$(".username").val()}`
        loginCheck()

      },
    });
  }
  ////////////////////////////////////////////////////////////
  const newGame = (user) => {
    $.ajax({
      type: "PUT",
      url: "/games",
      data: { username: user, prizeCards: "5,7,8,9,10,11,12,13,1,2,3,4,6" },
      success: () => {
        getActiveGames(user)
      },
      error: () => {
      },
    });
  }
  /////////////////////////////////////////////////////////
  /////////////////////////////////////////////////////////
  $(document).on(`click`, `.user-submit`, function () {
    if ($(`.username`).val().trim()) {
      addNewUser($(`.username`).val())
    } else {
      $(`.user-logged-out p`).text("Invalid Username")
    }
  })
  //////////////////////////////////////////////////////////////
  $(document).on(`click`, `.new-game`, function () {
    newGame(document.cookie.split(';')[0].split("=")[1])
  })
  ///////////////////////////////////////////////////////////////////
  $(document).on(`click`, `main .block-1 p`, function () {
    gamePlayData($(this).attr("id"))
    $(`main .block-2`).removeClass('game-over')
    $(`main .block-2`).removeClass('bg-alternate-1')
    $(`main .block-2`).addClass('bg-alternate-2')
  })
  /////////////////////////////////////////////////////////
  $(document).on(`click`, `.player-1 img`, function () {
    if (document.cookie.split(';')[0].split("=")[1] != ($(`.bet-1`).text())) {
      alert("Stick to your cards");
      return false;
    }
    let turnCheck = $(`.player-1`).data("turn");
    if (turnCheck === 1) {
      $.ajax({
        type: "PUT",
        url: `/games/${document.cookie.split(';')[1].split("=")[1]}`,
        data: { prize: $(`.prize`).data("cardIndex"), bet: $(this).attr("id"), type: "bet1" },
        success: () => {
          socketEmit.gameplay(false, $(`.prize`).data("cardIndex"))
        },
        error: () => {
        },
      });
    } else {
      alert("Not your turn")
    }
  });
  $(document).on(`click`, `.player-2 img`, function () {
    if (document.cookie.split(';')[0].split("=")[1] != ($(`.bet-2`).text())) {
      alert("Stick to your cards");
      return false;
    }
    let turnCheck = $(`.player-2`).data("turn");
    if (turnCheck === 1) {
      let status = "active"

      if (handsPlayed === 13) { status = "done" }
      socketEmit.turns($(this).attr("id"), status);
      $.ajax({
        type: "PUT",
        url: `/games/${document.cookie.split(';')[1].split("=")[1]}`,
        data: {
          prize: $(`.prize`).data("cardIndex"),
          bet: $(this).attr("id"), type: "bet2",
          status: status
        },
        success: () => {
          if (handsPlayed < 13) {
            setTimeout(function () {
              generatePrizeCard(status)
            }, 2000);
          } else {
            socketEmit.gameplay()
          }
        },
        error: () => {
        },
      });
    } else {
      alert("Not your turn")
    }
  });
  $(document).on(`click`, `.logout`, function (event) {
    document.cookie = "username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    document.cookie = "gameid= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"
    loginCheck();
  })
  loginCheck();
})
