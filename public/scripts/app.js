
$(document).ready(function () {
  //////////////////////////////////////////////////////////
  let statusCheck = 0;


var socket = io.connect("http://localhost:8080")

socket.on('gameplay',(data)=>{
  if($(`.player-2`).text() === data.player2
  && $(`.player-1`).text() === data.player1 &&
  document.cookie.split(';')[1].split("=")[1] === data.gameID){
    console.log("1,in")
    getGameData(data.gameID,0)

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
        //$(`.player-1`).append(`<img  src ="images/blackBack")>`)
      }
    }
    $(`.prize-img`).attr("src", `images/${gameId.split("")[0]}D.png`)
    $(`.bet-1-img`).attr("src", "images/blackBack")
    $(`.bet-2-img`).attr("src", "images/blackBack")
    ///////////////////////////////////////////////////
    $(`.prize`).data("cardIndex", `${gameId.split("")[0]}`)
    ////////////////////////////////////////////////
    $(`.player-1`).data("turn", 1);
  }
  //////////////!
  const prizeCardGenerate = (gameId, prizeCard) => {
    // console.log(gameId, prizeCard)
    $.ajax({
      type: "PUT",
      url: `/games/${gameId}`,
      data: { prize: prizeCard, type: "prize" },
      success: () => {
        // getGameData(document.cookie.split(';')[1].split("=")[1])
      },
      error: () => {
      },
    });
  }
  ///////////////////////////////////////////////
  const splitTurnsData = (turns, prizeCardCheck) => {

    turns.sort((a,b)=>{
      return a.id -b.id;
    })
console.log("sorted",turns)
    let turnsData = { player1: [], player2: [], player1prize: [], player2prize: [], prize: [] };
    let player1Points = 0;
    let player2Points = 0;
    //let winnerCheck = 0;
    $(`.player-1`).empty();
    $(`.player-2`).empty();
    $(`.player-1-prize`).empty();
    $(`.player-2-prize`).empty();
    console.log(turns)
    turns.forEach((element,index) => {
      //console.log(element.id)
      turnsData["player1"].push(element.bet1)
      turnsData["player2"].push(element.bet2)
      //if (element["bet1"] != null) {
        if (element["bet1"] && element["bet2"]){
        if (element["winner"] === "player1") {
          turnsData["player1prize"].push(element.prize)
        }
        if (element["winner"] === "player2") {
          turnsData["player2prize"].push(element.prize)
        }
      }
      //if (element["winner"] == null && element["bet2"] == null && element["bet1"] != null) {
        if (!element["winner"] && !element["bet2"]  && element["bet1"]) {
        //console.log(0)
        console.log(0,element["prize"])
        $(`.prize-img`).attr("src", `images/${element["prize"]}D.png`)
        $(`.prize`).data("cardIndex", `${element["prize"]}`)
        winnerCheck = 1;
      }

      //if (element["bet1"] == null ) {
        if (!element["bet1"] ){
        //console.log(11)
        console.log(index,"if")
        $(`.bet-1-img`).attr("src", "images/blackBack")
        $(`.player-1`).data("turn", 1);
        $(`.player-2`).data("turn", 0);
        $(`header .block-1 h1`).text("PLACE A BET")
        $(`footer .block-1 h1`).text("WAIT")
        $(`.prize-img`).attr("src", `images/${element["prize"]}D.png`)
        $(`.prize`).data("cardIndex", `${element["prize"]}`)
         $(`.player-2`).attr("turnA", 1);
      }
      //else if (element["bet2"] == null ) {
        else if (!element["bet2"] ){
        //console.log(22)
        console.log(index, "elseif")
        $(`.bet-1-img`).attr("src", `images/${element["bet1"]}C.png`);
        $(`.player-2`).data("turn", 1);
        $(`.player-1`).data("turn", 0);
        $(`header .block-1 h1`).text("WAIT")
        $(`footer .block-1 h1`).text("PLACE A BET")
         $(`.player-2`).attr("turnA", 1);
      }
      else {
        //console.log(33)
        console.log(index, "else")
        turnsData["prize"].push(element.prize)
        $(`.player-1`).data("turn", 1);
        $(`.player-2`).data("turn", 0);
        $(`.player-1`).attr("turnA", 1);
        $(`.bet-1-img`).attr("src", "images/blackBack")
        $(`.bet-2-img`).attr("src", "images/blackBack")
        $(`header .block-1 h1`).text("PLACE A BET")
        $(`footer .block-1 h1`).text("WAIT")
      }
      ////////////////////////////////////////////
    })
    // let checker = 0;
    for (var i = 1; i < 14; i++) {
      if (!turnsData.player1.includes(i) && document.cookie.split(';')[0].split("=")[1] == $(`.bet-1`).text()) {
        // if (checker === 0) {
        //   $(`.player-2`).append(`<img src ="images/blackBack")>`)
        //   checker = 1;
        // }
        $(`.player-1`).append(`<img id ="${i}" src ="images/${i}C.png")>`)
        $(`.player-2`).append(`<img id ="${i}" src ="images/blackBack")>`)
      }
      if (!turnsData.player2.includes(i) && document.cookie.split(';')[0].split("=")[1] == $(`.bet-2`).text()) {
        // if (checker === 0) {
        //   $(`.player-2`).append(`<img src ="images/blackBack")>`)
        //   checker = 1;
        // }
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
    // if (element["bet2"] == null && element["bet"] == null) {
    if (prizeCardCheck === 1 && turns.length < 13) {
      let checker = 0;
      while (checker === 0) {
        let prizeCard = Math.floor(Math.random() * 14);
        if (prizeCard === 0) { prizeCard += 1 }
        if (!turnsData["prize"].includes(prizeCard)) {
          $(`.prize-img`).attr("src", `images/${prizeCard}D.png`)
          $(`.prize`).data("cardIndex", prizeCard)
          prizeCardGenerate(document.cookie.split(';')[1].split("=")[1], prizeCard);
          checker = 1;
          prizeCardCheck = 0;
        }
      }
    }

    // if (turns.length === 13) {
    // getLeaderboard();
    // }
    // }
    //$(`.prize-card`).data("gameStatus",turns.length)
    statusCheck = turns.length;
    $(`header .block-2`).prepend(`<p class="btn btn-dark btn-lg" ">Total Points - ${player1Points}</p>`)
    $(`footer .block-2`).prepend(`<p class="btn btn-dark btn-lg" >Total Points - ${player2Points}</p>`)
    return turnsData;
  }
  ///////////////////////////////////////////
  const getGameData = (gameId, prizeCardCheck) => {
    $.ajax({
      method: "GET",
      url: `games/${gameId}`
    }).done((turns) => {
      //////////////!
      // console.log(turns)
      if (!turns.length) {
        gameNotStarted(gameId);
      } else {
        const gameData = splitTurnsData(turns, prizeCardCheck)
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
      $(`.leaderboard tr`).remove();
      leaders.forEach((element, index) => {
        $(`.leaderboard`)
          .append($(`<tr>
        <td>${index++}</td>
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
    console.log(1,username)
    $.ajax({
      method: "GET",
      url: `/archives/${username}`,
      //data: {username: username}
    }).done((archives) => {
      console.log(2,archives)
     // $(`.archives tr`).remove();
      // leaders.forEach((element, index) => {
        // $(`.archives`)
        //   .append($(`<tr>
        // <td>${index++}</td>
        // <td>${element.username}</td>
        // <td>${element.games_played}</td>
        // <td>${element.games_won}</td>
        // <td>${element.games_played - element.games_won}</td>
        // </tr>`))
      // })
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
      // dataType: dataType
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
    console.log(player1,player2)
    if (player1 == null || player2 == null) {
      //////////////!
      alert("Waiting for a player to join the game")
      return false;
    }
    let gameId = $(this).attr("id")
    document.cookie = `gameid=${gameId}`
    flipGameBoard();
    $(`.bet-1`).text(player1)
    $(`.bet-2`).text(player2)
    getGameData(gameId,0)
  })
  /////////////////////////////////////////////////////////

  // const socketForGameplay = () => {
  //   socket.emit('gameplay',{
  //     gameID: document.cookie.split(';')[1].split("=")[1],
  //     player1: $(`.player-1`).text(),
  //     player2: $(`.player-2`).text()
  //   })
  //   socket.on('gameplay',(data)=>{
  //     if($(`.player-2`).text() === data.player2
  //     && $(`.player-1`).text() === data.player1 &&
  //     document.cookie.split(';')[1].split("=")[1] === data.gameID){
  //       console.log("in")
  //       getGameData(data.gameID,0)

  //     }

  //   })
  // }



  $(document).on(`click`, `.player-1 img`, function () {
    if (document.cookie.split(';')[0].split("=")[1] != ($(`.bet-1`).text())) {
      //////////////!
      alert("Stick to your cards");
      return false;
    }




    let turnCheck = $(`.player-1`).data("turn");
     console.log("turn",turnCheck)
    if (turnCheck === 1) {
      // $(`.player-1`).data("turn", 0);
      // $(`.player-2`).data("turn", 1);
      //console.log(turnCheck, "in")
      //console.log(document.cookie.split(';')[1].split("=")[1])
      //////////////!
      $.ajax({
        type: "PUT",
        url: `/games/${document.cookie.split(';')[1].split("=")[1]}`,
        data: { prize: $(`.prize`).data("cardIndex"), bet: $(this).attr("id"), type: "bet1" },
        success: () => {
          //console.log("in2")
          //getGameData(document.cookie.split(';')[1].split("=")[1], 0)

//socketForGameplay();
socket.emit('gameplay',{
  gameID: document.cookie.split(';')[1].split("=")[1],
  player1: $(`.player-1`).text(),
  player2: $(`.player-2`).text()
})





        },
        error: () => {
          //getGameData(document.cookie.split(';')[1].split("=")[1], 0)
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
    //let statusCheck = $(`.prize-card`).data("gameStatus");
    if (turnCheck === 1) {
      // $(`.player-2`).data("turn", 0);
      // $(`.player-1`).data("turn", 1);
      //console.log(statusCheck);
      let status = "active"
      if (statusCheck === 13) { status = "done" }
      $.ajax({
        type: "PUT",
        url: `/games/${document.cookie.split(';')[1].split("=")[1]}`,
        data: {
          prize: $(`.prize`).data("cardIndex"),
          bet: $(this).attr("id"), type: "bet2",
          status: status
        },
        success: () => {
         // getGameData(document.cookie.split(';')[1].split("=")[1], 1)
         //socketForGameplay();
         socket.emit('gameplay',{
          gameID: document.cookie.split(';')[1].split("=")[1],
          player1: $(`.player-1`).text(),
          player2: $(`.player-2`).text()
        })
        socket.on('gameplay',(data)=>{
          if($(`.player-2`).text() === data.player2
          && $(`.player-1`).text() === data.player1 &&
          document.cookie.split(';')[1].split("=")[1] === data.gameID){
            console.log("2,in")
            getGameData(data.gameID,1)

          }

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
  //getLeaderboard();
  //getArchives(document.cookie.split(';')[0].split("=")[1])
  getActiveGames(document.cookie.split(';')[0].split("=")[1])
  //( "#foo" ).trigger( "click" )
  //flipGameBoard()
  //$(`main .block-1 #${document.cookie.split(';')[1].split("=")[1]}`).trigger(`click`)
 // console.log(document.cookie.split(';')[1].split("=")[1])

  //getGameData(document.cookie.split(';')[1].split("=")[1],0)

})
