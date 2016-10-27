/* Build Castle JS */
$("#nameCastle").click(function(e) {
    $("#nameForm").hide();
    $("#addMembers").show();
});

$("#searchMem").click(function(e) {
    $("#mapMem").show();
});

/* Join Castle JS */
$("#resultsList a").click(function(e) {
    $("#search").hide();
    $(".confirm").show();
    $(".confirm p").append("Are you sure you want to join ");
    $(".confirm p").append($(this).text());
    $(".confirm p").append(" ?");
});

$("#noJoin").click(function(e) {
    $(".confirm").hide();
    $("#search").show();
    $(".confirm p").text("");
});

/* Other Castle JS */
