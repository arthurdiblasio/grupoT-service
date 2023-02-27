(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($("#spinner").length > 0) {
        $("#spinner").removeClass("show");
      }
    }, 1);
  };
  spinner();

  // Initiate the wowjs
  new WOW().init();

  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".sticky-top").addClass("shadow-sm").css("top", "0px");
    } else {
      $(".sticky-top").removeClass("shadow-sm").css("top", "-100px");
    }
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $(".back-to-top").fadeIn("slow");
    } else {
      $(".back-to-top").fadeOut("slow");
    }
  });
  $(".back-to-top").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 1500, "easeInOutExpo");
    return false;
  });

  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000,
  });

  // Header carousel
  $(".header-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    items: 1,
    dots: true,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-chevron-left"></i>',
      '<i class="bi bi-chevron-right"></i>',
    ],
  });

  // Testimonials carousel
  $(".testimonial-carousel").owlCarousel({
    autoplay: true,
    smartSpeed: 1000,
    center: true,
    dots: false,
    loop: true,
    nav: true,
    navText: [
      '<i class="bi bi-arrow-left"></i>',
      '<i class="bi bi-arrow-right"></i>',
    ],
    responsive: {
      0: {
        items: 1,
      },
      768: {
        items: 2,
      },
    },
  });

  // Modal Video
  var $videoSrc;
  $(".btn-play").click(function () {
    $videoSrc = $(this).data("src");
  });
  console.log($videoSrc);
  $("#videoModal").on("shown.bs.modal", function (e) {
    $("#video").attr(
      "src",
      $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0"
    );
  });
  $("#videoModal").on("hide.bs.modal", function (e) {
    $("#video").attr("src", $videoSrc);
  });
})(jQuery);

function getServices() {
  const SERVICES = ["Mecânico", "Seguro", "Festa"];
  const servicesSelect = document.getElementById("service-select");
  SERVICES.forEach((language) => {
    option = new Option(language, language);
    servicesSelect.options[servicesSelect.options.length] = option;
  });
}

function get(url) {
  let request = new XMLHttpRequest();
  request.open("GET", url, false);
  request.send();
  return JSON.parse(request.responseText);
}

async function getBanks() {
  const banks = await get("https://brasilapi.com.br/api/banks/v1");
  console.log(banks);
  const banksOrdenedByCodeDesc = banks.sort((a, b) => {
    return a.code > b.code ? 1 : -1;
  });
  const BANKSFORMATTED = banksOrdenedByCodeDesc
    .filter((bank) => bank.code)
    .map((bank) => {
      return `${bank.code} - ${bank.fullName}`;
    });

  const bankSelect = document.getElementById("bank");
  BANKSFORMATTED.forEach((language) => {
    option = new Option(language, language);
    bankSelect.options[bankSelect.options.length] = option;
  });
}

let string =
  "Já pensou em ganhar dinheiro indicando?"; /* type your text here */
let array = string.split("");
let timer;
let writeDisplay = true;

function frameLooper() {
  if (array.length > 0 && writeDisplay) {
    document.getElementById("text-video").innerHTML += array.shift();
    // } else if (array.length === 0 && writeDisplay ) {
    //   writeDisplay = false;
    // } else if (!writeDisplay) {
    //   let text = document.getElementById("text-video").innerHTML;
    //   text = text.substring(0, text.length - 1);
    //   document.getElementById("text-video").innerText = text;
    //   if (text.length === 0) {
    //     writeDisplay = true
    //     array = string.split("");
    //   }
    // }
    loopTimer = setTimeout("frameLooper()", 70); /* change 70 for speed */
  } else {
    writeDisplay = false;
    clearTimeout(timer);
    // blinkText();
  }
}
function blinkText() {
  let count = 0;
  const interval = setInterval(() => {
    const element = document.getElementById("text-video");
    element.classList.length === 4 ? element.classList.remove("hide") : element.classList.add("hide");
    count++;
    if (count === 4) {
      clearInterval(interval);
    }
  }, 500);
}
frameLooper();

getBanks();
getServices();
