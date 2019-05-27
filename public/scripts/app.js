
$(document).ready(function () {
  //////////////////////////////////////////////////////////
  let handsPlayed = 0;
  let prizeCards = [];
  let pc1 = 0;
  var socket = io.connect("http://localhost:8080")
  const socketForGameplay = (generatePrizeCard, pc) => {
    socket.emit('gameplay', {
      gameID: document.cookie.split(';')[1].split("=")[1],
      player1: $(`.player-1`).text(),
      player2: $(`.player-2`).text(),
      generatePrizeCard: generatePrizeCard,
      prizeCard: pc1
    })
  }
  socket.on('gameplay', (data) => {
    if ($(`.player-2`).text() === data.player2
      && $(`.player-1`).text() === data.player1 &&
      document.cookie.split(';')[1].split("=")[1] === data.gameID) {
      getGameData(data.gameID, data.prizeCard)
    }
  })
  socket.on('turns', (data) => {
    if ($(`.player-2`).text() === data.player2
      && $(`.player-1`).text() === data.player1 &&
      document.cookie.split(';')[1].split("=")[1] === data.gameID) {
      $(`.bet-2-img`).attr("src", `images/${data.prizeCard}C.png`);
    }
  })
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
  const gameNotStarted = (gameId) => {
    for (var i = 1; i < 14; i++) {
      if (document.cookie.split(';')[0].split("=")[1] === $(`.bet-1`).text()) {
        $(`.player-1`).append(`<img id ="${i}" src ="images/${i}C.png")>`)
        //$(`.player-2`).append(`<img src ="images/blackBack")>`)
        $(`.player-2`).append(`<img id ="${i}" src ="images/blackBack")>`)
      }
      if (document.cookie.split(';')[0].split("=")[1] === $(`.bet-2`).text()) {
        $(`.player-2`).append(`<img id ="${i}" src ="images/${i}H.png")>`)
        $(`.player-1`).append(`<img id ="${i}" src ="images/blackBack")>`)
      }
    }
    $(`.prize-img`).attr("src", `images/${gameId.split("")[0]}D.png`)
    $(`.bet-1-img`).attr("src", "images/blackBack")
    $(`.bet-2-img`).attr("src", "images/blackBack")
    ///////////////////////////////////////////////////
    $(`.prize`).data("cardIndex", `${gameId.split("")[0]}`)
    $(`.prize`).data("cardIndex", 1)
    ////////////////////////////////////////////////
    $(`.player-1`).data("turn", 1);
  }
  const generatePrizeCard = () => {
    let checker = 0;
    while (checker === 0) {
      let prizeCard = Math.floor(Math.random() * 14);
      if (!prizeCards.includes(prizeCard) && prizeCard != 0) {
        console.log("inside prize card")
        $.ajax({
          type: "POST",
          url: `/games/${document.cookie.split(';')[1].split("=")[1]}`,
          data: { prize: prizeCard, type: "prize" },
          success: () => {
            socketForGameplay(true, prizeCard)
          },
          error: () => {
          },
        });
        checker = 1;
      }
    }
  }
  const splitTurnsData = (turns, prizeCard) => {
    turns.sort((a, b) => {
      return a.id - b.id;
    })
    let turnsData = { player1: [], player2: [], player1prize: [], player2prize: [], prize: [] };
    let player1Points = 0;
    let player2Points = 0;
    $(`.player-1`).empty();
    $(`.player-2`).empty();
    $(`.player-1-prize`).empty();
    $(`.player-2-prize`).empty();
    for (var i = 0; i < turns.length; i++) {
      let element = turns[i];
      turnsData["player1"].push(element.bet1)
      turnsData["player2"].push(element.bet2)
      if (element["winner"] === "player1") {
        turnsData["player1prize"].push(element.prize)
      }
      if (element["winner"] === "player2") {
        turnsData["player2prize"].push(element.prize)
      }
      console.log(0, element["prize"])
      $(`.prize-img`).attr("src", `images/${element["prize"]}D.png`)
      $(`.prize`).data("cardIndex", `${element["prize"]}`)
      if (!element["bet1"]) {
        $(`.bet-1-img`).attr("src", "images/blackBack")
        $(`.player-1`).data("turn", 1);
        $(`.player-2`).data("turn", 0);
        $(`header .block-1 h1`).text("PLACE A BET")
        $(`footer .block-1 h1`).text("WAIT")
        $(`.player-2`).attr("turnA", 1);
      }
      else if (!element["bet2"]) {
        $(`.bet-1-img`).attr("src", `images/${element["bet1"]}C.png`);
        $(`.player-2`).data("turn", 1);
        $(`.player-1`).data("turn", 0);
        $(`header .block-1 h1`).text("WAIT")
        $(`footer .block-1 h1`).text("PLACE A BET")
        $(`.player-2`).attr("turnA", 1);
      }
      else {
        turnsData["prize"].push(element.prize)
        $(`.player-1`).data("turn", 1);
        $(`.player-2`).data("turn", 0);
        $(`.player-1`).attr("turnA", 1);
        $(`.bet-1-img`).attr("src", "images/blackBack")
        $(`.bet-2-img`).attr("src", "images/blackBack")
        $(`header .block-1 h1`).text("PLACE A BET")
        $(`footer .block-1 h1`).text("WAIT")
      }
    }
    // let checker = 0;
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
    prizeCards = turnsData["prize"]
    console.log(1, prizeCards)
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
        gameNotStarted(gameId);
      } else {
        console.log(turns)
        const gameData = splitTurnsData(turns, prizeCard)
        console.log(gameData)
      }
    })
  }
  /////////////////////////////////////////////////////////////
  const getActiveGames = (user) => {
    $.ajax({
      method: "GET",
      url: `users/${user}`
    }).done((users) => {
      // console.log(users)
      $(`main .block-1 p`).remove()
      users.forEach(element => {
        if (element.player1 === user || element.player2 === user) {
          if (element.status === "inactive") {
            $(`main .block-1`).append(`<p id = ${element.id} class="btn btn-light btn-lg btn-block">${element.id}</p>`)
          } else if (element.status === "active") {
            $(`main .block-1`).append(`<p id = ${element.id} class="btn btn-success btn-lg btn-block">${element.id}</p>`)
          }
          $(`main .block-1 #${element.id}`).data("player1", element.player1)
          $(`main .block-1 #${element.id}`).data("player2", element.player2)
        }
      });
      loginCheck()
    })
  }
  const getLeaderboard = () => {
    $.ajax({
      method: "GET",
      url: `/leaders`
    }).done((leaders) => {
      $(`.rules-gops`).css("display", "none")
      $(`.leaderboard-title p`).text("LEADERBOARD")
      $(`.leaderboard-head th`).remove();
      $(`.leaderboard-body tr`).remove();
      $(`.leaderboard-head`)
        .append($(`<th>Rank</th>
        <th>User</th>
        <th>Played</th>
        <th>Won</th>
        <th>Lost</th>`))
      leaders.forEach((element) => {
        $(`.leaderboard-body`)
          .append($(`<tr>
          <td>${$(`.leaderboard-body tr`).length + 1}</td>
        <td>${element.username}</td>
        <td>${element.games_played}</td>
        <td>${element.games_won}</td>
        <td>${element.games_played - element.games_won}</td>
        </tr>`))
      })
    })
  }
  ///////////////////////////////////////////////////////
  const getArchives = (username) => {
    $.ajax({
      method: "GET",
      url: `/archives/${username}`,
    }).done((archives) => {
      $(`.rules-gops`).css("display", "none")
      $(`.leaderboard-title p`).text("Games Archive")
      $(`.leaderboard-head th`).remove();
      $(`.leaderboard-body tr`).remove();
      $(`.leaderboard-head`)
        .append($(`
        <th>#</th>
        <th>Game Id</th>
        <th>Player 1</th>
        <th>Player 2</th>
        <th>Winner</th>
        `))
      archives.forEach((element) => {
        if (element.status === "done") {
          $(`.leaderboard-body`)
            .append($(`<tr>
          <td>${$(`.leaderboard-body tr`).length + 1}</td>
        <td>${element.id}</td>
        <td>${element.player1}</td>
        <td>${element.player2}</td>
        <td>${element.winner}</td>
        </tr>`))
        }
      })
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
        getActiveGames(user)
      },
      error: () => {
        document.cookie = `username=${$(".username").val()}`
        getActiveGames(user)
      },
    });
  }
  ////////////////////////////////////////////////////////////
  const newGame = (user) => {
    $.ajax({
      type: "PUT",
      url: "/games",
      data: { username: user },
      success: () => {
        getActiveGames(user)
      },
      error: () => {
      },
    });
  }
  /////////////////////////////////////////////////////////
  $(document).on(`click`, `.leader`, function () {
    getLeaderboard();
  })
  $(document).on(`click`, `.archive`, function () {
    getArchives(document.cookie.split(';')[0].split("=")[1]);
  })
  $(document).on(`click`, `.rules`, function () {
    $(`.leaderboard-title p`).text("GAMEPLAY RULES")
    $(`.leaderboard-head th`).remove();
    $(`.leaderboard-body tr`).remove();
    $(`.rules-gops`).css("display", "block")
  })
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
    let player1 = $(this).data("player1");
    let player2 = $(this).data("player2");
    if (!player1 || !player2) {
      //////////////!
      alert("Waiting for a player to join the game")
      return false;
    }
    let gameId = $(this).attr("id")
    document.cookie = `gameid=${gameId}`
    flipGameBoard();
    $(`.bet-1`).text(player1)
    $(`.bet-2`).text(player2)
    getGameData(gameId, 0)
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
        type: "POST",
        url: `/games/${document.cookie.split(';')[1].split("=")[1]}`,
        data: { prize: $(`.prize`).data("cardIndex"), bet: $(this).attr("id"), type: "bet1" },
        success: () => {
          socketForGameplay(false, $(`.prize`).data("cardIndex"))
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
      if (handsPlayed === 12) { status = "done" }
      console.log(handsPlayed)
      console.log(status)
      $.ajax({
        type: "POST",
        url: `/games/${document.cookie.split(';')[1].split("=")[1]}`,
        data: {
          prize: $(`.prize`).data("cardIndex"),
          bet: $(this).attr("id"), type: "bet2",
          status: status
        },
        success: () => {
          setTimeout(function () {
            generatePrizeCard()
          }, 3000);
          socket.emit('turns', {
            gameID: document.cookie.split(';')[1].split("=")[1],
            player1: $(`.player-1`).text(),
            player2: $(`.player-2`).text(),
            generatePrizeCard: generatePrizeCard,
            prizeCard: $(this).attr("id")
          })
        },
        error: () => {
        },
      });
    } else {
      alert("Not your turn")
    }
  });
  loginCheck();
  getActiveGames(document.cookie.split(';')[0].split("=")[1])
})
