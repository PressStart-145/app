$("#resultsList a").click(function(e) {
    console.log("hi");
    $("#search").hide();
    $("#confirm").show();
    $("#confirm p").append("Are you sure you want to join ");
    $("#confirm p").append($(this).innerHTML);
    $("#confirm p").append(" ?");
});

$("#noJoin").click(function(e) {
    $("#confirm").hide();
    $("#search").show();
    $("#confirm p").innerHTML = "";
});
