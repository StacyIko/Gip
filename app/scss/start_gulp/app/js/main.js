$(function () {
	$('.burger, .header__link').on('click', function () {
		$('.header__nav').toggleClass('header__nav--active');
	})
});