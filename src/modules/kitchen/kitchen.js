import $ from "jquery";

$(document).ready(function(){
    $(".kitchen__score-block").on("click","a", function (event) {
        event.preventDefault();
        let id  = $(this).attr('href'),
        top = $(id).offset().top;
        $('body,html').animate({scrollTop: top}, 1000);
    });
});
