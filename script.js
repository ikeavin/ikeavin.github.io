$("#animator").click(function() {
    $("#mainHeading").css("color", "#DA70D6");
    $("#mainHeading").animate({fontSize: "+50px"}, 1500);
    $("#mainHeading").animate({fontSize: "-50px"}, 1500);
});
