var selectedCastle;
var formInfo;
var castleList;
var isOriginal = true;
var viewList = [];
var data;
var input;

window.onload = function() {
    var inputType = $("<input>")
               .attr("type", "hidden")
               .attr("name", "type").val("member");
    inputType.appendTo("#sendJoin");
}

$("#resultsList").on('click', 'li', function() {
    $("#search").hide();
    $(".confirm").show();
    $(".confirm p").append("Are you sure you want to join ");
    selectedCastle = $(this).text();
    $(".confirm p").append($(this).text());
    $(".confirm p").append("?");
    if($("#hasData")) {
        $("#hasData").remove();
    }
   input = $("<input>")
              .attr("id", "hasData")
              .attr("type", "hidden")
              .attr("name", "name").val(selectedCastle);
    input.appendTo("#sendJoin");
});

/*
$("#yesJoin").click(function(e) {
    e.preventDefault();
    //Create a castle JSON object with the name and members provided
    $.post("/castle/add", data);
});
*/

$("#noJoin").click(function(e) {
    $(".confirm").hide();
    $("#search").show();
    $(".confirm p").text("");
});

var searchCastles = function() {
    formInfo = $("form").serializeArray();
    if(isOriginal) {
        castleList = $("#resultsList").html().replace(/\>\s+\</g,'><').trim();
        castleList = castleList.substring(8, castleList.length - 10).split("</li><li>");
        isOriginal = false;
        console.log(castleList);
    }
    viewList = [];
    for(s in castleList) {
        if(castleList[s].toUpperCase().includes(formInfo[0].value.toUpperCase())) {
            viewList.push(castleList[s]);
        } else if(castleList[s].replace(/\s/g,'').toUpperCase().includes(formInfo[0].value.toUpperCase())) {
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
