$(document).ready(function () {

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

})
