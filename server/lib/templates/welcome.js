module.exports = () => `
  <h1>¡Bienvenid@ a <strong>SOS Ticos</strong>!</h1>
  <p>Gracias por suscribirte a SOS Ticos, estamos contentos de tenerte.</p>
  <p>
    Hemos recibido una solicitud de acceso a tu cuenta con el siguiente
    <strong>código de seguridad</strong>:
  </p>
  <p class="expand">
    <span>${code}</span>
  </p>
  <p>Has click en el siguiente botón para confirmar el acceso a tu cuenta:</p>
  <p class="expand">
    <a class="button" href="${host}/confirm?token=${token}&email=${email}" target="_blank"
      >CONFIRMAR</a
    >
  </p>
  <p>O copie y pegue en su navegador el siguiente enlace:</p>
  <p>
    <a href="${host}/confirm?token=${token}&email=${email}" target="_blank"
      >${host}/confirm?token=${token}&email=${email}</a
    >
  </p>
  <p>¡Gracias por confiar en SOS Ticos!</p>
`
