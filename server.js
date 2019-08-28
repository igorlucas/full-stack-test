const ParcelBundler = require('parcel-bundler')
const express = require('express')
const app = express()

const index = 'index.html'
const port = 8000
const bundler = new ParcelBundler(index, { watch: true })

app.use(express.urlencoded({ extended: true }))

/**
 * Contact form data validation and persistence must be made in this route!
 */
app.post('/contact', (req, res) => {

  const listaErros = [];

  const { nome, email, mensagem } = req.body;

  if (validarNome(nome).erros)
    listaErros.push(validarNome(nome))

  if (validarEmail(email).erros)
    listaErros.push(validarEmail(email))

  if (validarMensagem(mensagem).erros)
    listaErros.push(validarMensagem(mensagem))

  if (listaErros.length > 0) {
    return res.status(422).json({ errors: listaErros });
  }
  else {
    post({ nome, email, mensagem });
    return res.status(200).send(`Contact form data: ${JSON.stringify(req.body)}`)
  }

})

validarNome = (nome) => {
  const erros = [];

  if (!nome)
    erros.push("o campo nome é obrigatório");
  if (nome.trim().length < 7)
    erros.push("deve ter no mínimo 7 caracteres");
  if (nome.trim().split(' ').length < 2)
    erros.push('deve ter no minímo duas palavras');

  if (erros.length > 0)
    return { campo: 'nome', erros: erros };
  else
    return { erros: null }
};

validarEmail = (email) => {
  const erros = [];

  var dominio = email.substring(email.indexOf("@") + 1, email.length);

  if (!email)
    erros.push('o campo email é obrigatório');

  if (email.length < 3 || email.indexOf("@") <= 0 || dominio.length < 1)
    erros.push('campo email inválido');

  if (erros.length > 0)
    return { campo: 'email', erros: erros };
  else
    return { erros: null }

}

validarMensagem = (mensagem) => {

  const erros = [];

  if (!mensagem)
    erros.push("o campo mensagem é obrigatório");

  if (mensagem.trim().split(" ").length < 4)
    erros.push("deve ter no mínimo 4 palavras");

  if (mensagem.trim().length < 20)
    erros.push("deve ter no mínimo 20 caracteres");

  if (erros.length > 0)
    return { campo: 'mensagem', erros: erros };
  else
    return { erros: null }
}

post = (data) => {
  const BASE_URL = 'http://localhost:3000/posts'
  var request = require('request');
  request.post(
    BASE_URL,
    { json: data },
    function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(body);
      }
    }
  );
}

app.use(bundler.middleware())
app.listen(port, () => console.log(`Server running at http://localhost:${port}/`))