window.onload = function () {

    let msg = document.getElementById("msg");
    let erroNome = document.querySelector('#erroNome');
    let erroEmail = document.querySelector('#erroEmail');
    let erroMensagem = document.querySelector('#erroMensagem');
    let formulario = document.getElementById('form');

    enviarForm = (e) => {
        validarForm(formulario);
    }

    validarForm = (formulario) => {
        var a = validarNome(formulario.nome);
        var b = validarEmail(formulario.email);
        var c = validarMensagem(formulario.mensagem);

        if (a && b && c) post({ nome: formulario.nome.value, email: formulario.email.value, mensagem: formulario.mensagem.value });
    }

    function validarMensagem(data) {
        let mensagem = data.value;
        var valid = true;

        erroMensagem.style.display = 'none';
        data.className = "";

        if (!mensagem) {
            erroMensagem.value = "o campo mensagem é obrigatório";
            valid = false;
        } else if (mensagem.trim().split(" ").length < 4) {
            erroMensagem.value = "deve ter no mínimo 4 palavras";
            valid = false;
        } else if (mensagem.trim().length < 20) {
            erroMensagem.value = "deve ter no mínimo 20 caracteres";
            valid = false;
        }
        if (!valid) {
            data.className = "error";
            erroMensagem.style.display = "block";
            data.focus();
        }
        return valid;
    }

    function validarEmail(data) {

        let email = data.value;
        var valid = true;

        erroEmail.style.display = 'none';
        data.className = "";

        var dominio = email.substring(email.indexOf("@") + 1, email.length);

        if (!email) {
            console.log('o campo email é obrigatório');
            erroEmail.value = "o campo email é obrigatório";
            valid = false;
        } else if (email.length < 3 || email.indexOf("@") <= 0 || dominio.length < 1) {
            console.log('campo email inválido');
            erroEmail.value = "campo email inválido";
            valid = false;
        }
        if (!valid) {
            data.className = "error";
            erroEmail.style.display = "block";
            data.focus();
        }
        return valid;
    }

    function validarNome(data) {
        let nome = data.value;
        var valid = true;
        erroNome.style.display = 'none';
        data.className = "";

        if (!nome) {
            console.log('o campo nome é obrigatório');
            erroNome.value = "o campo nome é obrigatório";
            valid = false;
        }
        else if (nome.trim().length < 7) {
            console.log('o campo nome deve ter no mínimo 7 caracteres');
            erroNome.value = "o campo nome deve ter no mínimo 7 caracteres";
            valid = false;
        } else if (nome.trim().split(' ').length < 2) {
            console.log('o campo nome deve ter no minímo 2 palavras');
            erroNome.value = "o campo nome deve ter no minímo 2 palavras";
            valid = false;
        }

        if (!valid) {
            data.className = "error";
            erroNome.style.display = "block";
            data.focus();
        }
        return valid;
    };

    function post(data) {
        const BASE_URL = '/contact'

        var ajax = new XMLHttpRequest();
        ajax.open("POST", `${BASE_URL}`, true);
        ajax.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

        ajax.send(`nome=${data.nome}&email=${data.email}&mensagem=${data.mensagem}`);

        ajax.onreadystatechange = function () {
            erroNome.style.display = 'none';
            formulario.nome.className = "";
            erroEmail.style.display = 'none';
            formulario.email.className = "";
            erroMensagem.style.display = 'none';
            formulario.mensagem.className = "";


            if (ajax.readyState == 4 && ajax.status == 200) {
                var data = ajax.responseText;
                console.log(data);
                msg.style.display = "block"
                setTimeout(() => {
                    msg.style.display = "none"
                }, 3000);

                formulario.reset();
            } else if (ajax.readyState == 4 && ajax.status == 422) {

                let result = ajax.responseText;
                const { errors } = JSON.parse(result);

                errors.forEach((e) => {
                    switch (e.campo) {
                        case 'nome': {
                            erroNome.style.display = 'block';
                            erroNome.value = e.erros[0];
                            formulario.nome.className = "error";
                            formulario.nome.focus();
                            break;
                        }
                        case 'email': {
                            erroEmail.style.display = 'block';
                            erroEmail.value = e.erros[0];
                            formulario.email.className = "error";
                            formulario.email.focus();
                            break;
                        }
                        case 'mensagem': {
                            erroMensagem.style.display = 'block';
                            erroMensagem.value = e.erros[0];
                            formulario.mensagem.className = "error";
                            formulario.mensagem.focus();
                            break;
                        }
                    }
                });

            }
        }
    }
};