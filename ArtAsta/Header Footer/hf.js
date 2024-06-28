$(document).ready(function () {
    // Toggle dropdown menu on click
    $('.dropdown-toggle').click(function (e) {
        e.preventDefault();
        var $dropdownMenu = $(this).next('.dropdown-menu');
        // Close other dropdowns
        $('.dropdown-menu').not($dropdownMenu).slideUp();
        $dropdownMenu.slideToggle();
    });

    // Toggle mobile menu on hamburger icon click
    $('.hamburger-menu').click(function () {
        $('nav ul').toggleClass('open');
    });

    // Close dropdown menu and mobile menu when clicking outside
    $(document).click(function (e) {
        var target = e.target;
        if (!$(target).is('.dropdown-toggle') && !$(target).parents().is('.dropdown-toggle')) {
            $('.dropdown-menu').slideUp();
        }
        if (!$(target).is('nav ul') && !$(target).parents().is('nav ul') && !$(target).is('.hamburger-menu') && !$(target).parents().is('.hamburger-menu') && !$(target).hasClass('search-input')) {
            $('nav ul').removeClass('open');
        }
    });

    // Prevent closing dropdown menu when clicking inside
    $('.dropdown-menu').click(function (e) {
        e.stopPropagation();
    });

    // Prevent closing mobile menu when clicking inside
    $('nav ul').click(function (e) {
        e.stopPropagation();
    });
});