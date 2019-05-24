// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });;
// });
$(document).ready(function () {

console.log(document)
document.cookie = `username=${username}`;
(document.cookie).split("=")[1]

$(document).on(`click`, `.logout`, function (event) {

  event.preventDefault();

  document.cookie = "username= ; expires = Thu, 01 Jan 1970 00:00:00 GMT"

  location.reload();
})

if (!document.cookie.length)

})
