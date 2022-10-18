(function ($) {
  "use strict";

  // Spinner
  var spinner = function () {
    setTimeout(function () {
      if ($('#spinner').length > 0) {
        $('#spinner').removeClass('show');
      }
    }, 1);
  };
  spinner();


  // Initiate the wowjs
  new WOW().init();


  // Sticky Navbar
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.sticky-top').addClass('shadow-sm').css('top', '0px');
    } else {
      $('.sticky-top').removeClass('shadow-sm').css('top', '-100px');
    }
  });


  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 300) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });
  $('.back-to-top').click(function () {
    $('html, body').animate({ scrollTop: 0 }, 1500, 'easeInOutExpo');
    return false;
  });


  // Facts counter
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 2000
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
      '<i class="bi bi-chevron-right"></i>'
    ]
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
      '<i class="bi bi-arrow-right"></i>'
    ],
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      }
    }
  });


  // Modal Video
  var $videoSrc;
  $('.btn-play').click(function () {
    $videoSrc = $(this).data("src");
  });
  console.log($videoSrc);
  $('#videoModal').on('shown.bs.modal', function (e) {
    $("#video").attr('src', $videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0");
  })
  $('#videoModal').on('hide.bs.modal', function (e) {
    $("#video").attr('src', $videoSrc);
  })

  const tel = document.getElementById('telefone-indicante')
  tel.addEventListener('input', (e) => phoneMaskIndicate(e.target.value))
  const phoneMaskIndicate = (valor) => {
    const valueOnlyNumbers = valor.replace(/\D/g, '');
    tel.value = valueOnlyNumbers;
    const valueWithMask = (`(${valueOnlyNumbers.substring(0, 2)}) ${valueOnlyNumbers.substring(2, 7)}-${valueOnlyNumbers.substring(7, 11)}`);
    console.log(valueWithMask.length);
    tel.value = valueWithMask;
    const ted = document.getElementsByClassName('form-check-inline');
    console.log(ted.value);
  }

  // const telIndicated = document.getElementById('telefone-indicanted')
  // telIndicated.addEventListener('input', (e) => phoneMaskIndicated(e.target.value))
  // const phoneMaskIndicated = (valor) => {
  //   const valueOnlyNumbers = valor.replace(/\D/g, '');
  //   telIndicated.value = valueOnlyNumbers;
  //   const valueWithMask = (`(${valueOnlyNumbers.substring(0,2)}) ${valueOnlyNumbers.substring(2,7)}-${valueOnlyNumbers.substring(7,11)}`);
  //   telIndicated.value = valueWithMask;
  // }

  const ted = document.getElementsByClassName('form-check-inline');
  console.log(ted.value);

})(jQuery);
