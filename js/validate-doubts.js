
(function () {
  "use strict";

  let formsDoubts = document.querySelectorAll('.php-email-form-doubts');

  formsDoubts.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute('action');
      let recaptcha = thisForm.getAttribute('data-recaptcha-site-key');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!')
        return;
      }
      thisForm.querySelector('.loading').classList.add('d-block');
      thisForm.querySelector('.error-message').classList.remove('d-block');
      thisForm.querySelector('.sent-message').classList.remove('d-block');

      let formData = new FormData(thisForm);

      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha.execute(recaptcha, { action: 'email_form_submit' })
                .then(token => {
                  formData.set('recaptcha-response', token);
                  email_form_submit(thisForm, action, formData);
                })
            } catch (error) {
              displayError(thisForm, error)
            }
          });
        } else {
          displayError(thisForm, 'The reCaptcha javascript API url is not loaded!');
        }
      } else if (formInvalidDoubts(thisForm)) {
        return;
      } else {
        email_form_submit(thisForm, action, formData);
      }
    });
  });

  function formInvalidDoubts(thisForm) {
    let message = '';
    const phone = getById('phone');
    phone.classList.remove('error-form');
    if (phone.value.length != 15) {
      phone.classList.add('error-form');
      message += 'Telefone inválido! <br>';
    }

    if (message) {
      displayError(thisForm, message);
      return true;
    }
  }


  function email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: 'POST',
      body: formData,
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })
      .then(response => {
        if (response.ok) {
          return response.status
        } else {
          throw new Error(`${response.status} ${response.statusText} ${response.url}`);
        }
      })
      .then(status => {
        thisForm.querySelector('.loading').classList.remove('d-block');
        if (status === 200) {
          thisForm.querySelector('.sent-message').classList.add('d-block');
          thisForm.reset();
        } else {
          throw new Error(data ? data : 'Form submission failed and no error message returned from: ' + action);
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    if (!error.ok || error.ok !== 'true') {
      thisForm.querySelector('.loading').classList.remove('d-block');
      thisForm.querySelector('.error-message').innerHTML = error;
      thisForm.querySelector('.error-message').classList.add('d-block');
    }
  }

  /* Máscaras ER */
  function getInputMask(o, f) {
    const v_obj = o;
    const v_fun = f;
    v_obj.value = v_fun(v_obj.value)
  }

  function maskTel(value) {
    value = value.replace(/\D/g, ""); //Remove tudo o que não é dígito
    if (value.length > 11) {
      value = value.substr(0, 11)
    }

    value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    value = value.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
    return value;
  }

  function inputOnlyLetters(value) {
    return value.replace(/[0-9]/g, '');
  }

  function getById(el) {
    return document.getElementById(el);
  }

  getById('phone').onkeyup = function () {
    console.log('resr');
    getInputMask(this, maskTel);
  }
  getById('name').onkeyup = function () {
    getInputMask(this, inputOnlyLetters);
  }

  getById('name-indicated').onkeyup = function () {
    getInputMask(this, inputOnlyLetters);
  }

  getById('digit').onkeyup = function () {
    this.value = this.value.substring(0, 1)
  }

})();
