/**
* PHP Email Form Validation - v3.2
* URL: https://bootstrapmade.com/php-email-form/
* Author: BootstrapMade.com
*/
(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
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
      } else if (formInvalid(thisForm)) {
        return;
      } else {
        email_form_submit(thisForm, action, formData);
      }
    });
  });

  function formInvalid(thisForm) {
    let message = '';
    const indicatePhone = getById('telefone-indicante');
    indicatePhone.classList.remove('error-form');
    if (indicatePhone.value.length != 15) {
      indicatePhone.classList.add('error-form');
      message += 'Telefone de quem indica está inválido! <br>';
    }

    const indicatedPhone = getById('telefone-indicado');
    indicatedPhone.classList.remove('error-form');
    if (indicatedPhone.value.length != 15) {
      indicatedPhone.classList.add('error-form');
      message += 'Telefone do indicado está inválido! <br>';
    }

    const receiptWay = getById('receipt-way');
    const keyType = getById('key-type');
    const keyPix = getById('key-pix');
    const cpf_cnpj = getById('cpf/cnpj');
    keyPix.classList.remove('error-form');
    if (receiptWay.value === 'pix') {
      if (keyType.value === 'CPF/CNPJ' && (keyPix.value.length != 14 && keyPix.value.length != 18)) {
        keyPix.classList.add('error-form');
        message += 'Chave PIX inválida! <br>';
      } else if (keyType.value === 'Telefone' && keyPix.value.length != 15) {
        keyPix.classList.add('error-form');
        message += 'Chave PIX inválida! <br>';
      }
    } else if (receiptWay.value === 'ted') {
      if (keyType.value === 'CPF/CNPJ' && (keyPix.value.length != 14 && keyPix.value.length != 18)) {
        keyPix.classList.add('error-form');
        message += 'Chave PIX inválida! <br>';
      } else if (keyType.value === 'Telefone' && keyPix.value.length != 15) {
        keyPix.classList.add('error-form');
        message += 'Chave PIX inválida! <br>';
      }
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

  function maskCPFCNPJ(value) {
    value = value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
      return value;
    } else {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
      return value;
    }
  }

  function setKeyPIXMask(object) {
    const objectKeyType = getById('key-type');
    switch (objectKeyType.value) {
      case 'CPF/CNPJ':
        object.maxlength = 18;
        getInputMask(object, maskCPFCNPJ);
        break;
      case 'Telefone':
        object.maxlength = 15;
        getInputMask(object, maskTel);
        break;
    }
  }

  function setReceiptWay(object) {
    if (object.value === 'pix') {
      const keyTypeClass = getByClassName('key-type');
      keyTypeClass[0].classList.remove('d-none');
      const keyTypeId = getById('key-type');
      keyTypeId.setAttribute('required', '');

      const keyPixClass = getByClassName('key-pix');
      keyPixClass[0].classList.remove('d-none');
      const keyPixId = getById('key-pix');
      keyPixId.setAttribute('required', '');

      const agencyClass = getByClassName('agency');
      agencyClass[0].classList.add('d-none');
      const agencyId = getById('agency');
      agencyId.removeAttribute('required');

      const accountClass = getByClassName('account');
      accountClass[0].classList.add('d-none');
      const accountId = getById('account');
      accountId.removeAttribute('required');

      const digitClass = getByClassName('digit');
      digitClass[0].classList.add('d-none');
      const digitId = getById('digit');
      digitId.removeAttribute('required');


      const CPFCNPJClass = getByClassName('cpf-cnpj');
      CPFCNPJClass[0].classList.add('d-none');
      const CPFCNPJId = getById('cpf/cnpj');
      CPFCNPJId.removeAttribute('required');
    } else {
      const keyTypeClass = getByClassName('key-type');
      keyTypeClass[0].classList.add('d-none');
      const keyTypeId = getById('key-type');
      keyTypeId.removeAttribute('required');

      const keyPixClass = getByClassName('key-pix');
      keyPixClass[0].classList.add('d-none');
      const keyPixId = getById('key-pix');
      keyPixId.removeAttribute('required');

      const agencyClass = getByClassName('agency');
      agencyClass[0].classList.remove('d-none');
      const agencyId = getById('agency');
      agencyId.setAttribute('required', '');

      const accountClass = getByClassName('account');
      accountClass[0].classList.remove('d-none');
      const accountId = getById('account');
      accountId.setAttribute('required', '');

      const digitClass = getByClassName('digit');
      digitClass[0].classList.remove('d-none');
      const digitId = getById('digit');
      digitId.setAttribute('required', '');

      const CPFCNPJClass = getByClassName('cpf-cnpj');
      CPFCNPJClass[0].classList.remove('d-none');
      const CPFCNPJId = getById('cpf/cnpj');
      CPFCNPJId.setAttribute('required', '');
    }
  }

  function getById(el) {
    return document.getElementById(el);
  }

  function getByClassName(el) {
    return document.getElementsByClassName(el);
  }

  getById('telefone-indicante').onkeyup = function () {
    getInputMask(this, maskTel);
  }

  getById('telefone-indicado').onkeyup = function () {
    getInputMask(this, maskTel);
  }

  getById('key-type').onchange = function () {
    getById('key-pix').value = '';
  }

  getById('key-pix').onkeyup = function () {
    setKeyPIXMask(this);
  }

  getById('receipt-way').onchange = function () {
    setReceiptWay(this);
  }

  getById('cpf/cnpj').onkeyup = function () {
    getInputMask(this, maskCPFCNPJ);
  }

})();
