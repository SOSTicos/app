module.exports = (
  data
) => ` <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
    <head>
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
      <title>
        <%= title %>
      </title>
      <style type="text/css">
        #outlook a {
          padding: 0;
        }

        /* Force Outlook to provide a "view in browser" message */

        .ReadMsgBody {
          width: 100%;
        }

        .ExternalClass {
          width: 100%;
        }

        /* Force Hotmail to display emails at full width */

        .ExternalClass,
        .ExternalClass p,
        .ExternalClass span,
        .ExternalClass font,
        .ExternalClass td,
        .ExternalClass div {
          line-height: 100%;
        }

        /* Force Hotmail to display normal line spacing */

        body,
        table,
        td,
        p,
        a,
        li,
        blockquote {
          -webkit-text-size-adjust: 100%;
          -ms-text-size-adjust: 100%;
        }

        /* Prevent WebKit and Windows mobile changing default text sizes */

        table,
        td {
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
        }

        /* Remove spacing between tables in Outlook 2007 and up */

        img {
          -ms-interpolation-mode: bicubic;
        }

        /* Allow smoother rendering of resized image in Internet Explorer */

        body {
          margin: 0;
          padding: 0;
        }

        img {
          border: 0;
          height: auto;
          line-height: 100%;
          outline: none;
          text-decoration: none !important;
        }

        table {
          border-collapse: collapse !important;
        }

        body,
        #body-table,
        #body-cell {
          height: 100% !important;
          margin: 0;
          padding: 0;
          width: 100% !important;
        }

        #body-cell {
          padding: 20px;
        }

        #template-container {
          width: 600px;
        }

        body,
        #body-table {
          background-color: #fff;
        }

        #body-cell {
          border-top: 4px solid #fff;
        }

        #template-container {
          border: 1px solid #e3f2fd;
        }

        a {
          color: #311b92 !important;
          text-decoration: none;
        }

        h1 {
          color: #3f3d56 !important;
          display: block;
          font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
          font-size: 24px;
          font-style: normal;
          font-weight: 500;
          line-height: 100%;
          letter-spacing: normal;
          margin: 30px 0px;
          text-align: left;
        }

        h2 {
          color: #404040 !important;
          display: block;
          font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
          font-size: 20px;
          font-style: normal;
          font-weight: bold;
          line-height: 100%;
          letter-spacing: normal;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 10px;
          margin-left: 0;
          text-align: left;
        }

        h3 {
          color: #606060 !important;
          display: block;
          font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
          font-size: 16px;
          font-style: italic;
          font-weight: normal;
          line-height: 100%;
          letter-spacing: normal;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 10px;
          margin-left: 0;
          text-align: left;
        }

        h4 {
          color: #808080 !important;
          display: block;
          font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
          font-size: 15px;
          font-style: italic;
          font-weight: normal;
          line-height: 100%;
          letter-spacing: normal;
          margin-top: 0;
          margin-right: 0;
          margin-bottom: 10px;
          margin-left: 0;
          text-align: left;
        }

        .small {
          font-size: 10;
          line-height: 24px;
          font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
          color: #808080 !important;
        }

        #template-header {
          background-color: #fff;
          color: #808080 !important;
        }

        .header {
          color: #505050;
          font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
          font-size: 20px;
          font-weight: bold;
          line-height: 100%;
          padding: 25px 50px 16px;
          text-align: center;
          vertical-align: middle;
          /* border-bottom: 1px solid #e3f2fd; */
        }

        .header a:link,
    .header a:visited,
    /* Yahoo! Mail Override */

    .header a .yshortcuts
    /* Yahoo! Mail Override */ {
          color: #311b92;
          font-weight: normal;
          text-decoration: none !important;
        }

        #header-image {
          height: auto;
        }

        #template-body {
          background-color: #fff;
          /* border-bottom: 1px solid #e3f2fd; */
        }

        .content {
          color: #3f3d56;
          font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
          font-size: 15px;
          line-height: 150%;
          padding: 0px 70px 25px;
          text-align: left;
        }

        .content a:link,
    .content a:visited,
    /* Yahoo! Mail Override */

    .content a .yshortcuts
    /* Yahoo! Mail Override */ {
          color: #311b92;
          font-weight: normal;
          text-decoration: none !important;
        }

        .content img {
          display: inline;
          height: auto;
          max-width: 560px;
        }

        #template-footer {
          background-color: #fff;
        }

        .footer {
          color: #808080;
          font-family: 'Roboto', 'Helvetica', 'Arial', sans-serif;
          font-size: 12px;
          line-height: 150%;
          padding: 50px;
          padding-top: 20px;
          text-align: left;
        }

        .footer a:link,
    .footer a:visited,
    /* Yahoo! Mail Override */

    .footer a .yshortcuts,
    .footer a span
    /* Yahoo! Mail Override */ {
          color: #311b92;
          font-weight: normal;
          text-decoration: none !important;
        }

        .content .expand {
          text-align: center;
          display: inline-block;
          width: 100%;
        }

        .content .expand .button {
          background-color: #311b92;
          border-radius: 5px;
          color: #fff !important;
          display: inline-block;
          font-size: 15px;
          font-weight: 600;
          line-height: 50px;
          text-align: center;
          text-decoration: none !important;
          min-width: 200px;
          max-width: 400px;
          margin: auto;
          padding: 0 16px;
        }

        .content .expand span {
          border-radius: 8px;
          display: inline-block;
          text-align: center;
          width: 100%;
          font-size: 32px;
          color: #311b92;
          border: 1px dashed #311b9225;
          padding: 16px 0px;
        }

        @media only screen and (max-width: 480px) {
          /* /////// CLIENT-SPECIFIC MOBILE STYLES /////// *
      body,
      table,
      td,
      p,
      a,
      li,
      blockquote {
        -webkit-text-size-adjust: none !important;
      }
      /* Prevent Webkit platforms from changing default text sizes */
          body {
            width: 100% !important;
            min-width: 100% !important;
          }

          #body-cell {
            padding: 10px !important;
          }

          #template-container {
            max-width: 600px !important;
            width: 100% !important;
          }

          h1 {
            font-size: 24px !important;
            line-height: 100% !important;
          }

          h2 {
            font-size: 20px !important;
            line-height: 100% !important;
          }

          h3 {
            font-size: 18px !important;
            line-height: 100% !important;
          }

          h4 {
            font-size: 16px !important;
            line-height: 100% !important;
          }

          #template-preheader {
            display: none !important;
          }

          #header-image {
            height: auto !important;
          }

          .header {
            font-size: 20px !important;
            line-height: 125% !important;
          }

          .content {
            font-size: 18px !important;
            line-height: 125% !important;
          }

          .footer {
            font-size: 15px !important;
            line-height: 115% !important;
          }

          .footer a {
            display: block !important;
          }
        }
      </style>
    </head>

    <body leftmargin="0" marginwidth="0" topmargin="0" marginheight="0" offset="0">
      <center>
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          height="100%"
          width="100%"
          id="body-table"
        >
          <tr>
            <td align="center" valign="top" id="body-cell">
              <!-- BEGIN TEMPLATE // -->
              <table border="0" cellpadding="0" cellspacing="0" id="template-container">
                <tr>
                  <td align="center" valign="top">
                    <!-- BEGIN HEADER // -->
                    <table
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      width="100%"
                      id="template-header"
                    >
                      <tr>
                        <td valign="top" class="header">
                          <img src="${data.site}/logo-icon.png" id="header-image" />
                        </td>
                      </tr>
                    </table>

                    <!-- // END HEADER -->
                  </td>
                </tr>
                <tr>
                  <td align="center" valign="top">
                    <!-- BEGIN BODY // -->
                    <table
                      border="0"
                      cellpadding="0"
                      cellspacing="0"
                      width="100%"
                      id="template-body"
                    >
                      <tr>
                        <td valign="top" class="content">
                          ${data.content}
                          <p>
                            Atentamente,
                            <br />
                            El equipo de SOS Ticos.
                            <br />
                            <a href="${data.site}" target="_blank">${data.site}</a>
                          </p>
                        </td>
                      </tr>
                    </table>

                    <!-- // END BODY -->
                  </td>
                </tr>
              </table>

              <!-- // END TEMPLATE -->
            </td>
          </tr>
        </table>
      </center>
    </body>
  </html>`
