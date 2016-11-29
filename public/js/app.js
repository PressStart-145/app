var scrollEventHandler = function()
{
  window.scroll(0, window.pageYOffset);
}

window.addEventListener("scroll", scrollEventHandler, false);

$("#sidebarMenu").load('/sidebar.html');

$(".backBtn").click(function(e) {
    console.log("before");
    e.preventDefault();
    console.log("after default");
    window.history.back();
});

$(".sidebarToggleButton").click(function(e) {
    e.preventDefault();
    $("#sidebarDiv").toggleClass("toggled");
});

// $('#forgotPassword').click(function(e){
//   e.preventDefault();
//   $.post( "/login/forgotPassword", {},function(data){});
// });
