/* Handles moving to the next slide */
var viewportHeight = $(window).height();
$('.slide').attr("style", "min-height: " + viewportHeight + "px");

$(function () {

    $(window).resize(function () {
        var viewportHeight = $(window).height();
        $('.slide').attr("style", "min-height: " + viewportHeight + "px");
    });

    $(document).on("slide:submit", function (event, that) {

        /* show next slide */
        var target = $(that).children('button[type="submit"]').attr('data-href');

        /* get previous slide */
        var previousSlide = $(that).closest("section.slide");


        $(target).removeClass('hidden');

        /* move to next slide */
        var $anchor = $(that).children('button[type="submit"]');
        $('html, body').stop().animate({
            /*scrollTop: $('[data-show="' + target + '"]').offset().top*/
            scrollTop: $($anchor.attr('data-href')).offset().top
        }, 1500, 'easeInOutExpo', function () {
            //$(previousSlide).addClass('visibilityHidden');
        });

    });


    /* Collapse the navbar on scroll */
    /*$(window).scroll(function () {
     if ($(".navbar").offset().top > 50) {
     $(".navbar-fixed-top").addClass("top-nav-collapse");
     } else {
     $(".navbar-fixed-top").removeClass("top-nav-collapse");
     }
     });*/

});