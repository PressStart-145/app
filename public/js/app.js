window.onload = function() {
};


$("#sidebarMenu").load('/sidebar.html');
$(".sidebarToggleButton").click(function(e) {
		e.preventDefault();
		console.log($(this).attr('class'));
		$("#sidebarDiv").toggleClass("toggled");
});
