module.exports = () => ` <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta
        name="viewport"
        content="width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=0"
      />
      <meta name="description" content="Confirmación de acceso a SOS Ticos" />
      <title>Confirmación SOS Ticos</title>

      <link rel="icon" type="image/png" href="https://spry.cr/favicon.ico" />
      <link rel="stylesheet" href="./mains.css" />

      <style>
        html,
        body {
          margin: 0;
          padding: 0;
          font-family: 'Roboto', 'Helvetica', 'Arial';
          color: rgba(0, 0, 0, 0.87);
          font-weight: 400;
          line-height: 1.42857;
          width: 100%;
          height: 100%;
        }

        html {
          box-sizing: border-box;
        }

        *,
        *:before,
        *:after {
          box-sizing: inherit;
        }

        body {
          margin: 0;
          min-height: 100vh;
        }

        /* Should be able to just put this as absolute in parent? */
        .portal {
          max-width: 22rem;
          width: 100%;
          /* Fixed height is good even on smaller phones, otherwise vertically centered items would jump */
          height: 31rem;
          overflow: hidden;
          margin: auto;
        }

        @media screen and (min-height: 32rem) {
          body > main.portal {
            position: absolute;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;

            margin: auto;
          }
        }

        .levitate {
          background-color: white;
          /* border: #43464B 1px solid; */
          /* border: #43464B 1px solid; */
          box-shadow: 0 12px 30px 0 rgba(0, 0, 0, 0.5), inset 0 1px 0 0 hsla(0, 0%, 100%, 0.65);
          border-radius: 10px;
        }

        @media screen and (max-width: 22rem) {
          .levitate {
            border-width: 3px;
          }
        }

        body {
          font-size: 1.4rem;
          letter-spacing: 1px;
          line-height: 1.5;
          transition: opacity 0.2s;
        }

        main {
          transition: transform 0.2s;
          display: flex;
          flex-direction: column;
        }

        .push-down {
          margin-top: auto !important;
          margin-bottom: -1px;
        }

        .logo {
          margin-bottom: 50px;
          margin-top: -70px;
        }

        .background {
          background: #43464b;
          opacity: 0.23;
          opacity: 0.73;
          filter: blur(10px);
          margin: -10px;

          position: fixed;
          top: -10px;
          bottom: -10px;
          left: -10px;
          right: -10px;
          z-index: -1;
        }

        .centered {
          text-align: center;
          margin-left: 1.2rem;
          margin-right: 1.2rem;
        }

        .centered.push-down {
          margin: auto 1.2rem auto;
        }

        p {
          margin: 8px 0;
          line-height: 28px;
        }
      </style>
    </head>

    <body>
      <div class="background"></div>

      <main class="portal levitate">
        <section class="centered push-down">
          <div class="logo">
            <svg version="1.1" viewBox="0 0 86 101" width="70">
              <g fill="none">
                <g fill="#e91e63">
                  <polyline
                    points="5.52 53.167 5.52 28.644 43.136 6.926 86.212 31.796 86.212 25.493 43.136 0.622 0.061 25.493 0.061 62.624 5.52 65.775 17.185 72.51 43.144 87.49 75.293 68.927 75.293 44.404 69.834 41.253 69.834 65.776 43.136 81.19 5.52 59.472 5.52 53.167"
                  ></polyline>
                  <polyline
                    points="16.439 59.472 16.439 34.948 43.136 19.535 80.753 41.253 80.753 72.08 43.136 93.798 0.061 68.928 0.061 75.232 43.136 100.1 86.212 75.232 86.212 38.1 85.736 37.825 43.136 13.231 37.677 16.382 32.218 19.535 10.98 31.796 10.98 56.32 16.439 59.472"
                  ></polyline>
                  <path
                    d="m38.713 62.444h8.847l-2.544-9.33-0.841-3.076 0.937-0.334c2.338-0.835 3.907-3.052 3.907-5.541 0-3.249-2.634-5.883-5.883-5.883-3.248 0-5.882 2.635-5.882 5.883 0 2.489 1.568 4.706 3.906 5.541l0.937 0.334-3.384 12.406"
                  ></path>
                </g>
              </g>
            </svg>
          </div>

          <p><b style="color: #e91e63;">Acceso Denegado</b></p>
          <p>Su código de confirmación es inválido o ya expiró. Por favor intente de nuevo.</p>
        </section>
      </main>
    </body>
  </html>`
