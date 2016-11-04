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
window.onload = function() {
    var str = $("#monsterHP").text().match(/:.*?\//g)[0];
    var monsterHealth = str.substring(2, str.length - 1);
    var fraction = monsterHealth / 100;
    var width = fraction * 50;
    $("#monsterHealth").css('width', (fraction * width) + "%");
    console.log((fraction * width) + "%");
};

var dmgMonster = function() {
    var str = $("#monsterHP").text().match(/:.*?\//g);
    console.log(str[0]);
    var monsterHealth = str[0].substring(2);
    console.log(monsterHealth);
    /*
    var fraction = monsterHealth / 100;
    var width = document.getElementById("monsterInfo").style.width;
    document.getElementById("monsterInfo").style.width = fraction * width;
    console.log(width);
    */
};

/* Other Castle JS */
