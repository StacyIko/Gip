$(function () {
	// burger button
	$('.burger, .nav__link').on('click', function () {
		$('.nav').toggleClass('nav--active');
	})
	// smooth scroll
	$(".nav a, .header__btn, .hero__btn").on("click", function (event) {
		event.preventDefault();
		var id = $(this).attr('href'),
			top = $(id).offset().top - $(".header").height();
		$('body,html').animate({ scrollTop: top }, 1500);
	});

		// show button when scrolling
	$(window).on("scroll", function (event) {
		let scroll = $(window).scrollTop();
		let headerH = $(".header").height();
		if (scroll > headerH) {
			$(".header__btn").css("opacity", "1");
		} else {
			$(".header__btn").css("opacity", "0");
		}
	});

	const navItems = $(document).find(".nav__item");
	const sectionItems = $(document).find(".section");

	$(".works__item").on("click", function(){
		$(this).fancybox({
			href: $(this).data('src')
		});
	});

	$(".about__item").on("click", function(){
		$(this).fancybox({
			href: $(this).data('src')
		});
	});
});

// nav animation
const navItems = document.querySelectorAll(".nav__item");

const navAnimation = () => {
	let scrollTop = window.scrollY;
	let windowHeight = window.innerHeight;
	let siteHeight = document.documentElement.scrollHeight;
	let percentageNav = Math.floor(scrollTop / (siteHeight - windowHeight)*100);
	const navDot = document.querySelector(".nav__dot");
	navDot.style.top = `${percentageNav}%`;

	for (let i = 0; i < navItems.length; i++) {
		if ((percentageNav >= (i*100/(navItems.length - 1)-5))&&(percentageNav < ((i+1)*100/(navItems.length - 1)))) {
			let navItem = navItems[i];
			navItem.classList.add("nav__item--active");
		}
	}
}

navAnimation();
window.addEventListener('scroll', () => {
	navAnimation();
})

// slider swiper
const swiper = new Swiper('.works__slider', {
		slidesPerView: '1',
		spaceBetween: 30,
  	loop: true,
		navigation: false,
  	pagination: {
    	el: '.swiper-pagination',
			clickable: true
  	},

		breakpoints: {
          576: {
            slidesPerView: 2,
            spaceBetween: 30,
						loop: true,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 30,
						centeredSlides: true,
						loop: true,
          },
          991: {
						slidesPerView: 3,
            spaceBetween: 30,
						centeredSlides: true,
						mousewheel: true,
						navigation: {
    					nextEl: '.works__button-next',
    					prevEl: '.works__button-prev',
  					},
						pagination: false,
						loop: true,
          },
        },
});

const swiperHeader = new Swiper('.hero__bottom', {
		slidesPerView: '2',
		spaceBetween: 30,
  	loop: false,
		navigation: false,
		mousewheel: true,
		grabCursor: true,
  	pagination: false,
		scrollbar: {
    el: '.swiper-scrollbar',
  	},

		breakpoints: {
          991: {
						slidesPerView: 3,
            spaceBetween: 30
          },
        },
});


