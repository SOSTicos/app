module.exports = (data) => `
  <h1>Verifica tu correo para ingresar a <strong>SOS Ticos</strong></h1>
  <p>
    Hemos recibido una solicitud de acceso a tu cuenta con el siguiente
    <strong>código de seguridad</strong>:
  </p>
  <p class="expand">
    <span>${data.code}</span>
  </p>
  <p>Has click en el siguiente botón para confirmar el acceso a tu cuenta:</p>
  <p class="expand">
    <a class="button" href="${data.host}/confirm?token=${data.token}&email=${data.email}" target="_blank"
      >CONFIRMAR</a
    >
  </p>
  <p>O copie y pegue en su navegador el siguiente enlace:</p>
  <p>
    <a href="${data.host}/confirm?token=${data.token}&email=${data.email}" target="_blank"
      >${data.host}/confirm?token=${data.token}&email=${data.email}</a
    >
  </p>
`
