$("#animator").click(function() {
    $("#mainHeading").css("color", "#DA70D6");
    $("#mainHeading").animate({fontSize: "100px"}, 1500);
    $("#mainHeading").animate({fontSize: "100%"}, 1500);
});
