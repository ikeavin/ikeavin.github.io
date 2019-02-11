$("#animator").click(function() {
    $("#mainHeading").css("color", "#DA70D6");
    $("#mainHeading").animate({fontSize: "150%"}, 1500);
    $("#mainHeading").animate({fontSize: "75%"}, 1500);
});
