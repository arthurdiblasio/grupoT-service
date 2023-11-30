(function () {
  "use strict";

  let formsDoubts = document.querySelectorAll(".php-email-form-partner");

  formsDoubts.forEach(function (e) {
    e.addEventListener("submit", function (event) {
      event.preventDefault();

      let thisForm = this;
      let action = thisForm.getAttribute("action");
      let recaptcha = thisForm.getAttribute("data-recaptcha-site-key");

      if (!action) {
        displayError(thisForm, "The form action property is not set!");
        return;
      }
      thisForm.querySelector(".loading").classList.add("d-block");
      thisForm.querySelector(".error-message").classList.remove("d-block");
      thisForm.querySelector(".sent-message").classList.remove("d-block");

      let formData = new FormData(thisForm);
      if (recaptcha) {
        if (typeof grecaptcha !== "undefined") {
          grecaptcha.ready(function () {
            try {
              grecaptcha
                .execute(recaptcha, { action: "email_form_submit" })
                .then((token) => {
                  formData.set("recaptcha-response", token);
                  email_form_submit(thisForm, action, formData);
                });
            } catch (error) {
              displayError(thisForm, error);
            }
          });
        } else {
          displayError(
            thisForm,
            "The reCaptcha javascript API url is not loaded!"
          );
        }
      } else if (formInvalidPartner(thisForm)) {
        return;
      } else {
        email_form_submit(thisForm, action, formData);
      }
    });
  });

  function validCNPJ(cnpj) {
    cnpj = cnpj.replace(/[^\d]+/g, "");

    if (cnpj == "") return false;

    if (cnpj.length != 14) return false;

    // Elimina CNPJs invalidos conhecidos
    if (
      cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999"
    )
      return false;

    // Valida DVs
    let tamanho = cnpj.length - 2;
    let numeros = cnpj.substring(0, tamanho);
    let digitos = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;

    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
  }

  function formInvalidPartner(thisForm) {
    let message = "";
    const phone = getById("phone");
    const cnpj = getById("cnpj");
    phone.classList.remove("error-form");
    cnpj.classList.remove("error-form");
    if (phone.value.length != 15) {
      phone.classList.add("error-form");
      message += "Telefone inválido! <br>";
    }
    if (cnpj.value.length === 18 && !validCNPJ(cnpj.value.replace(/\D/g, ""))) {
      cnpj.classList.add("error-form");
      message += "CNPJ inválido! <br>";
    }
    if (message) {
      displayError(thisForm, message);
      return true;
    }
  }

  function email_form_submit(thisForm, action, formData) {
    fetch(action, {
      method: "POST",
      body: formData,
      headers: { "X-Requested-With": "XMLHttpRequest" },
    })
      .then((response) => {
        if (response.ok) {
          return response.status;
        } else {
          throw new Error(
            `${response.status} ${response.statusText} ${response.url}`
          );
        }
      })
      .then((status) => {
        thisForm.querySelector(".loading").classList.remove("d-block");
        if (status === 200) {
          thisForm.querySelector(".sent-message").classList.add("d-block");
          thisForm.reset();
          const message =
            "Sua solicitação foi recebida, em breve entraremos em contato!";
          showSnackbar(message);
        } else {
          throw new Error(
            data
              ? data
              : "Form submission failed and no error message returned from: " +
                action
          );
        }
      })
      .catch((error) => {
        displayError(thisForm, error);
      });
  }

  function displayError(thisForm, error) {
    if (!error.ok || error.ok !== "true") {
      thisForm.querySelector(".loading").classList.remove("d-block");
      thisForm.querySelector(".error-message").innerHTML = error;
      thisForm.querySelector(".error-message").classList.add("d-block");
    }
  }

  /* Máscaras ER */
  function getInputMask(o, f) {
    const v_obj = o;
    const v_fun = f;
    v_obj.value = v_fun(v_obj.value);
  }

  function maskTel(value) {
    value = value.replace(/\D/g, ""); //Remove tudo o que não é dígito
    if (value.length > 11) {
      value = value.substr(0, 11);
    }

    value = value.replace(/^(\d{2})(\d)/g, "($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    value = value.replace(/(\d)(\d{4})$/, "$1-$2"); //Coloca hífen entre o quarto e o quinto dígitos
    return value;
  }

  function maskCNPJ(value) {
    value = value.replace(/\D/g, "");
    if (value.length > 14) {
      value = value.substr(0, 14);
    }
    value = value.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
      "$1.$2.$3/$4-$5"
    );
    return value;
  }

  function inputOnlyLetters(value) {
    return value.replace(/[0-9]/g, "");
  }

  function getById(el) {
    return document.getElementById(el);
  }

  getById("cnpj").onkeyup = function () {
    getInputMask(this, maskCNPJ);
  };

  getById("phone").onkeyup = function () {
    getInputMask(this, maskTel);
  };

  function showSnackbar(message) {
    const snackbarDiv = document.getElementById("snackbar");

    // Add the "show" class to DIV
    snackbarDiv.className = "show";
    snackbarDiv.innerText = message;

    // After 3 seconds, remove the show class from DIV
    setTimeout(function () {
      snackbarDiv.className = snackbarDiv.className.replace("show", "");
    }, 3000);
  }
})();
