
(function () {
  "use strict";

  let formsInvitedInvited = document.querySelectorAll('.php-email-form');

  formsInvitedInvited.forEach(function (e) {
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
      if (keyType.value === 'CPF/CNPJ') {
        if (keyPix.value.length != 14 && keyPix.value.length != 18) {
          keyPix.classList.add('error-form');
          message += 'Chave PIX inválida! <br>';
        } else if (keyPix.value.length === 14 && !validCPF(keyPix.value.replace(/\D/g, ""))) {
          keyPix.classList.add('error-form');
          message += 'CPF inválido! <br>';
        } else if (keyPix.value.length === 18 && !validCNPJ(keyPix.value.replace(/\D/g, ""))) {
          keyPix.classList.add('error-form');
          message += 'CNPJ inválido! <br>';
        }
      } else if (keyType.value === 'Telefone' && keyPix.value.length != 15) {
        keyPix.classList.add('error-form');
        message += 'Chave PIX inválida! <br>';
      }
    } else if (receiptWay.value === 'ted') {
      if (cpf_cnpj.value.length != 14 && cpf_cnpj.value.length != 18) {
        cpf_cnpj.classList.add('error-form');
        message += 'Chave PIX inválida! <br>';
      } else if (cpf_cnpj.value.length === 14 && !validCPF(cpf_cnpj.value.replace(/\D/g, ""))) {
        cpf_cnpj.classList.add('error-form');
        message += 'CPF inválido! <br>';
      } else if (cpf_cnpj.value.length === 18 && !validCNPJ(cpf_cnpj.value.replace(/\D/g, ""))) {
        cpf_cnpj.classList.add('error-form');
        message += 'CNPJ inválido! <br>';
      }
    }

    if (message) {
      displayError(thisForm, message);
      return true;
    }
  }

  function validCPF(strCPF) {
    let Soma;
    let Resto;
    Soma = 0;
    if (strCPF == "00000000000") return false;

    for (let i = 1; i <= 9; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (11 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(9, 10))) return false;

    Soma = 0;
    for (let i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i - 1, i)) * (12 - i);
    Resto = (Soma * 10) % 11;

    if ((Resto == 10) || (Resto == 11)) Resto = 0;
    if (Resto != parseInt(strCPF.substring(10, 11))) return false;
    return true;
  }

  function validCNPJ(cnpj) {

    cnpj = cnpj.replace(/[^\d]+/g, '');

    if (cnpj == '') return false;

    if (cnpj.length != 14)
      return false;

    // Elimina CNPJs invalidos conhecidos
    if (cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999")
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(0))
      return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2)
        pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - soma % 11;
    if (resultado != digitos.charAt(1))
      return false;

    return true;

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
    if (value.length > 14) {
      value = value.substr(0, 14)
    }
    if (value.length <= 11) {
      value = value.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
      return value;
    } else {
      value = value.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g, "$1.$2.$3/$4-$5");
      return value;
    }
  }

  function inputOnlyLetters(value) {
    return value.replace(/[0-9]/g, '');
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

      const bankClass = getByClassName('bank');
      bankClass[0].classList.add('d-none');
      const bankId = getById('bank');
      bankId.removeAttribute('required');

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

      const bankClass = getByClassName('bank');
      bankClass[0].classList.remove('d-none');
      const bankId = getById('bank');
      bankId.setAttribute('required', '');
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
    console.log('teste telefone =>>');
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
    console.log('teste =>>');
    getInputMask(this, maskCPFCNPJ);
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
