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

    if ($('.inner-page .bg-wrapper').length) {
        HeaderPadding()
    }

    // Инициализация плагина анимации
    AOS.init({
        once: true,
    });
    // console.log(AOS)
    // ------------------------------------


    // Функционал работы Header 
    const InitHeader = {
        defaultsOptions: {
            headerWrapper: $('header'),
            windowWidth: document.body.clientWidth,
            lastScrollTop: 0
        },
        checkSticky: function (scrollTop, headerWrapper) {
            const headerTop = headerWrapper.find('.header-top'),
                headerTopHeight = headerTop.innerHeight()
            scrollTop > headerTopHeight
                ? headerWrapper.addClass('sticky')
                : headerWrapper.removeClass('sticky')
        },
        init: function () {
            this.events()
            this.checkSticky($(window).scrollTop(), this.defaultsOptions.headerWrapper)
        },
        events: function () {
            const $thisObj = this,
                options = $thisObj.defaultsOptions

            $(window).on('scroll', function (e) {
                let scrollTop = $(window).scrollTop();
                if (options.windowWidth < 1200) {

                    // console.log(scrollTop, options.lastScrollTop)
                    if (scrollTop < options.lastScrollTop && scrollTop != 0) {
                        if (!options.headerWrapper.hasClass('sticky'))
                            options.headerWrapper.addClass('sticky')
                    }
                    else {
                        if ((options.headerWrapper.hasClass('sticky') || scrollTop == 0)
                            && !$('.jquery-modal.blocker').length
                            && !options.headerWrapper.hasClass('open'))
                            options.headerWrapper.removeClass('sticky')
                    }
                    options.lastScrollTop = scrollTop
                }
                else {
                    $thisObj.checkSticky(scrollTop, options.headerWrapper)
                }
            })
            function MobHeaderInitial() {
                // console.log(options.windowWidth)
                if (options.windowWidth < 1200) {
                    if (!$('.header-mob-burger').length) {
                        const MobBurder = '<a href="javascript: void(0)" class="header-mob-burger"><span></span></a>',
                            MobNavWrapper = '<div class="header-nav-wrapper"></div>'
                        $(MobBurder).insertAfter('.header-bottom_others')
                        $(MobNavWrapper).prependTo('header')
                        $('.header-nav').prependTo('.header-nav-wrapper')
                    }
                }
                else {
                    // if ($('header.open').length) {
                    $('.header-logo').prependTo('.header-bottom .header-inner')
                    $('.header-nav').insertAfter('.header-bottom .header-logo')
                    $('header.open').removeClass('open')

                    // }
                    if ($('.header-mob-burger').length) {
                        $('.header-mob-burger').remove()
                        $('.header-nav-wrapper').remove()
                    }

                    $('.header-nav_link').removeClass('open')
                    $('.header-nav_columns-outer .column-title.open').removeClass('open')
                }
            }
            MobHeaderInitial()
            $(window).on('resize', function () {
                if (document.body.clientWidth != options.windowWidth) {
                    options.windowWidth = document.body.clientWidth
                    MobHeaderInitial()
                }

            })
            $('body').on('click', '.header-mob-burger', function (e) { // обработчик клика на иконку меню в адаптиве
                e.preventDefault()
                options.headerWrapper.toggleClass('open')
                if (options.headerWrapper.hasClass('open')) {
                    BlockScroll.open()
                    $('.header-nav-wrapper').slideDown({
                        duration: 500,
                        progress: function (obj, progress) {

                            if (!$(obj.elem).find('.header-top-mob').length) {
                                if (progress >= 0.1) {
                                    const headerTopMob = '<div class="header-top-mob flex-block"></div>'
                                    $(headerTopMob).prependTo(this)
                                    options.headerWrapper.find('.header-logo').appendTo('.header-top-mob')
                                    const MobBurder = '<a href="javascript: void(0)" class="header-mob-burger"><span></span></a>'
                                    $(MobBurder).appendTo('.header-top-mob')
                                    // options.headerWrapper.find('.header-mob-burger').appendTo('.header-top-mob')
                                }
                            }
                        },
                    })
                }
                else {
                    if (!$('.jquery-modal.blocker').length) BlockScroll.close()
                    $('.header-nav-wrapper').slideUp({
                        duration: 600,
                        progress: function (obj, progress) {
                            if (progress >= 0.8) {
                                const $this = $(this)
                                if ($this.find('.header-top-mob').length) {
                                    $this.find('.header-logo').insertBefore('.header-bottom_others')
                                    // $this.find('.header-mob-burger').insertAfter('.header-bottom_others')
                                    $this.find('.header-top-mob').remove()
                                }
                            }
                        },
                    })
                }
            })
            $('body').on('click', '.header-nav_link.with-bottom', function (e) {
                if (options.windowWidth < 1200) {
                    e.preventDefault()
                    $(this).toggleClass('open')
                    // $this.toggleClass('open')
                }
            })
            $('body').on('click', '.header-nav_columns-outer .column-title>a', function (e) {
                if (options.windowWidth < 1200) {
                    e.preventDefault()
                    $(this).closest('.column-title').toggleClass('open')
                }

            })
        }
    }

    if ($('header').length) {
        InitHeader.init({
            headerWrapper: $('header')
        })
    }
    // ------------------------------------


    // Функционал анимирования фона 
    const AnimateBg = {
        defaultsOptions: {
            animateElems: $('.index-page .bg-animate'),
            windowWidth: document.body.clientWidth,
            firstIndex: 0,
            lastScrollTop: $(window).scrollTop()
        },
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            this.events(options)
        },
        events: function (options) {

            const InstallBgColor = function (currentIndex, CurrentAnimateElem, direction) {  // функция установки цвета background body
                let BodyBgClass =
                    CurrentAnimateElem.hasClass('green-outer') ? 'green'
                        : CurrentAnimateElem.hasClass('violet-outer') ? 'violet'
                            : CurrentAnimateElem.hasClass('yellow-outer') ? 'yellow'
                                : CurrentAnimateElem.hasClass('blue-outer') ? 'blue'
                                    : CurrentAnimateElem.hasClass('orange-outer') ? 'orange' : ''
                CurrentAnimateElem.addClass('bg-animate-init')
                // console.log(BodyBgClass)
                if (currentIndex > 0 && direction == 'scroll-down') {
                    $(options.animateElems[currentIndex - 1]).removeClass('bg-animate-init')
                }

                if (currentIndex > 0 && direction == 'scroll-up')
                    $(options.animateElems[currentIndex + 1]).removeClass('bg-animate-init')
                $('body').attr('body-color', BodyBgClass)

            }

            let currentIndex,
                scrollTop = $(window).scrollTop()
            const LastAnimateBgElem = $(options.animateElems[options.animateElems.length - 1]),
                FirstAnimateBgElem = $(options.animateElems[0])

            let LastAnimateBgElemOffset, FirstAnimateBgElemOffset
            function UpdateFirtsLastBgElem() {  // Функция обновления контроля отступов для анимации фона
                LastAnimateBgElemOffset
                    = LastAnimateBgElem.offset().top
                    + LastAnimateBgElem.closest('section').innerHeight()
                FirstAnimateBgElemOffset = FirstAnimateBgElem.offset().top
            }
            UpdateFirtsLastBgElem()
            $(window).on('resize', function () {
                UpdateFirtsLastBgElem()
            })
            function UpdateCurrentIndex() { // функция установки изначального индекса для анимации фона до старта скрола
                //currentIndex
                $.each(options.animateElems, function (index, elem) {
                    const ScrollTopAndWindows = scrollTop + $(window).height()
                    // console.log($(elem).offset().top)
                    // console.log(scrollTop + $(window).height())
                    // console.log($(elem).offset().top + $(elem).closest('section').innerHeight())

                    if (ScrollTopAndWindows >= $(elem).offset().top
                        && ScrollTopAndWindows <= $(elem).offset().top + $(elem).closest('section').innerHeight()) {
                        // console.log(ScrollTopAndWindows)
                        // console.log($(elem).offset().top)
                        currentIndex = index
                    }
                })
                return currentIndex
            }
            // const $thisObj = this
            // console.log($(options.animateElems[currentIndex]).offset().top)

            currentIndex = $(window).scrollTop() + $(window).height() < FirstAnimateBgElemOffset
                ? 0
                : $(window).scrollTop() >= LastAnimateBgElem.offset().top
                    ? options.animateElems.length - 1
                    : UpdateCurrentIndex()
            // UpdateCurrentIndex()
            // console.log(currentIndex)
            // console.log(FirstAnimateBgElemOffset, LastAnimateBgElemOffset)



            $(window).on('scroll', function (e) {
                scrollTop = $(window).scrollTop();
                // console.log(scrollTop + $(window).height())

                const CurrentAnimateElem = $(options.animateElems[currentIndex])
                // console.log(CurrentAnimateElem)
                let CurrentAnimateElemOffset, CurrentContent
                if (scrollTop > options.lastScrollTop) {
                    // console.log('сколл вниз ' + currentIndex)
                    // console.log(currentIndex)

                    CurrentAnimateElemOffset = CurrentAnimateElem.offset().top + CurrentAnimateElem.innerHeight()
                    CurrentContent = CurrentAnimateElem.closest('.new-container')
                    // console.log('отступ ' + CurrentAnimateElem.offset().top)
                    if (scrollTop + $(window).height() >= CurrentAnimateElemOffset && !CurrentAnimateElem.hasClass('bg-animate-init')) {
                        // UpdateFirtsLastBgElem()
                        if (scrollTop + $(window).height() <= LastAnimateBgElemOffset) {
                            // console.log('вход в смену цвета вниз')
                            // if ($(options.animateElems[currentIndex + 1]).hasClass('bg-animate-init'))
                            //     $(options.animateElems[currentIndex + 1]).removeClass('bg-animate-init')
                            if (!$(options.animateElems[currentIndex + 1]).hasClass('bg-animate-init'))
                                InstallBgColor(currentIndex, CurrentAnimateElem, 'scroll-down')

                        }
                    }
                    if (scrollTop + $(window).height() >= (CurrentContent.offset().top + CurrentContent.innerHeight())
                        && currentIndex < options.animateElems.length - 1)
                        currentIndex++
                    if (currentIndex == options.animateElems.length - 1) {
                        UpdateFirtsLastBgElem()
                        if ((scrollTop + $(window).height()) >= LastAnimateBgElemOffset
                            && CurrentAnimateElem.hasClass('bg-animate-init')) {
                            // console.log('тут')
                            $('body').removeAttr('body-color')
                            CurrentAnimateElem.removeClass('bg-animate-init')

                        }
                    }
                }
                else {
                    // console.log('скорлл вверх ' + currentIndex)
                    CurrentContent = CurrentAnimateElem.closest('.new-container')
                    CurrentAnimateElemOffset = CurrentContent.offset().top + CurrentContent.innerHeight() / 2
                    if (scrollTop <= CurrentAnimateElemOffset
                        && !CurrentAnimateElem.hasClass('bg-animate-init') && scrollTop > FirstAnimateBgElemOffset) {
                        // console.log('смена цвета наверх')
                        if (!$(options.animateElems[currentIndex - 1]).hasClass('bg-animate-init'))
                            InstallBgColor(currentIndex, CurrentAnimateElem, 'scroll-up')

                    }
                    if (currentIndex > 0 && scrollTop <= CurrentContent.offset().top)
                        currentIndex--
                    if (currentIndex == 0) {
                        if (scrollTop < (FirstAnimateBgElemOffset + FirstAnimateBgElem.closest('.new-container').innerHeight() / 2)
                            && scrollTop >= FirstAnimateBgElemOffset)
                            InstallBgColor(currentIndex, CurrentAnimateElem, 'scroll-up')
                        if (scrollTop <= (FirstAnimateBgElemOffset + FirstAnimateBgElem.closest('.new-container').innerHeight() / 2)) {
                            // console.log('смена с фиолетового')
                            $(options.animateElems[currentIndex + 1]).removeClass('bg-animate-init')
                            // console.log(scrollTop, CurrentAnimateElemOffset)
                        }

                        if (scrollTop <= (FirstAnimateBgElemOffset - $(window).height())
                            && CurrentAnimateElem.hasClass('bg-animate-init')) {
                            $('body').removeAttr('body-color')
                            CurrentAnimateElem.removeClass('bg-animate-init')
                        }
                    }

                }
                options.lastScrollTop = scrollTop

            })
        }
    }

    if ($('.index-page .bg-animate').length) {
        AnimateBg.init({
            animateElems: $('.index-page .bg-animate')
        })
    }
    // ------------------------------------


    // Инициализация верхнего слайдера на главной странице 
    const InitSliderTop = {
        defaultsOptions: {
            slidesVisible: 1,
            AutoPlay: 5000,
            windowWidth: document.body.clientWidth
        },
        init: function (options) {
            const $thisObj = this
            var options = $.extend(this.defaultsOptions, options)
            //console.log(options)
            const sliderContainer = options.sliderWrapper
            let swiper = new Swiper(sliderContainer, {
                slidesPerView: options.slidesVisible,
                // grabCursor: true,
                // spaceBetween: options.SpaceBetweenPx,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                allowTouchMove: false,
                // loop: true,
                autoplay: {
                    delay: options.AutoPlay,
                },
                effect: 'fade',
                fadeEffect: {
                    crossFade: true,
                },
            })
        },
    }

    if ($('.top-section .slider').length) {
        $.each($('.top-section .slider'), function () {
            InitSliderTop.init({
                sliderWrapper: $(this)
            })
        })
    }
    //------------------------------------


    //Инициализация слайдера экскурсий, событий, что посмотреть
    const InitSliderOther = {
        defaultsOptions: {
            slidesVisible: 1,
            // SpaceBetweenPx: 70,
            // AutoPlay: 5000,
            windowWidth: document.body.clientWidth
        },
        checkSlider: function (sliderElem, options) {
            // console.log(sliderElem, options.windowWidth)
            const SliderContainer = sliderElem.$el,
                SliderEl = sliderElem.el,
                SliderWrapper = SliderContainer.closest('.slider-wrapper')
            // console.log(SliderContainer)
            if (SliderContainer.hasClass('slider-container-excursions')
                || SliderContainer.hasClass('slider-container-events')) {
                if (options.windowWidth < 1200) {
                    // console.log(!SliderWrapper.children('.slider-slide_item').length)
                    if (!SliderWrapper.children('.slider-slide_item').length) {
                        // console.log('перенос')
                        $(SliderContainer).find('.swiper-slide:first-child .slider-slide .slider-slide_item:first-child').prependTo(SliderWrapper)
                    }
                    // const $thisObj = this
                    // console.log(options)
                    setTimeout(function () {
                        sliderElem.update()
                    }, 300);

                }
                else {
                    if (SliderWrapper.children('.slider-slide_item').length) {
                        $(SliderWrapper).children('.slider-slide_item').prependTo(SliderContainer.find('.swiper-slide:first-child .slider-slide'))
                        setTimeout(function () {
                            sliderElem.update()
                        }, 300);
                    }
                }
                // sliderElem.update()
            }

        },
        init: function (options) {
            // console.log('вход')
            const $thisObj = this
            var options = $.extend(this.defaultsOptions, options)
            // console.log(options)
            const sliderContainer = options.sliderWrapper,
                BtnNavigation = sliderContainer.siblings('.slider-navigation'),
                BtnNavigationPrev = BtnNavigation.find('.slider-btn-prev'),
                BtnNavigationNext = BtnNavigation.find('.slider-btn-next')
            // console.log(sliderContainer)
            let swiper = new Swiper(sliderContainer, {
                slidesPerView: options.slidesVisible,
                // grabCursor: true,
                setWrapperSize: true,
                // spaceBetween: options.SpaceBetweenPx,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                updateOnWindowResize: false,
                speed: 800,
                navigation: {
                    nextEl: BtnNavigationNext,
                    prevEl: BtnNavigationPrev,
                    disabledClass: "disabled",
                },
                // loop: true,
                breakpoints: {
                    1199: {
                        slidesPerView: 'auto',
                        spaceBetween: 20,
                        freeMode: true,
                    },
                },
                on: {
                    init: function () {
                        const $this = this
                        $thisObj.checkSlider($this, options)
                    },
                    resize: function () { // новое ../02.2024
                        const $this = this
                        options.windowWidth = document.body.clientWidth
                        $thisObj.checkSlider($this, options)
                    }
                },
            })
        },
    }


    if ($('.index-page .slider-container-excursions').length) {
        $.each($('.slider-container-excursions'), function () {
            InitSliderOther.init({
                sliderWrapper: $(this)
            })
        })
    }
    if ($('.index-page .slider-container-events').length) {
        $.each($('.slider-container-events'), function () {
            InitSliderOther.init({
                sliderWrapper: $(this)
            })
        })
    }

    if ($('.index-page .slider-container-views').length) {
        $.each($('.slider-container-views'), function () {
            InitSliderOther.init({
                sliderWrapper: $(this)
            })
        })
    }
    //------------------------------------


    //Инициализация слайдера дат
    const InitSliderDates = {
        defaultsOptions: {
            slidesVisible: 'auto',
            SpaceBetweenPx: 42,
        },
        init: function (options) {
            // const $thisObj = this
            var options = $.extend(this.defaultsOptions, options)
            //console.log(options)
            const sliderContainer = options.sliderWrapper,
                BtnNavigation = sliderContainer.siblings('.slider-navigation'),
                BtnNavigationPrev = BtnNavigation.find('.slider-btn-prev'),
                BtnNavigationNext = BtnNavigation.find('.slider-btn-next')
            let swiper = new Swiper(sliderContainer, {
                slidesPerView: options.slidesVisible,
                freeMode: true,
                mousewheel: true,
                grabCursor: true,
                spaceBetween: options.SpaceBetweenPx,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                speed: 800,
                navigation: {
                    nextEl: BtnNavigationNext,
                    prevEl: BtnNavigationPrev,
                    disabledClass: "disabled",
                },
                // loop: true,
            })
        },
    }

    if ($('.slider-date-container').length) {
        $.each($('.slider-date-container'), function () {
            InitSliderDates.init({
                sliderWrapper: $(this)
            })
        })
    }
    //------------------------------------

    // Инициализация custom-select
    const InitSelect2 = {
        defaultsOptions: {
            selects: $('.custom-select')
        },
        init: function (options) {
            var options = $.extend(this.defaultsOptions, options)
            // console.log(options)
            $.each(options.selects, function () {
                const $this = $(this)
                if ($this.hasClass('custom-select-search')) {
                    $this.select2({
                        minimumResultsForSearch: 0,
                        // debug: true,
                        // closeOnSelect: false,
                        theme: "custom-select select-search",
                        language: {
                            inputTooShort: function () {
                                return "Выберите больше опций...";
                            },
                            noResults: function () {
                                return "Ничего не найдено";
                            },
                            searching: function () {
                                return "Поиск...";
                            },
                            removeAllItems: function () {
                                return "Удалить всё";
                            },
                        },
                    });
                }
                else {
                    $this.select2({
                        minimumResultsForSearch: Infinity,
                        theme: "custom-select",
                        language: "ru",
                        width: 'style',
                    });
                }

            })
            // this.events(options.selects)
        },
    }

    if ($('.custom-select').length) {
        InitSelect2.init({
            selects: $('.custom-select')
        })
    }
    //------------------------------------


    // Обработчик клика на теги
    $('body').on('click', '.tag-elem:not(.active)', function (e) {
        // e.preventDefault();
        const $this = $(this)
        $this.siblings('.active').removeClass('active')
        $this.addClass('active')
    })
    //------------------------------------



    // Инициализация слайдера бегущей строки официальных новостей
    const InitRunningLineNews = {
        defaultsOptions: {
            slidesVisible: 'auto',
            SpaceBetweenPx: 20,
            // speedLine: 10000,
            // AutoPlay: 5000,
            // windowWidth: document.body.clientWidth
        },
        renderSizeSlides: function (sliderContainer) {
            const slides = sliderContainer.find('.news-slider-slide')
            slides.css({ 'min-height': '' })
            let MaxItemHeight = 0
            $.each(slides, function () {
                if ($(this).innerHeight() >= MaxItemHeight) {
                    MaxItemHeight = $(this).innerHeight()
                }
            })
            // console.log(MaxItemHeight)
            slides.css({ 'min-height': MaxItemHeight + 'px' })

        },
        init: function (options) {
            const $thisObj = this
            var options = $.extend(this.defaultsOptions, options)
            //console.log(options)
            const sliderContainer = options.sliderWrapper
            let swiper = new Swiper(sliderContainer, {
                slidesPerView: options.slidesVisible,
                // grabCursor: true,
                speed: options.speedLine,
                spaceBetween: options.SpaceBetweenPx,
                freeMode: true,
                // mousewheel: true,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                // allowTouchMove: false,
                loop: true,
                autoplay: {
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                on: {
                    init: function () {
                        const $this = this
                        setTimeout(function () {
                            $thisObj.renderSizeSlides(sliderContainer)
                            // console.log('update')
                            $this.update()
                        }, 30);
                    },
                    resize: function () {
                        const $this = this
                        setTimeout(function () {
                            $thisObj.renderSizeSlides(sliderContainer)
                            // console.log('update')
                            $this.update()
                        }, 30);
                    }
                },
            })
        },
    }

    if ($('.news-slider-container').length) {
        $.each($('.news-slider-container'), function () {
            InitRunningLineNews.init({
                sliderWrapper: $(this),
                speedLine: parseInt($(this).attr('line-speed'))
            })
        })
    }
    //------------------------------------


    // Инициализация слайдеров бегущих строк в футере
    const InitRunningLinePartners = {
        defaultsOptions: {
            slidesVisible: 'auto',
            SpaceBetweenPx: 10,
            // reverseDirectionInit: false,
            // speedLine: 10000,
            // AutoPlay: 5000,
            // windowWidth: document.body.clientWidth
        },
        init: function (options) {

            const $thisObj = this
            var options = $.extend(this.defaultsOptions, options)
            const sliderContainer = options.sliderWrapper,
                ReverseState = (options.reverse === 'true') ? true : false
            let swiper = new Swiper(sliderContainer, {
                slidesPerView: options.slidesVisible,
                // grabCursor: true,
                speed: options.speedLine,
                spaceBetween: options.SpaceBetweenPx,
                // reverseDirection: reverse,
                freeMode: true,
                // mousewheel: true,
                watchOverflow: true,
                watchSlidesVisibility: true,
                touchReleaseOnEdges: true,
                allowTouchMove: false,
                // observer: true,
                // observeParents: true,
                loop: true,
                autoplay: {
                    delay: 0,
                    reverseDirection: ReverseState,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                },
                // breakpoints: {
                //     1199: {
                //         spaceBetween: 10,
                //     },
                // },
                // on: {
                //     resize: function () {
                //         const $this = this
                //         setTimeout(function () {
                //             // console.log('update')
                //             $this.update()
                //         }, 30);
                //     }
                // },

            })

        },

    }

    if ($('.slider-footer-container').length) {
        $.each($('.slider-footer-container'), function () {
            InitRunningLinePartners.init({
                sliderWrapper: $(this),
                speedLine: parseInt($(this).attr('line-speed')),
                reverse: $(this).attr('reverse')
            })
        })
    }
    //------------------------------------


    // Инициализации галереи
    const Gallery = {
        optionsDefault: {
            GalleryWrapper: $('.inner-detail-gallery')
        },
        init: function (options) {
            var options = $.extend(this.optionsDefault, options)
            /* LightGallery */
            // console.log(options)
            options.GalleryWrapper.lightGallery({
                selector: '.lightgallery-item',
                share: false,
                videojs: false,
                autoplayFirstVideo: false,
                download: false,
                thumbnail: false,
            });

        }
        //----------------------//
    }
    if ($('.inner-detail .inner-detail-gallery').length) {
        Gallery.init()
    }
    //------------------------------------


    CheckLastNews()



}) // finish document ready


// Функцию перемещения первой новости в адаптиве
function CheckLastNews() {
    const docWidth = document.body.clientWidth,
        LastNewsItems = $('.last-news-items'),
        closestOuter = LastNewsItems.siblings('.orange-outer')
    // console.log(closestOuter)
    // console.log(LastNewsItems)
    if (docWidth < 1200) {
        if (!closestOuter.next('.last-news-item').length) {
            LastNewsItems.children('.last-news-item:first-child').insertAfter(closestOuter)
        }
    }
    else {
        if (closestOuter.next('.last-news-item').length) {
            closestOuter.next('.last-news-item').prependTo(LastNewsItems)
        }
    }
    // console.log(docWidth)
}
//------------------------------------


$(window).on('resize', function () {
    CheckLastNews()
    if ($('.inner-page .bg-wrapper').length)
        HeaderPadding()
    // console.log()
})

// Функционал отступа от header на всех страницах кроме главной
function HeaderPadding() {
    const Header = $('header'),
        HeaderTop = Header.find('.header-top'),
        HeaderBottom = Header.find('.header-bottom'),
        HeaderHeight = HeaderTop.outerHeight(true) + HeaderBottom.outerHeight(true)
    $('main').css('padding-top', HeaderHeight)

}


function ContentLoad() {
    // alert('DOM готов');
}

document.addEventListener("DOMContentLoaded", ContentLoad)
