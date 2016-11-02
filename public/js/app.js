$("#sidebarMenu").load('/sidebar.html');

$(".backBtn").click(function(e) {
    console.log("before");
    e.preventDefault();
    console.log("after default");
    window.history.back();
});
