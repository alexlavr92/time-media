'use strict'



let docWidth = document.body.clientWidth

// Функционал блокировки скрола при открытии модального окна
const BlockScroll = {
    open: function () {
        setTimeout(function () {

            if (!document.body.hasAttribute('data-body-scroll-fix')) {
                let scrollPosition = window.pageYOffset || document.documentElement.scrollTop; // Получаем позицию прокрутки

                document.body.setAttribute('data-body-scroll-fix', scrollPosition); // Cтавим атрибут со значением прокрутки
                document.body.style.overflow = 'hidden';
                document.body.style.position = 'fixed';
                document.body.style.top = '-' + scrollPosition + 'px';
                document.body.style.left = '0';
                document.body.style.right = '0';
                if ($('body').height() < $(window).height()) {
                    document.body.style.bottom = '0';
                }

            }
        }, 10);
    },
    close: function () {
        if (document.body.hasAttribute('data-body-scroll-fix')) {

            let scrollPosition = document.body.getAttribute('data-body-scroll-fix'); // Получаем позицию прокрутки из атрибута

            document.body.removeAttribute('data-body-scroll-fix'); // Удаляем атрибут
            document.body.style.overflow = '';
            document.body.style.position = '';
            document.body.style.top = '';
            document.body.style.left = '';
            document.body.style.right = '';
            window.scroll(0, scrollPosition); // Прокручиваем на полученное из атрибута значение
        }
    }
}
// ------------------------------------


jQuery(document).ready(function ($) {


    // Инициализация плагина анимации
    AOS.init({
        once: true,
    });
    // ------------------------------------


    const InitMarqueeHeader = {
        defaultOptions: {
            marqueeItem: $('.header-marquee')
        },
        init: function (options) {
            var options = $.extend(this.defaultOptions, options)
            options.durationValue = parseInt(options.marqueeItem.attr('duration')
            )
            options.marqueeItem.marquee({
                //duration in milliseconds of the marquee
                duration: options.durationValue,
                //gap in pixels between the tickers
                gap: 10,
                //time in milliseconds before the marquee will start animating
                delayBeforeStart: 0,
                //'left' or 'right'
                direction: 'left',
                //true or false - should the marquee be duplicated to show an effect of continues flow
                duplicated: true,
                // duplicate the message three times
                duplicateCount: 1,
                pauseOnHover: true,
                startVisible: true,
                delayBeforeStart: 1000
            });
        }
    }

    if ($('.header-marquee').length) {
        InitMarqueeHeader.init()
    }


    const HeaderResize = {
        header: $('header'),
        hamburgerMobile: $('.hamburger-mobile'),
        init: function () {
            this.headerBottomMain = this.header.find('.header-bottom')
            this.headerBottom = this.header.find('.header-bottom-inMob')
            this.headerMobile = this.header.find('.header-mobile')
            this.windowWidth = document.body.clientWidth
            this.events()
        },
        checkHeader: function () {
            const windowWidth = this.windowWidth
            if (windowWidth < 1200) {
                if (!this.headerMobile.find('.header-bottom-inMob').length)
                    this.headerBottom.appendTo(this.headerMobile.find('.row'))

                // this.headerMobile.css({
                //     'max-height': $(window).height() - this.header.find('.header-top').height() - this.header.find('.header-bottom').height() + 'px',
                //     'top': this.header.find('.header-top').height() + this.header.find('.header-bottom').height() + 'px'
                // })
            }
            else {
                if (!this.header.find('.header-bottom-inner .header-bottom-inMob').length) {
                    this.headerBottom.appendTo(this.header.find('.header-bottom-inner > .row'))
                    if (this.header.hasClass('open')) {
                        this.headerMobile.attr('style', '')
                        this.header.removeClass('open')
                        this.header.find('.header-nav-link.open').removeClass('open')
                        this.header.find('.dropdown-elem').css('display', '')
                        BlockScroll.close()
                    }
                }
            }
            setTimeout(() => {
                HeaderPadding()
            }, 200);

        },
        events: function () {
            const $thisObj = this

            this.hamburgerMobile.on('click', function () {
                if ($(window).scrollTop() > $thisObj.headerBottomMain.height() + $thisObj.header.find('.header-top').height()) {
                    $thisObj.headerMobile.css({
                        'max-height': $(window).height() - $thisObj.header.find('.header-bottom').height() + 'px',
                        'top': $thisObj.header.find('.header-bottom').height() + 'px'
                    })
                }
                else {
                    $thisObj.headerMobile.css({
                        'max-height': $(window).height() - $thisObj.header.find('.header-top').height() - $thisObj.header.find('.header-bottom').height() + 'px',
                        'top': $thisObj.header.find('.header-top').height() + $thisObj.header.find('.header-bottom').height() + 'px'
                    })
                }
                $thisObj.header.toggleClass('open')
                $thisObj.header.hasClass('open')
                    ? BlockScroll.open()
                    : BlockScroll.close()

                $thisObj.headerMobile.slideToggle()
            })
            $(window).on('resize', function () {
                if (document.body.clientWidth != $thisObj.windowWidth) {
                    $thisObj.windowWidth = document.body.clientWidth
                    console.log('ресайз')
                    $thisObj.checkHeader()
                }
            })
            this.header.find('.header-nav-link').on('click', function (e) {
                if ($thisObj.windowWidth < 1200) {
                    e.preventDefault()
                    $(this).toggleClass('open')
                    $(this).next('.dropdown-elem').slideToggle()
                }
            })
        }
    }

    if ($('header').length) {
        HeaderResize.init()
        HeaderResize.checkHeader()
        // HeaderPadding()
    }

    // Инициализация слайдер для автомобилей в другом городе // новое 07.2025
    const CategorySliderInit = {
        sliderWrapper: $('.topnews-slider-wrapper'),
        init: function (options) {

            if (options.sliderWrapper) {
                this.sliderWrapper = options.sliderWrapper
                // console.log(options)
            }
            const sliderContainer = this.sliderWrapper.find('.swiper-container'),
                PrevArrow = this.sliderWrapper.find('.swiper-button-prev'),
                NextArrow = this.sliderWrapper.find('.swiper-button-next')

            let swiper = new Swiper(sliderContainer, {
                slidesPerView: 'auto',
                spaceBetween: 15,
                speed: 1000,
                freeMode: true,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                grabCursor: true,
                navigation: {
                    nextEl: NextArrow,
                    prevEl: PrevArrow,
                },
                observer: true,
                observeParents: true,
                observeSlideChildren: true,
            })
        }
    }

    if ($('.topnews-slider-wrapper').length) {
        $('.topnews-slider-wrapper').each(function (index, elem) {
            CategorySliderInit.init({
                sliderWrapper: $(elem)
            })
        })
    }
    //----------------------//


    // Инициализация слайдера экспертный совет

    const SovietSliderInit = {
        sliderWrapper: $('.soviet-slider-wrapper'),
        init: function (options) {

            if (options.sliderWrapper) {
                this.sliderWrapper = options.sliderWrapper
                // console.log(options)
            }
            const sliderContainer = this.sliderWrapper.find('.swiper-container'),
                PrevArrow = this.sliderWrapper.closest('.soviet-wrapper').find('.swiper-button-prev'),
                NextArrow = this.sliderWrapper.closest('.soviet-wrapper').find('.swiper-button-next')

            let swiper = new Swiper(sliderContainer, {
                slidesPerView: 'auto',
                spaceBetween: 0,
                slidesPerGroup: 3,
                speed: 1000,
                freeMode: true,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                grabCursor: true,
                navigation: {
                    nextEl: NextArrow,
                    prevEl: PrevArrow,
                },
                breakpoints: {
                    1199: {
                        slidesPerGroup: 1,
                    }
                }
                // observer: true,
                // observeParents: true,
                // observeSlideChildren: true,
            })
        }
    }
    if ($('.soviet-slider-wrapper').length) {
        $('.soviet-slider-wrapper').each(function (index, elem) {
            SovietSliderInit.init({
                sliderWrapper: $(elem)
            })
        })
    }
}) // finish document ready

// Функционал отступа от header на всех страницах кроме главной
function HeaderPadding() {
    const Header = $('header'),
        HeaderTop = Header.find('.header-top'),
        HeaderBottom = Header.find('.header-bottom'),
        HeaderHeight = HeaderTop.outerHeight(true) + HeaderBottom.outerHeight(true)
    $('main').css('padding-top', HeaderHeight)

}



$(window).on('resize', function () {
    HeaderPadding()
})



function ContentLoad() {
    // alert('DOM готов');
}

document.addEventListener("DOMContentLoaded", ContentLoad)
