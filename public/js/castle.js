/* Build Castle JS */
$("#nameCastle").click(function(e) {
    e.preventDefault();
    $("#nameForm").hide();
    $("#addMembers").show();
});

var formInfo;
var memList;
var toAdd = [];
var isOriginal = true;
var viewList = []; //Search results list

var formResults = function() {
    formInfo = $("form").serializeArray();
    if(isOriginal) {
        memList = $("#mapMem").html().replace(/\s/g,'');
        memList = memList.substring(8, memList.length - 10).split("</li><li>");
        isOriginal = false;
    }
    for(s in memList) {
        if(memList[s].toUpperCase().includes(formInfo[1].value.toUpperCase())) {
            viewList.push(memList[s]);
        }
    }

    if(viewList.length == 0) {
        $("#mapMem").html( "<p>No matches were found.</p>");
    } else {
        populateResults();
    }
    $("#mapMem").show();
}

var populateResults = function() {
    var newHtml = "<ul id='results'>";
    for(s in viewList) {
        if(toAdd.indexOf(viewList[s]) >= 0) {
            newHtml += "<li class='taken'>" + viewList[s] + "</li>";
        } else {
            newHtml += "<li>" + viewList[s] + "</li>";
        }
    }
    $("#mapMem").html( newHtml + "</ul>");
}

$("#mapMem").on('click', 'li', function() {
    var username = $(this).text();
    var index = toAdd.indexOf(username);
    if(index < 0){
        toAdd.push(username);
    } else {
        toAdd.splice(index, 1);
    }
    $(this).toggleClass("taken");
    updateSelected();
});

$("#selectedMem").on('click', 'div', function() {
    var username = $(this).text();
    var index = toAdd.indexOf(username);
    if(index >= 0){
        toAdd.splice(index, 1);
    }
    $(this).toggleClass("taken");
    updateSelected();
    populateResults();
});

var updateSelected = function() {
    $("#selectedMem").html("");
    for(i in toAdd) {
        $("#selectedMem").append("<div>" + toAdd[i] + "</div>");
    }
}

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
