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

/* Game Castle JS */
var dmgMonster = function() {
    console.log("sgblsdgsdifhedisl");
    var fraction = monsterHealth / 100;
    var width = document.getElementById("monsterInfo").style.width;
    document.getElementById("monsterInfo").style.width = fraction * width;
    console.log(width);
};

/* Other Castle JS */
