$(() => {
  $.ajax({
    method: "GET",
    url: "/users"
  }).done((users) => {
    for(let user of users) {
      $("<div>").text(user.username).appendTo($("body"));
    }
  });
});
