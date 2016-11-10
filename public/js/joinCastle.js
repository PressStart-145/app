var selectedCastle;
var formInfo;
var castleList;
var isOriginal = true;
var viewList = [];

$("#resultsList").on('click', 'li', function() {
    $("#search").hide();
    $(".confirm").show();
    $(".confirm p").append("Are you sure you want to join ");
    selectedCastle = $(this).text();
    $(".confirm p").append($(this).text());
    $(".confirm p").append("?");
});

$("#yesJoin").click(function(e) {
    //e.preventDefault();
    //Create a castle JSON object with the name and members provided

    var data = {
        "type": "member",
        "value": {
            "name": selectedCastle
        }
    };
    $.post("/castle/add", data);
});

$("#noJoin").click(function(e) {
    $(".confirm").hide();
    $("#search").show();
    $(".confirm p").text("");
});

var searchCastles = function() {
    formInfo = $("form").serializeArray();
    if(isOriginal) {
        castleList = $("#resultsList").html().replace(/\s/g,'');
        castleList = castleList.substring(8, castleList.length - 10).split("</li><li>");
        isOriginal = false;
    }
    viewList = [];
    for(s in castleList) {
        if(castleList[s].toUpperCase().includes(formInfo[0].value.toUpperCase())) {
            viewList.push(castleList[s]);
        }
    }

    if(viewList.length == 0) {
        $("#resultsList").html( "<p>No matches were found.</p>");
    } else {
        populateResults();
    }
    $("#resultsList").show();
}

var populateResults = function() {
    var newHtml = "<ul id='results'>";
    for(s in viewList) {
        newHtml += "<li>" + viewList[s] + "</li>";
    }
    $("#resultsList").html( newHtml + "</ul>");
}
