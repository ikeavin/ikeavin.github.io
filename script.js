$("#animator").click(function() {
    $("#mainHeading").css("color", "#DA70D6");
    $("#mainHeading").animate({fontSize: "+=40px"}, 1500);
    $("#mainHeading").animate({fontSize: "-=40px"}, 1500);
    $("#kev_image").animate({border: "5px"}, 1500);
});
