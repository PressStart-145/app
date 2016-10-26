$("#aRank").click(function(e) {
    $(".nav a").toggleClass("active");
    $("#achievements").hide();
    $("#ranks").show();
});

$("#aAch").click(function(e) {
    $(this).toggleClass("active");
    $("#achievements").show();
    $("#ranks").hide();
});
