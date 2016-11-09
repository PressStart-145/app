/* Build Castle JS */
$("#nameCastle").click(function(e) {
    e.preventDefault();
    $("#nameForm").hide();
    $("#addMembers").show();
});

window.onload = function() {
    document.forms['nameCastle'].target='_self';
    document.forms['inputSearch'].target='formresponse';
}

var formInfo;
var memList;
var isOriginal = true;

var formResults = function() {
    formInfo = $("form").serializeArray();
    if(isOriginal) {
        memList = $("#mapMem").html().replace(/\s/g,'');
        memList = memList.substring(8, memList.length - 10).split("</li><li>");
        isOriginal = false;
    }
    var viewList = [];
    for(s in memList) {
        if(memList[s].toUpperCase().includes(formInfo[1].value.toUpperCase())) {
            viewList.push(memList[s]);
        }
    }
    var newHtml = "<ul>";
    for(s in viewList) {
        newHtml += "<li>" + viewList[s] + "</li>";
    }
    $("#mapMem").html( newHtml + "</ul>");
    $("#mapMem").show();
}

/*
$("#searchMem").click(function(e) {
    var memList = $("#mapMem").html().replace(/\s/g,'');
    memList = memList.substring(8, memList.length - 10).split("</li><li>");
    for(s in memList) {
        if(s.includes(formInfo[1].value)) {
            console.log(s);
        }
    }
});
*/

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
    dmgMonster();
};

var dmgMonster = function() {
    if($("#monsterHP")[0]){
        var str = $("#monsterHP").text().match(/:.*?\//g)[0];
        var monsterHealth = str.substring(2, str.length - 1);
        var fraction = monsterHealth / 100;
        var width = fraction * 50;
        $("#monsterHealth").css('width', (fraction * width) + "%");
    }
};

/* Other Castle JS */
