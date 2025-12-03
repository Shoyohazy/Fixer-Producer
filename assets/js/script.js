Promise.all([
fetch("./header.html").then(res => res.text()),
fetch("./footer.html").then(res => res.text()),
fetch("./sidebar.html").then(res => res.text())
])
.then(([headerHTML, footerHTML, sidebarHTML]) => {
$("#header").html(headerHTML);
$("#footer").html(footerHTML);
$("#sidebar").html(sidebarHTML);
})
.then(() => {
loadYouTubeAPI();
initProjectHeading();
initNavLink();
initSidebar();
initSidebarDropdown();
initCounter();
initCustomDropdown();
initSubmitContact();
initSubmitNewsletter();
});

// ===============================================
// 🔹 1. Load YT API sekali saja
// ===============================================
function loadYouTubeAPI() {
    if (!window.YT && !document.querySelector("script[src*='youtube.com/iframe_api']")) {
	const tag = document.createElement("script");
	tag.src = "https://www.youtube.com/iframe_api";
	document.head.appendChild(tag);
}
}

// ===============================================
// 🔹 2. Callback tunggal untuk semua video
// ===============================================
window.onYouTubeIframeAPIReady = function() {
    initBannerVideo();
    initTestimonialBannerVideo();
    initProjectVideoBackgrounds();
    initServiceVideoBackground();
    initCtaHighlightVideo();
};

// ===============================================
// 🔹 3. Banner Video
// ===============================================
function initBannerVideo() {
    if (!document.getElementById("banner-video-background")) return;

    const player = new YT.Player("banner-video-background", {
        videoId: "pVA0G01aDfk",
        playerVars: {
            autoplay: 1,
            controls: 0,
            mute: 1,
            loop: 1,
            playlist: "pVA0G01aDfk",
            showinfo: 0,
            rel: 0,
            enablejsapi: 1,
            disablekb: 1,
            modestbranding: 1,
            iv_load_policy: 3,
            origin: window.location.origin
        },
        events: {
            onReady: (e) => {
                e.target.playVideo();
            },
            onStateChange: (e) => {
                if (e.data === YT.PlayerState.ENDED) e.target.playVideo();
            }
        }
    });
}


// ===============================================
// 🔹 4. Testimonial Banner Video
// ===============================================
function initTestimonialBannerVideo() {
if (!document.getElementById("testimonial-video-background")) return;

const player = new YT.Player("testimonial-video-background", {
	videoId: "6J1XlyCxtPw",
	playerVars: {
	autoplay: 1,
	controls: 0,
	mute: 1,
	loop: 1,
	playlist: "6J1XlyCxtPw",
	showinfo: 0,
	rel: 0,
	modestbranding: 1,
	iv_load_policy: 3
	},
	events: {
	onReady: (e) => {
		e.target.playVideo();
	},
	onStateChange: (e) => {
		if (e.data === YT.PlayerState.ENDED) e.target.playVideo();
	}
	}
});
}

// ===============================================
// 🔹 5. Project Video Backgrounds (multiple)
// ===============================================
function initProjectVideoBackgrounds() {
    const videoEls = document.querySelectorAll(".project-video-bg");
    if (!videoEls.length) return;

    videoEls.forEach((el) => {
        const videoId = el.dataset.videoId;
        new YT.Player(el.id, {
        videoId,
        playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            loop: 1,
            playlist: videoId,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            playsinline: 1
        },
        events: {
            onReady: (e) => {
            e.target.mute();
            e.target.playVideo();
            }
        }
        });
    });
}

// ===============================================
// 🔹 6. Service Video Backgrounds (multiple)
// ===============================================
function initServiceVideoBackground() {
    const videoEls = document.querySelectorAll(".service-video-bg");
    if (!videoEls.length) return;

    videoEls.forEach((el, index) => {

        // Jika tidak ada ID → generate otomatis
        if (!el.id) el.id = "service-video-" + index;

        // Ambil atribut
        const videoId = el.dataset.videoId;
        const start = parseFloat(el.dataset.start) || 0;
        const end = parseFloat(el.dataset.end) || 0;

        // Buat player
        const player = new YT.Player(el.id, {
            videoId,
            playerVars: {
                autoplay: 1,
                mute: 1,
                controls: 0,
                playsinline: 1,
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
                start: start,
                end: end
            },
            events: {
                onReady: (e) => {
                    e.target.mute();
                    e.target.seekTo(start);
                    e.target.playVideo();
                },
                onStateChange: (e) => {
                    // Jika video mencapai end → ulang ke start
                    if (end > 0 && e.data === YT.PlayerState.ENDED) {
                        e.target.seekTo(start);
                        e.target.playVideo();
                    }
                }
            }
        });

        // Simpan instance agar bisa dipause/play saat accordion berubah
        el.ytplayer = player;
    });
}

// =======================================================
//  SUPPORT: Pause saat accordion ditutup, play saat dibuka
// =======================================================
document.addEventListener("shown.bs.collapse", function (e) {
    const container = e.target.querySelector(".service-video-bg");
    if (container?.ytplayer) {
        container.ytplayer.playVideo();
    }
});

document.addEventListener("hidden.bs.collapse", function (e) {
    const container = e.target.querySelector(".service-video-bg");
    if (container?.ytplayer) {
        container.ytplayer.pauseVideo();
    }
});

// ===============================================
// 🔹 7. Utility — Resize video container
// ===============================================
function resizeVideo(containerSelector, playerInstance) {
const container = document.querySelector(containerSelector);
if (!container || !playerInstance) return;

const aspect = 16 / 9;
const width = container.offsetWidth;
const height = container.offsetHeight;
let newWidth, newHeight;

if (width / height > aspect) {
	newWidth = width;
	newHeight = width / aspect;
} else {
	newWidth = height * aspect;
	newHeight = height;
}

const iframe = playerInstance.getIframe();
iframe.width = newWidth;
iframe.height = newHeight;
}

// ===============================================
// 🔹 8. CTA Highlight Video (multiple)
// ===============================================
function initCtaHighlightVideo() {
    const videoEls = document.querySelectorAll(".cta-highlight-video");
    if (!videoEls.length) return;

    videoEls.forEach((el, index) => {

        // Generate ID kalau tidak ada
        if (!el.id) el.id = "cta-highlight-video-" + index;

        const videoId = el.dataset.videoId;
        const start = parseFloat(el.dataset.start) || 0;
        const end = parseFloat(el.dataset.end) || 0;

        const player = new YT.Player(el.id, {
            videoId,
            playerVars: {
                autoplay: 1,
                mute: 1,
                controls: 0,
                playsinline: 1,
                modestbranding: 1,
                rel: 0,
                iv_load_policy: 3,
                start: start,
                end: end,
                loop: end === 0 ? 1 : 0,   // auto-loop jika tidak pakai end time
                playlist: videoId
            },
            events: {
                onReady: (e) => {
                    e.target.mute();
                    e.target.seekTo(start);
                    e.target.playVideo();
                },
                onStateChange: (e) => {
                    if (end > 0 && e.data === YT.PlayerState.ENDED) {
                        e.target.seekTo(start);
                        e.target.playVideo();
                    }
                }
            }
        });

        el.ytplayer = player;
    });
}

// ===============================================
// 🔹 9. Heading Project Animations
// ===============================================

function initProjectHeading() {
const $section = $('.section-project');
const $heading = $('.project-section-heading');

if ($section.length === 0 || $heading.length === 0) return;

$(window).on('scroll', function () {
	const viewportHeight = $(window).height();
	const sectionTop = $section.offset().top;
	const sectionHeight = $section.outerHeight();
	const scrollTop = $(window).scrollTop();
	const sectionBottom = sectionTop + sectionHeight;

	// Fade-out lebih cepat
	const fadeStart = sectionBottom - viewportHeight * 0.8;
	const fadeEnd = sectionBottom - viewportHeight * 0.5;

	if (scrollTop > fadeStart && scrollTop < fadeEnd) {
	const progress = (scrollTop - fadeStart) / (fadeEnd - fadeStart);
	const opacity = Math.max(0, 1 - progress);

	$heading.css({ opacity });
	} else if (scrollTop >= fadeEnd) {
	$heading.css({ opacity: 0 });
	} else {
	$heading.css({ opacity: 1 });
	}
});
}

// ===============================================
// 🔹 10. Sidebar
// ===============================================

function initSidebar() {
    const $menuBtn = $('.nav-btn');
    const $closeBtn = $('.close-btn');
    const $overlay = $('.sidebar-overlay');
    const $sidebar = $('.sidebar');
  
    $menuBtn.click(function() {
      $overlay.addClass('active');
      setTimeout(() => {
        $sidebar.addClass('active');
      }, 200);
    });
  
    $closeBtn.click(function() {
      $sidebar.removeClass('active');
      setTimeout(() => {
        $overlay.removeClass('active');
      }, 200);
    });
  
    $overlay.click(function() {
      $sidebar.removeClass('active');
      setTimeout(() => {
        $overlay.removeClass('active');
      }, 200);
    });
}

function initSidebarDropdown() {
    const $dropdownButtons = $(".sidebar-dropdown-btn");

    $dropdownButtons.each(function() {
        $(this).on("click", function() {
            const $dropdownMenu = $(this).parent().next(".sidebar-dropdown-menu");
            const isOpen = $dropdownMenu.hasClass("active");

            $(".sidebar-dropdown-menu").not($dropdownMenu).removeClass("active");

            $dropdownMenu.toggleClass("active", !isOpen);
        });
    });
}

// ===============================================
// 🔹 11. Counter Animation
// ===============================================

function initCounter() {
    var $counters = $(".counter");

    function formatCount(num) {
        if (num >= 1_000_000) 
            return (num / 1_000_000).toFixed(num % 1_000_000 === 0 ? 0 : 1) + "M";
        if (num >= 1_000) 
            return (num / 1_000).toFixed(num % 1_000 === 0 ? 0 : 1) + "K";
        return num;
    }

    function updateCount($counter) {
        var target = $counter.data("target");
        var current = $counter.data("current") || 0;

        var duration = 1500;
        var steps = 30;
        var increment = Math.max(1, Math.ceil(target / steps));

        var nextCount = Math.min(target, current + increment);
        $counter.data("current", nextCount);

        $counter.text(formatCount(nextCount));

        if (nextCount < target) {
            setTimeout(function () {
                updateCount($counter);
            }, duration / steps);
        }
    }

    var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting && !$(entry.target).data("counted")) {
                var $counter = $(entry.target);
                $counter.data("counted", true);
                updateCount($counter);
            }
        });
    }, { threshold: 0.5 });

    $counters.each(function () {
        var $counter = $(this);

        $counter.data("counted", false);
        $counter.data("current", 0);

        observer.observe(this);
    });
}

// ===============================================
// 🔹 12. Nav Link
// ===============================================

function initNavLink() {
    const currentUrl = window.location.href;
    $(".navbar-nav .nav-link").each(function() {
        if (this.href === currentUrl) {
            $(this).addClass("active");
        }
    });
    $(".navbar-nav .dropdown-menu .dropdown-item").each(function() {
        if (this.href === currentUrl) {
            $(this).addClass("active");
            $(this).closest(".dropdown").find(".nav-link.dropdown-toggle").addClass("active");
        }
    });
}

// ===============================================
// 🔹 5. Custom Dropdown
// ===============================================

function initCustomDropdown() {
    $('.dropdown-select').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const $container = $(this).closest('.dropdown-container');
        const $caretIcon = $(this).find('.fa-caret-down');
        $('.dropdown-container').not($container).removeClass('active');
        $('.fa-caret-down').not($caretIcon).removeClass('rotate');
        $container.toggleClass('active');
        $caretIcon.toggleClass('rotate');
    });

    $('.dropdown-option').on('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        const $option = $(this);
        const $container = $option.closest('.dropdown-container');
        const $selectedText = $container.find('.selected-text');
        const $hiddenInput = $container.find('.dropdown-value');
        const $allOptions = $container.find('.dropdown-option');
        const selectedValue = $option.data('value');
        const selectedText = $option.text().trim();
        $selectedText.text(selectedText);
        $selectedText.addClass('has-value');
        $hiddenInput.val(selectedValue);
        $allOptions.removeClass('selected');
        $option.addClass('selected');
        $container.removeClass('active');
        $container.find('.fa-caret-down').removeClass('rotate');
        $hiddenInput.trigger('change');
        console.log('Selected:', selectedValue, selectedText);
    });

    $(document).on('click', function(e) {
        if (!$(e.target).closest('.dropdown-container').length) {
            $('.dropdown-container').removeClass('active');
            $('.fa-caret-down').removeClass('rotate');
        }
    });

    $('.dropdown-select').on('keydown', function(e) {
        const $container = $(this).closest('.dropdown-container');
        switch(e.key) {
            case 'Enter':
            case ' ':
                e.preventDefault();
                $(this).click();
                break;
            case 'Escape':
                $container.removeClass('active');
                $container.find('.fa-caret-down').removeClass('rotate');
                break;
            case 'ArrowDown':
            case 'ArrowUp':
                e.preventDefault();
                if (!$container.hasClass('active')) {
                    $container.addClass('active');
                    $container.find('.fa-caret-down').addClass('rotate');
                }
                const $options = $container.find('.dropdown-option');
                const $focused = $options.filter(':focus');
                let nextIndex;
                if ($focused.length === 0) {
                    nextIndex = e.key === 'ArrowDown' ? 0 : $options.length - 1;
                } else {
                    const currentIndex = $options.index($focused);
                    if (e.key === 'ArrowDown') {
                        nextIndex = currentIndex + 1 >= $options.length ? 0 : currentIndex + 1;
                    } else {
                        nextIndex = currentIndex - 1 < 0 ? $options.length - 1 : currentIndex - 1;
                    }
                }
                $options.eq(nextIndex).focus();
                break;
        }
    });

    $('.dropdown-option').attr('tabindex', '0');

    $('.dropdown-option').on('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            $(this).click();
        }
    });

    window.resetDropdown = function(containerId) {
        const $container = $('#' + containerId);
        if ($container.length) {
            $container.find('.selected-text').text('Project Type').removeClass('has-value');
            $container.find('.dropdown-value').val('');
            $container.find('.dropdown-option').removeClass('selected');
            $container.removeClass('active');
            $container.find('.fa-caret-down').removeClass('rotate');
        }
    };

    window.getDropdownValue = function(containerId) {
        const $container = $('#' + containerId);
        return $container.find('.dropdown-value').val();
    };

    window.setDropdownValue = function(containerId, value) {
        const $container = $('#' + containerId);
        const $option = $container.find('.dropdown-option[data-value="' + value + '"]');
        if ($option.length) {
            $option.click();
        }
    };
}