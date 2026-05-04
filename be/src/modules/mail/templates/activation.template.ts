export const activationTemplate = (
  title: string,
  name: string,
  key: string,
) => {
  return `<!doctype html>
<html
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta
      name="format-detection"
      content="telephone=no, date=no, address=no, email=no"
    />
    <meta name="x-apple-disable-message-reformatting" />
    <link
      href="https://fonts.googleapis.com/css?family=DM+Sans:ital,wght@0,400;0,600;0,700;0,800"
      rel="stylesheet"
    />
    <title>Stravia</title>
    <!-- Made with Postcards Email Builder by Designmodo -->
    <style>
      html,
      body {
        margin: 0 !important;
        padding: 0 !important;
        min-height: 100% !important;
        width: 100% !important;
        -webkit-font-smoothing: antialiased;
      }
      * {
        -ms-text-size-adjust: 100%;
      }
      #outlook a {
        padding: 0;
      }
      .ReadMsgBody,
      .ExternalClass {
        width: 100%;
      }
      .ExternalClass,
      .ExternalClass p,
      .ExternalClass td,
      .ExternalClass div,
      .ExternalClass span,
      .ExternalClass font {
        line-height: 100%;
      }
      table,
      td,
      th {
        mso-table-lspace: 0 !important;
        mso-table-rspace: 0 !important;
        border-collapse: collapse;
      }
      u + .body table,
      u + .body td,
      u + .body th {
        will-change: transform;
      }
      body,
      td,
      th,
      p,
      div,
      li,
      a,
      span {
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        mso-line-height-rule: exactly;
      }
      img {
        border: 0;
        outline: 0;
        line-height: 100%;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }
      a[x-apple-data-detectors] {
        color: inherit !important;
        text-decoration: none !important;
      }
      .body .pc-project-body {
        background-color: transparent !important;
      }
      @media (min-width: 621px) {
        .pc-lg-hide {
          display: none;
        }
        .pc-lg-bg-img-hide {
          background-image: none !important;
        }
      }
    </style>
    <style>
      @media (max-width: 620px) {
        .pc-project-body {
          min-width: 0 !important;
        }
        .pc-project-container,
        .pc-component {
          width: 100% !important;
        }
        .pc-sm-bg-img-hide {
          background-image: none !important;
        }
        .pc-w620-padding-0-0-0-0 {
          padding: 0 !important;
        }
        table.pc-w620-spacing-0-0-30-0 {
          margin: 0 0 30px !important;
        }
        td.pc-w620-spacing-0-0-30-0,
        th.pc-w620-spacing-0-0-30-0 {
          margin: 0 !important;
          padding: 0 0 30px !important;
        }
        .pc-w620-padding-32-20-0-20 {
          padding: 32px 20px 0 !important;
        }
        .pc-w620-itemsVSpacings-20 {
          padding-top: 10px !important;
          padding-bottom: 10px !important;
        }
        .pc-w620-itemsHSpacings-0 {
          padding-left: 0 !important;
          padding-right: 0 !important;
        }
        .pc-w620-valign-top {
          vertical-align: top !important;
        }
        td.pc-w620-halign-center,
        th.pc-w620-halign-center {
          text-align: center !important;
          text-align-last: center !important;
        }
        table.pc-w620-halign-center {
          float: none !important;
          margin-right: auto !important;
          margin-left: auto !important;
        }
        img.pc-w620-halign-center {
          margin-right: auto !important;
          margin-left: auto !important;
        }
        .pc-w620-text-align-center {
          text-align: center !important;
          text-align-last: center !important;
        }
        div.pc-w620-align-center,
        th.pc-w620-align-center,
        a.pc-w620-align-center,
        td.pc-w620-align-center {
          text-align: center !important;
          text-align-last: center !important;
        }
        table.pc-w620-align-center {
          float: none !important;
          margin-right: auto !important;
          margin-left: auto !important;
        }
        img.pc-w620-align-center {
          margin-right: auto !important;
          margin-left: auto !important;
        }
        .pc-w620-width-84pc {
          width: 84% !important;
        }
        .pc-w620-height-100pc {
          height: 100% !important;
        }
        .pc-w620-padding-40-20-40-20 {
          padding: 40px 20px !important;
        }
        .pc-w620-font-size-18px {
          font-size: 18px !important;
        }
        .pc-w620-line-height-26px {
          line-height: 26px !important;
        }
        .pc-w620-itemsVSpacings-30 {
          padding-top: 15px !important;
          padding-bottom: 15px !important;
        }
        table.pc-w620-spacing-0-0-20-0 {
          margin: 0 0 20px !important;
        }
        td.pc-w620-spacing-0-0-20-0,
        th.pc-w620-spacing-0-0-20-0 {
          margin: 0 !important;
          padding: 0 0 20px !important;
        }
        .pc-w620-padding-18-20-18-20 {
          padding: 18px 20px !important;
        }
        .pc-w620-padding-36-16-16-16 {
          padding: 36px 16px 16px !important;
        }
        table.pc-w620-spacing-0-0-0-0 {
          margin: 0 !important;
        }
        td.pc-w620-spacing-0-0-0-0,
        th.pc-w620-spacing-0-0-0-0 {
          margin: 0 !important;
          padding: 0 !important;
        }
        .pc-w620-padding-24-20-24-20 {
          padding: 24px 20px !important;
        }
        table.pc-w620-spacing-0-0-8-0 {
          margin: 0 0 8px !important;
        }
        td.pc-w620-spacing-0-0-8-0,
        th.pc-w620-spacing-0-0-8-0 {
          margin: 0 !important;
          padding: 0 0 8px !important;
        }
        .pc-w620-line-height-36px {
          line-height: 36px !important;
        }
        .pc-w620-font-size-16px {
          font-size: 16px !important;
        }
        .pc-w620-line-height-24px {
          line-height: 24px !important;
        }
        .pc-w620-padding-16-16-16-16 {
          padding: 16px !important;
        }
        .pc-w620-itemsVSpacings-16 {
          padding-top: 8px !important;
          padding-bottom: 8px !important;
        }
        .pc-w620-width-fill {
          width: 100% !important;
        }
        .pc-w620-width-110 {
          width: 110px !important;
        }
        .pc-w620-height-auto {
          height: auto !important;
        }
        .pc-w620-itemsHSpacings-8 {
          padding-left: 4px !important;
          padding-right: 4px !important;
        }
        .pc-w620-width-hug {
          width: auto !important;
        }
        .pc-w620-width-100pc {
          width: 100% !important;
        }
        table.pc-w620-spacing-0-8-0-8 {
          margin: 0 8px !important;
        }
        td.pc-w620-spacing-0-8-0-8,
        th.pc-w620-spacing-0-8-0-8 {
          margin: 0 !important;
          padding: 0 8px !important;
        }
        .pc-w620-itemsVSpacings-0 {
          padding-top: 0 !important;
          padding-bottom: 0 !important;
        }
        .pc-w620-itemsHSpacings-20 {
          padding-left: 10px !important;
          padding-right: 10px !important;
        }
        table.pc-w620-spacing-0-20-0-20 {
          margin: 0 20px !important;
        }
        td.pc-w620-spacing-0-20-0-20,
        th.pc-w620-spacing-0-20-0-20 {
          margin: 0 !important;
          padding: 0 20px !important;
        }
        .pc-w620-padding-20-20-30-20 {
          padding: 20px 20px 30px !important;
        }
        .pc-g-ib {
          display: inline-block !important;
        }
        .pc-g-b {
          display: block !important;
        }
        .pc-g-rb {
          display: block !important;
          width: auto !important;
        }
        .pc-g-wf {
          width: 100% !important;
        }
        .pc-g-rpt {
          padding-top: 0 !important;
        }
        .pc-g-rpr {
          padding-right: 0 !important;
        }
        .pc-g-rpb {
          padding-bottom: 0 !important;
        }
        .pc-g-rpl {
          padding-left: 0 !important;
        }
        .pc-sm-hide {
          display: none !important;
        }
      }
    </style>
    <!--[if !mso]><!-- -->
    <style>
      @font-face {
        font-family: "DM Sans";
        font-style: normal;
        font-weight: 400;
        src:
          url("https://fonts.gstatic.com/l/font?kit=rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxRR23w&skey=cd068b3e1b767e51&v=v17")
            format("woff"),
          url("https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAopxRR232.woff2")
            format("woff2");
      }
      @font-face {
        font-family: "DM Sans";
        font-style: normal;
        font-weight: 600;
        src:
          url("https://fonts.gstatic.com/l/font?kit=rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAfJtRR23w&skey=cd068b3e1b767e51&v=v17")
            format("woff"),
          url("https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAfJtRR232.woff2")
            format("woff2");
      }
      @font-face {
        font-family: "DM Sans";
        font-style: normal;
        font-weight: 700;
        src:
          url("https://fonts.gstatic.com/l/font?kit=rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwARZtRR23w&skey=cd068b3e1b767e51&v=v17")
            format("woff"),
          url("https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwARZtRR232.woff2")
            format("woff2");
      }
      @font-face {
        font-family: "DM Sans";
        font-style: normal;
        font-weight: 800;
        src:
          url("https://fonts.gstatic.com/l/font?kit=rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAIptRR23w&skey=cd068b3e1b767e51&v=v17")
            format("woff"),
          url("https://fonts.gstatic.com/s/dmsans/v17/rP2tp2ywxg089UriI5-g4vlH9VoD8CmcqZG40F9JadbnoEwAIptRR232.woff2")
            format("woff2");
      }
    </style>
    <!--<![endif]-->
    <!--[if mso
      ]><style type="text/css">
        .pc-font-alt {
          font-family: Arial, Helvetica, sans-serif !important;
        }
      </style><![endif]-->
    <!--[if gte mso 9
      ]><xml
        ><o:OfficeDocumentSettings
          ><o:AllowPNG /><o:PixelsPerInch
            >96</o:PixelsPerInch
          ></o:OfficeDocumentSettings
        ></xml
      ><![endif]-->
  </head>
  <body
    class="body pc-font-alt"
    style="
      width: 100% !important;
      min-height: 100% !important;
      margin: 0 !important;
      padding: 0 !important;
      mso-line-height-rule: exactly;
      -webkit-font-smoothing: antialiased;
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
      font-variant-ligatures: normal;
      text-rendering: optimizeLegibility;
      -moz-osx-font-smoothing: grayscale;
      background-color: #ffc627;
      font-feature-settings: &quot;calt&quot;;
    "
    bgcolor="#ffc627"
  >
    <table
      class="pc-project-body"
      style="
        table-layout: fixed;
        width: 100%;
        min-width: 600px;
        background-color: #ffc627;
      "
      bgcolor="#ffc627"
      border="0"
      cellspacing="0"
      cellpadding="0"
      role="presentation"
    >
      <tr>
        <td align="center" valign="top" style="width: auto">
          <table
            class="pc-project-container"
            align="center"
            border="0"
            cellpadding="0"
            cellspacing="0"
            role="presentation"
          >
            <tr>
              <td
                class="pc-w620-padding-0-0-0-0"
                style="padding: 20px 0"
                align="left"
                valign="top"
              >
                <table
                  class="pc-component"
                  style="width: 600px; max-width: 600px"
                  width="600"
                  align="center"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  role="presentation"
                >
                  <tr>
                    <td
                      class="pc-w620-spacing-0-0-0-0"
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      role="presentation"
                    >
                      <table
                        width="100%"
                        align="center"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        role="presentation"
                      >
                        <tr>
                          <!--[if !gte mso 9]><!-- -->
                          <td
                            valign="top"
                            class="pc-w620-padding-36-16-16-16"
                            style="
                              background-image: url(&quot;https://cloudfilesdm.com/postcards/image-17332368943239-171d7287.png&quot;);
                              background-size: cover;
                              background-position: center;
                              background-repeat: no-repeat;
                              padding: 40px 16px 0;
                              height: unset;
                              background-color: #f3f3f3;
                            "
                            bgcolor="#f3f3f3"
                            background="https://cloudfilesdm.com/postcards/image-17332368943239-171d7287.png"
                          >
                            <!--<![endif]-->
                            <!--[if gte mso 9]><td valign="top" align="center" style="background-image:url('https://cloudfilesdm.com/postcards/image-17332368943239-171d7287.png');background-size:cover;background-position:center;background-repeat:no-repeat;background-color:#f3f3f3;border-radius:0" bgcolor="#f3f3f3" background="https://cloudfilesdm.com/postcards/image-17332368943239-171d7287.png"><![endif]-->
                            <!--[if gte mso 9]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px"><v:fill src="https://cloudfilesdm.com/postcards/image-17332368943239-171d7287.png" color="#f3f3f3" type="frame" size="1,1" aspect="atleast" origin="0,0" position="0,0"/><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><div style="font-size:0;line-height:0"><table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="font-size:14px;line-height:1.5" valign="top"><p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p><table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation"><tr><td colspan="3" height="40" style="line-height:1px;font-size:1px">&nbsp;</td></tr><tr><td width="16" valign="top" style="line-height:1px;font-size:1px">&nbsp;</td><td valign="top" align="left"><![endif]-->
                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                            >
                              <tr>
                                <td
                                  class="pc-w620-spacing-0-0-30-0"
                                  align="center"
                                  valign="top"
                                  style="padding: 0 0 20px; height: auto"
                                >
                                  <a
                                    class="pc-font-alt"
                                    href="https://postcards.email/"
                                    target="_blank"
                                    style="
                                      text-decoration: none;
                                      display: inline-block;
                                      vertical-align: top;
                                    "
                                    ><img
                                      src="https://cloudfilesdm.com/postcards/ChatGPT_Image_13_05_23_4_thg_5_2026-61bfd000.png"
                                      style="
                                        display: block;
                                        outline: 0;
                                        line-height: 100%;
                                        -ms-interpolation-mode: bicubic;
                                        height: 60px;
                                        max-height: 100%;
                                        width: auto;
                                        border: 0;
                                      "
                                      width="96"
                                      height="60"
                                      alt=""
                                  /></a>
                                </td>
                              </tr>
                            </table>
                            <table
                              class="pc-width-fill"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="pc-g-rpt pc-g-rpb"
                                    align="center"
                                    valign="top"
                                    style="padding-top: 0; padding-bottom: 0"
                                  >
                                    <table
                                      style="
                                        border-collapse: separate;
                                        border-spacing: 0;
                                        width: 100%;
                                      "
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                    >
                                      <tr>
                                        <td
                                          class="pc-w620-padding-32-20-0-20"
                                          align="center"
                                          valign="middle"
                                          background="https://cloudfilesdm.com/postcards/image-17332368911451-77eb7fc2.png"
                                          style="
                                            padding: 10px 0 0 32px;
                                            mso-padding-left-alt: 0;
                                            margin-left: 32px;
                                            height: auto;
                                            background-image: url(&quot;https://cloudfilesdm.com/postcards/image-17332368911451-77eb7fc2.png&quot;);
                                            background-size: cover;
                                            background-position: 50% 0;
                                            background-repeat: no-repeat;
                                            background-color: #1b1b1b;
                                            border-radius: 6px 6px 0 0;
                                            border-top: 3px solid #ffc727;
                                          "
                                        >
                                          <table
                                            width="100%"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                          >
                                            <tr>
                                              <td align="center" valign="top">
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td
                                                      class="pc-w620-valign-top pc-w620-halign-center"
                                                    >
                                                      <table
                                                        class="pc-width-fill pc-g-b pc-w620-halign-center"
                                                        width="100%"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                      >
                                                        <tbody class="pc-g-b">
                                                          <tr
                                                            class="pc-g-b pc-g-wf"
                                                          >
                                                            <td
                                                              class="pc-g-rb pc-g-rpt pc-g-wf pc-w620-itemsVSpacings-20"
                                                              align="left"
                                                              valign="middle"
                                                              style="
                                                                width: 50%;
                                                                padding-top: 0;
                                                                padding-bottom: 0;
                                                              "
                                                            >
                                                              <table
                                                                class="pc-w620-halign-center"
                                                                style="
                                                                  width: 100%;
                                                                "
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                role="presentation"
                                                              >
                                                                <tr>
                                                                  <td
                                                                    class="pc-w620-padding-0-0-0-0 pc-w620-halign-center pc-w620-valign-top"
                                                                    align="left"
                                                                    valign="middle"
                                                                    style="
                                                                      padding: 0
                                                                        0 20px;
                                                                      height: auto;
                                                                    "
                                                                  >
                                                                    <table
                                                                      class="pc-w620-halign-center"
                                                                      width="100%"
                                                                      border="0"
                                                                      cellpadding="0"
                                                                      cellspacing="0"
                                                                      role="presentation"
                                                                    >
                                                                      <tr>
                                                                        <td
                                                                          class="pc-w620-halign-center"
                                                                          align="left"
                                                                          valign="top"
                                                                        >
                                                                          <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            role="presentation"
                                                                            class="pc-w620-halign-center"
                                                                            align="left"
                                                                          >
                                                                            <tr>
                                                                              <td
                                                                                valign="top"
                                                                                align="left"
                                                                              >
                                                                                <div
                                                                                  class="pc-font-alt"
                                                                                  style="
                                                                                    text-decoration: none;
                                                                                  "
                                                                                >
                                                                                  <div
                                                                                    style="
                                                                                      text-align: left;
                                                                                      text-align-last: left;
                                                                                      font-family:
                                                                                        &quot;DM Sans&quot;,
                                                                                        Arial,
                                                                                        Helvetica,
                                                                                        sans-serif;
                                                                                      font-size: 44px;
                                                                                      line-height: 50px;
                                                                                    "
                                                                                    class="pc-w620-text-align-center pc-w620-font-size-40px pc-w620-line-height-100pc"
                                                                                  >
                                                                                    <span
                                                                                      style="
                                                                                        font-family:
                                                                                          &quot;DM Sans&quot;,
                                                                                          Arial,
                                                                                          Helvetica,
                                                                                          sans-serif;
                                                                                        color: rgb(
                                                                                          20,
                                                                                          20,
                                                                                          20
                                                                                        );
                                                                                        font-size: 44px;
                                                                                        line-height: 50px;
                                                                                        letter-spacing: -0.5px;
                                                                                        font-weight: 700;
                                                                                        font-style: normal;
                                                                                      "
                                                                                      >${title}</span
                                                                                    >
                                                                                  </div>
                                                                                </div>
                                                                              </td>
                                                                            </tr>
                                                                          </table>
                                                                        </td>
                                                                      </tr>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                            <td
                                                              class="pc-g-rb pc-g-rpb pc-g-wf pc-w620-itemsVSpacings-20"
                                                              align="left"
                                                              valign="middle"
                                                              style="
                                                                width: 50%;
                                                                padding-top: 0;
                                                                padding-bottom: 0;
                                                              "
                                                            >
                                                              <table
                                                                class="pc-w620-halign-center"
                                                                style="
                                                                  width: 300px;
                                                                "
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                role="presentation"
                                                              >
                                                                <tr>
                                                                  <td
                                                                    class="pc-w620-halign-center pc-w620-valign-top"
                                                                    align="left"
                                                                    valign="middle"
                                                                  >
                                                                    <table
                                                                      class="pc-w620-halign-center"
                                                                      width="100%"
                                                                      border="0"
                                                                      cellpadding="0"
                                                                      cellspacing="0"
                                                                      role="presentation"
                                                                    >
                                                                      <tr>
                                                                        <td
                                                                          class="pc-w620-halign-center"
                                                                          align="left"
                                                                          valign="top"
                                                                          style="
                                                                            line-height: 1px;
                                                                            font-size: 1px;
                                                                          "
                                                                        >
                                                                          <table
                                                                            width="100%"
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            role="presentation"
                                                                          >
                                                                            <tr>
                                                                              <td
                                                                                class="pc-w620-halign-center"
                                                                                align="left"
                                                                                valign="top"
                                                                              >
                                                                                <img
                                                                                  src="https://cloudfilesdm.com/postcards/image-1737475969934-ed47b1cf.png"
                                                                                  class="pc-w620-width-84pc pc-w620-align-center"
                                                                                  style="
                                                                                    display: block;
                                                                                    outline: 0;
                                                                                    line-height: 100%;
                                                                                    -ms-interpolation-mode: bicubic;
                                                                                    width: 100%;
                                                                                    height: auto;
                                                                                    border: 0;
                                                                                  "
                                                                                  width="300"
                                                                                  alt=""
                                                                                />
                                                                              </td>
                                                                            </tr>
                                                                          </table>
                                                                        </td>
                                                                      </tr>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <table
                              class="pc-width-fill"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                            >
                              <tbody>
                                <tr>
                                  <td
                                    class="pc-g-rpt pc-g-rpb"
                                    align="center"
                                    valign="top"
                                    style="padding-top: 0; padding-bottom: 0"
                                  >
                                    <table
                                      style="
                                        border-collapse: separate;
                                        border-spacing: 0;
                                        width: 100%;
                                      "
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                    >
                                      <tr>
                                        <td
                                          class="pc-w620-padding-40-20-40-20"
                                          align="center"
                                          valign="middle"
                                          style="
                                            padding: 32px 32px 40px;
                                            mso-padding-left-alt: 0;
                                            margin-left: 32px;
                                            height: auto;
                                            background-color: #fff;
                                            border-radius: 0 0 8px 8px;
                                          "
                                        >
                                          <table
                                            width="100%"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                          >
                                            <tr>
                                              <td align="center" valign="top">
                                                <table
                                                  width="100%"
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td
                                                      valign="top"
                                                      style="
                                                        padding: 0 0 20px;
                                                        height: auto;
                                                      "
                                                    >
                                                      <table
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                        width="100%"
                                                        align="left"
                                                      >
                                                        <tr>
                                                          <td
                                                            valign="top"
                                                            align="left"
                                                          >
                                                            <div
                                                              class="pc-font-alt"
                                                              style="
                                                                text-decoration: none;
                                                              "
                                                            >
                                                              <div
                                                                style="
                                                                  text-align: left;
                                                                  text-align-last: left;
                                                                  font-family:
                                                                    &quot;DM Sans&quot;,
                                                                    Arial,
                                                                    Helvetica,
                                                                    sans-serif;
                                                                  font-size: 20px;
                                                                  line-height: 30px;
                                                                "
                                                              >
                                                                <span
                                                                  style="
                                                                    font-family:
                                                                      &quot;DM Sans&quot;,
                                                                      Arial,
                                                                      Helvetica,
                                                                      sans-serif;
                                                                    color: rgb(
                                                                      118,
                                                                      118,
                                                                      118
                                                                    );
                                                                    font-size: 20px;
                                                                    line-height: 30px;
                                                                    letter-spacing: 0;
                                                                    font-weight: 400;
                                                                    font-style: normal;
                                                                  "
                                                                  class="pc-w620-font-size-18px pc-w620-line-height-26px"
                                                                  >Hi ${name}
                                                                  👋,</span
                                                                ><br /><span
                                                                  style="
                                                                    font-family:
                                                                      &quot;DM Sans&quot;,
                                                                      Arial,
                                                                      Helvetica,
                                                                      sans-serif;
                                                                    color: rgb(
                                                                      118,
                                                                      118,
                                                                      118
                                                                    );
                                                                    font-size: 20px;
                                                                    line-height: 30px;
                                                                    letter-spacing: 0;
                                                                    font-weight: 400;
                                                                    font-style: normal;
                                                                  "
                                                                  class="pc-w620-font-size-18px pc-w620-line-height-26px"
                                                                  >Your one-time
                                                                  key is:</span
                                                                >
                                                              </div>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align="center" valign="top">
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td
                                                      class="pc-w620-spacing-0-0-20-0"
                                                      style="padding: 0 0 40px"
                                                    >
                                                      <table
                                                        class="pc-width-fill pc-g-b"
                                                        width="100%"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                      >
                                                        <tbody class="pc-g-b">
                                                          <tr
                                                            class="pc-g-b pc-g-wf"
                                                          >
                                                            <td
                                                              class="pc-g-rb pc-g-rpt pc-g-rpb pc-g-wf pc-w620-itemsVSpacings-30"
                                                              align="center"
                                                              valign="middle"
                                                              style="
                                                                padding-top: 0;
                                                                padding-bottom: 0;
                                                              "
                                                            >
                                                              <table
                                                                style="
                                                                  width: 100%;
                                                                "
                                                                border="0"
                                                                cellpadding="0"
                                                                cellspacing="0"
                                                                role="presentation"
                                                              >
                                                                <tr>
                                                                  <td
                                                                    class="pc-w620-padding-18-20-18-20"
                                                                    align="center"
                                                                    valign="middle"
                                                                    style="
                                                                      padding: 20px
                                                                        24px;
                                                                      mso-padding-left-alt: 0;
                                                                      margin-left: 24px;
                                                                      height: auto;
                                                                      background-color: #f7f7f7;
                                                                      border-radius: 12px
                                                                        12px
                                                                        12px
                                                                        12px;
                                                                    "
                                                                  >
                                                                    <table
                                                                      width="100%"
                                                                      border="0"
                                                                      cellpadding="0"
                                                                      cellspacing="0"
                                                                      role="presentation"
                                                                    >
                                                                      <tr>
                                                                        <td
                                                                          align="center"
                                                                          valign="top"
                                                                        >
                                                                          <table
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            role="presentation"
                                                                            align="center"
                                                                          >
                                                                            <tr>
                                                                              <td
                                                                                valign="top"
                                                                                align="center"
                                                                              >
                                                                                <div
                                                                                  class="pc-font-alt"
                                                                                  style="
                                                                                    text-decoration: none;
                                                                                  "
                                                                                >
                                                                                  <div
                                                                                    style="
                                                                                      text-align: center;
                                                                                      text-align-last: center;
                                                                                      font-family:
                                                                                        &quot;DM Sans&quot;,
                                                                                        Arial,
                                                                                        Helvetica,
                                                                                        sans-serif;
                                                                                      font-size: 40px;
                                                                                      line-height: 50px;
                                                                                    "
                                                                                    class="pc-w620-font-size-32px"
                                                                                  >
                                                                                    <span
                                                                                      style="
                                                                                        font-family:
                                                                                          &quot;DM Sans&quot;,
                                                                                          Arial,
                                                                                          Helvetica,
                                                                                          sans-serif;
                                                                                        color: rgb(
                                                                                          20,
                                                                                          20,
                                                                                          20
                                                                                        );
                                                                                        font-size: 40px;
                                                                                        line-height: 50px;
                                                                                        letter-spacing: 15px;
                                                                                        font-weight: 800;
                                                                                        font-style: normal;
                                                                                      "
                                                                                      >${key}</span
                                                                                    >
                                                                                  </div>
                                                                                </div>
                                                                              </td>
                                                                            </tr>
                                                                          </table>
                                                                        </td>
                                                                      </tr>
                                                                    </table>
                                                                  </td>
                                                                </tr>
                                                              </table>
                                                            </td>
                                                          </tr>
                                                        </tbody>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align="center" valign="top">
                                                <table
                                                  width="100%"
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td valign="top">
                                                      <table
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                        width="100%"
                                                        align="left"
                                                      >
                                                        <tr>
                                                          <td
                                                            valign="top"
                                                            align="left"
                                                          >
                                                            <div
                                                              class="pc-font-alt"
                                                              style="
                                                                text-decoration: none;
                                                              "
                                                            >
                                                              <div
                                                                style="
                                                                  text-align: left;
                                                                  text-align-last: left;
                                                                  font-family:
                                                                    &quot;DM Sans&quot;,
                                                                    Arial,
                                                                    Helvetica,
                                                                    sans-serif;
                                                                  font-size: 20px;
                                                                  line-height: 30px;
                                                                "
                                                                class="pc-w620-font-size-18px pc-w620-line-height-26px"
                                                              >
                                                                <span
                                                                  style="
                                                                    font-family:
                                                                      &quot;DM Sans&quot;,
                                                                      Arial,
                                                                      Helvetica,
                                                                      sans-serif;
                                                                    color: rgb(
                                                                      118,
                                                                      118,
                                                                      118
                                                                    );
                                                                    font-size: 20px;
                                                                    line-height: 30px;
                                                                    letter-spacing: 0;
                                                                    font-weight: 400;
                                                                    font-style: normal;
                                                                  "
                                                                  class="pc-w620-font-size-18px"
                                                                  >This code is
                                                                  valid for the
                                                                  next&nbsp;7
                                                                  days. Please
                                                                  use it to
                                                                  complete your
                                                                  verification
                                                                  process.</span
                                                                >
                                                              </div>
                                                              <div
                                                                style="
                                                                  text-align: left;
                                                                  text-align-last: left;
                                                                  font-family:
                                                                    &quot;DM Sans&quot;,
                                                                    Arial,
                                                                    Helvetica,
                                                                    sans-serif;
                                                                  font-size: 20px;
                                                                  line-height: 30px;
                                                                "
                                                              >
                                                                <br /><span
                                                                  style="
                                                                    font-family:
                                                                      &quot;DM Sans&quot;,
                                                                      Arial,
                                                                      Helvetica,
                                                                      sans-serif;
                                                                    color: rgb(
                                                                      118,
                                                                      118,
                                                                      118
                                                                    );
                                                                    font-size: 20px;
                                                                    line-height: 30px;
                                                                    letter-spacing: 0;
                                                                    font-weight: 400;
                                                                    font-style: normal;
                                                                  "
                                                                  class="pc-w620-font-size-18px pc-w620-line-height-26px"
                                                                  >For security
                                                                  purposes,
                                                                  never share
                                                                  this code with
                                                                  anyone. If you
                                                                  didn’t request
                                                                  this, please
                                                                  contact our
                                                                  support team
                                                                  immediately.</span
                                                                >
                                                              </div>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            <!--[if gte mso 9]></td><td width="16" style="line-height:1px;font-size:1px" valign="top">&nbsp;</td></tr><tr><td colspan="3" height="0" style="line-height:1px;font-size:1px">&nbsp;</td></tr></table></td></tr></table></div><p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p></v:textbox></v:rect><![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  class="pc-component"
                  style="width: 600px; max-width: 600px"
                  width="600"
                  align="center"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  role="presentation"
                >
                  <tr>
                    <td
                      class="pc-w620-spacing-0-0-0-0"
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      role="presentation"
                    >
                      <table
                        width="100%"
                        align="center"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        role="presentation"
                      >
                        <tr>
                          <td
                            valign="top"
                            class="pc-w620-padding-16-16-16-16"
                            style="
                              padding: 16px 16px 8px;
                              height: unset;
                              background-color: #f3f3f3;
                            "
                            bgcolor="#f3f3f3"
                          >
                            <table
                              class="pc-width-fill pc-g-b"
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                            >
                              <tbody class="pc-g-b">
                                <tr class="pc-g-b pc-g-wf">
                                  <td
                                    class="pc-g-rb pc-g-rpt pc-g-rpb pc-g-wf pc-w620-itemsVSpacings-30"
                                    align="left"
                                    valign="top"
                                    style="
                                      width: 100%;
                                      padding-top: 0;
                                      padding-bottom: 0;
                                    "
                                  >
                                    <table
                                      style="
                                        border-collapse: separate;
                                        border-spacing: 0;
                                        width: 100%;
                                      "
                                      border="0"
                                      cellpadding="0"
                                      cellspacing="0"
                                      role="presentation"
                                    >
                                      <tr>
                                        <!--[if !gte mso 9]><!-- -->
                                        <td
                                          class="pc-w620-padding-24-20-24-20"
                                          align="center"
                                          valign="middle"
                                          background="https://cloudfilesdm.com/postcards/image-1736553128092-bc449842.jpg"
                                          style="
                                            padding: 32px 25px;
                                            height: auto;
                                            background-image: url(&quot;https://cloudfilesdm.com/postcards/image-1736553128092-bc449842.jpg&quot;);
                                            background-size: cover;
                                            background-position: 50% 0;
                                            background-repeat: no-repeat;
                                            border-radius: 8px 8px 8px 8px;
                                            border-top: 1px solid #e9e1c8;
                                            border-right: 1px solid #e9e1c8;
                                            border-bottom: 1px solid #e9e1c8;
                                            border-left: 1px solid #e9e1c8;
                                          "
                                        >
                                          <!--<![endif]-->
                                          <!--[if gte mso 9]><td class="pc-w620-padding-24-20-24-20" align="center" valign="middle" background="https://cloudfilesdm.com/postcards/image-1736553128092-bc449842.jpg" style="background-image:url('https://cloudfilesdm.com/postcards/image-1736553128092-bc449842.jpg');background-size:cover;background-position:50% 0;background-repeat:no-repeat;border-radius:8px 8px 8px 8px;border-top:1px solid #e9e1c8;border-right:1px solid #e9e1c8;border-bottom:1px solid #e9e1c8;border-left:1px solid #e9e1c8"><![endif]-->
                                          <!--[if gte mso 9]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:566px"><v:fill src="https://cloudfilesdm.com/postcards/image-1736553128092-bc449842.jpg" type="frame" size="1,1" aspect="atleast" origin="-0.5,-0.5" position="-0.5,-0.5"/><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><div style="font-size:0;line-height:0"><table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" align="center"><tr><td style="font-size:14px;line-height:1.5" valign="top"><p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p><table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation"><tr><td colspan="3" height="32" style="line-height:1px;font-size:1px">&nbsp;</td></tr><tr><td width="25" valign="top" style="line-height:1px;font-size:1px">&nbsp;</td><td valign="top" align="left"><![endif]-->
                                          <table
                                            width="100%"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                          >
                                            <tr>
                                              <td align="center" valign="top">
                                                <table
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td
                                                      class="pc-w620-spacing-0-0-8-0"
                                                      valign="top"
                                                      style="
                                                        padding: 0 80px 8px;
                                                        mso-padding-left-alt: 0;
                                                        margin-left: 80px;
                                                        height: auto;
                                                      "
                                                    >
                                                      <table
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                        width="100%"
                                                      >
                                                        <tr>
                                                          <td
                                                            valign="top"
                                                            align="center"
                                                          >
                                                            <div
                                                              class="pc-font-alt"
                                                              style="
                                                                text-decoration: none;
                                                              "
                                                            >
                                                              <div
                                                                style="
                                                                  text-align: center;
                                                                  text-align-last: center;
                                                                  font-family:
                                                                    &quot;DM Sans&quot;,
                                                                    Arial,
                                                                    Helvetica,
                                                                    sans-serif;
                                                                  font-size: 32px;
                                                                  line-height: 40px;
                                                                "
                                                                class="pc-w620-line-height-36px"
                                                              >
                                                                <span
                                                                  style="
                                                                    font-family:
                                                                      &quot;DM Sans&quot;,
                                                                      Arial,
                                                                      Helvetica,
                                                                      sans-serif;
                                                                    color: rgb(
                                                                      20,
                                                                      20,
                                                                      20
                                                                    );
                                                                    font-size: 32px;
                                                                    line-height: 40px;
                                                                    letter-spacing: 0;
                                                                    font-weight: 700;
                                                                    font-style: normal;
                                                                  "
                                                                  >Thank you for
                                                                  choosing </span
                                                                ><span
                                                                  style="
                                                                    font-family:
                                                                      &quot;DM Sans&quot;,
                                                                      Arial,
                                                                      Helvetica,
                                                                      sans-serif;
                                                                    color: rgb(
                                                                      207,
                                                                      160,
                                                                      23
                                                                    );
                                                                    font-size: 32px;
                                                                    line-height: 40px;
                                                                    letter-spacing: 0;
                                                                    font-weight: 700;
                                                                    font-style: normal;
                                                                  "
                                                                  >Binex</span
                                                                >
                                                              </div>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                            <tr>
                                              <td align="center" valign="top">
                                                <table
                                                  align="center"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td
                                                      class="pc-w620-spacing-0-0-0-0"
                                                      valign="top"
                                                      style="
                                                        padding: 0 100px;
                                                        mso-padding-left-alt: 0;
                                                        margin-left: 100px;
                                                        height: auto;
                                                      "
                                                    >
                                                      <table
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                        width="100%"
                                                      >
                                                        <tr>
                                                          <td
                                                            valign="top"
                                                            align="center"
                                                          >
                                                            <div
                                                              class="pc-font-alt"
                                                              style="
                                                                text-decoration: none;
                                                              "
                                                            >
                                                              <div
                                                                style="
                                                                  text-align: center;
                                                                  text-align-last: center;
                                                                  font-family:
                                                                    &quot;DM Sans&quot;,
                                                                    Arial,
                                                                    Helvetica,
                                                                    sans-serif;
                                                                  font-size: 20px;
                                                                  line-height: 30px;
                                                                "
                                                                class="pc-w620-font-size-16px pc-w620-line-height-24px"
                                                              >
                                                                <span
                                                                  style="
                                                                    font-family:
                                                                      &quot;DM Sans&quot;,
                                                                      Arial,
                                                                      Helvetica,
                                                                      sans-serif;
                                                                    color: rgb(
                                                                      118,
                                                                      118,
                                                                      118
                                                                    );
                                                                    font-size: 20px;
                                                                    line-height: 30px;
                                                                    letter-spacing: 0;
                                                                    font-weight: 400;
                                                                    font-style: normal;
                                                                  "
                                                                  class="pc-w620-font-size-16px"
                                                                  >If you have
                                                                  questions,
                                                                  feel free to
                                                                  reply to this
                                                                  email or visit
                                                                  our</span
                                                                >
                                                              </div>
                                                              <div
                                                                style="
                                                                  text-align: center;
                                                                  text-align-last: center;
                                                                  font-family:
                                                                    &quot;DM Sans&quot;,
                                                                    Arial,
                                                                    Helvetica,
                                                                    sans-serif;
                                                                  font-size: 20px;
                                                                  line-height: 30px;
                                                                "
                                                              >
                                                                <span
                                                                  style="
                                                                    font-family:
                                                                      &quot;DM Sans&quot;,
                                                                      Arial,
                                                                      Helvetica,
                                                                      sans-serif;
                                                                    color: rgb(
                                                                      118,
                                                                      118,
                                                                      118
                                                                    );
                                                                    font-size: 20px;
                                                                    line-height: 30px;
                                                                    letter-spacing: 0;
                                                                    font-weight: 400;
                                                                    font-style: normal;
                                                                  "
                                                                  class="pc-w620-font-size-16px pc-w620-line-height-24px"
                                                                >
                                                                </span
                                                                ><a
                                                                  href="https://postcards.email/"
                                                                  target="_blank"
                                                                  rel="noreferrer"
                                                                  style="
                                                                    text-decoration: none;
                                                                    color: inherit;
                                                                  "
                                                                  ><span
                                                                    style="
                                                                      font-family:
                                                                        &quot;DM Sans&quot;,
                                                                        Arial,
                                                                        Helvetica,
                                                                        sans-serif;
                                                                      color: rgb(
                                                                        20,
                                                                        20,
                                                                        20
                                                                      );
                                                                      font-size: 20px;
                                                                      line-height: 30px;
                                                                      letter-spacing: 0;
                                                                      font-weight: 600;
                                                                      text-decoration: underline;
                                                                    "
                                                                    class="pc-w620-font-size-16px pc-w620-line-height-24px"
                                                                    >Customer
                                                                    support</span
                                                                  ></a
                                                                ><span
                                                                  style="
                                                                    font-family:
                                                                      &quot;DM Sans&quot;,
                                                                      Arial,
                                                                      Helvetica,
                                                                      sans-serif;
                                                                    color: rgb(
                                                                      20,
                                                                      20,
                                                                      20
                                                                    );
                                                                    font-size: 20px;
                                                                    line-height: 30px;
                                                                    letter-spacing: 0;
                                                                    font-weight: 600;
                                                                    font-style: normal;
                                                                  "
                                                                  class="pc-w620-font-size-16px pc-w620-line-height-24px"
                                                                  >.</span
                                                                >
                                                              </div>
                                                            </div>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                          <!--[if gte mso 9]></td><td width="25" style="line-height:1px;font-size:1px" valign="top">&nbsp;</td></tr><tr><td colspan="3" height="32" style="line-height:1px;font-size:1px">&nbsp;</td></tr></table></td></tr></table></div><p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p></v:textbox></v:rect><![endif]-->
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  class="pc-component"
                  style="width: 600px; max-width: 600px"
                  width="600"
                  align="center"
                  border="0"
                  cellspacing="0"
                  cellpadding="0"
                  role="presentation"
                >
                  <tr>
                    <td
                      class="pc-w620-spacing-0-0-0-0"
                      width="100%"
                      border="0"
                      cellspacing="0"
                      cellpadding="0"
                      role="presentation"
                    >
                      <table
                        width="100%"
                        align="center"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                        role="presentation"
                      >
                        <tr>
                          <!--[if !gte mso 9]><!-- -->
                          <td
                            valign="top"
                            class="pc-w620-padding-20-20-30-20"
                            style="
                              background-image: url(&quot;https://cloudfilesdm.com/postcards/image-17332368943239-171d7287.png&quot;);
                              background-size: cover;
                              background-position: center;
                              background-repeat: no-repeat;
                              padding: 48px;
                              height: unset;
                              background-color: #fff;
                            "
                            bgcolor="#ffffff"
                            background="https://cloudfilesdm.com/postcards/image-17332368943239-171d7287.png"
                          >
                            <!--<![endif]-->
                            <!--[if gte mso 9]><td valign="top" align="center" style="background-image:url('https://cloudfilesdm.com/postcards/image-17332368943239-171d7287.png');background-size:cover;background-position:center;background-repeat:no-repeat;background-color:#fff;border-radius:0" bgcolor="#ffffff" background="https://cloudfilesdm.com/postcards/image-17332368943239-171d7287.png"><![endif]-->
                            <!--[if gte mso 9]><v:rect xmlns:v="urn:schemas-microsoft-com:vml" fill="true" stroke="false" style="width:600px"><v:fill src="https://cloudfilesdm.com/postcards/image-17332368943239-171d7287.png" color="#ffffff" type="frame" size="1,1" aspect="atleast" origin="0,0" position="0,0"/><v:textbox style="mso-fit-shape-to-text:true" inset="0,0,0,0"><div style="font-size:0;line-height:0"><table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation"><tr><td style="font-size:14px;line-height:1.5" valign="top"><p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p><table width="100%" border="0" cellspacing="0" cellpadding="0" role="presentation"><tr><td colspan="3" height="48" style="line-height:1px;font-size:1px">&nbsp;</td></tr><tr><td width="48" valign="top" style="line-height:1px;font-size:1px">&nbsp;</td><td valign="top" align="left"><![endif]-->
                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                            >
                              <tr>
                                <td
                                  class="pc-w620-spacing-0-0-20-0"
                                  style="padding: 0 0 32px"
                                >
                                  <table
                                    class="pc-width-fill pc-g-b"
                                    width="100%"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                  >
                                    <tbody class="pc-g-b">
                                      <tr class="pc-g-b pc-g-wf">
                                        <td
                                          class="pc-g-rb pc-g-rpt pc-g-wf pc-w620-itemsVSpacings-16"
                                          align="right"
                                          valign="middle"
                                          style="
                                            width: 50%;
                                            padding-top: 0;
                                            padding-bottom: 0;
                                          "
                                        >
                                          <table
                                            class="pc-w620-width-fill"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                          >
                                            <tr>
                                              <td
                                                class="pc-w620-halign-center pc-w620-valign-top"
                                                align="left"
                                                valign="middle"
                                              >
                                                <table
                                                  class="pc-w620-halign-center"
                                                  width="100%"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td
                                                      class="pc-w620-halign-center"
                                                      align="left"
                                                      valign="top"
                                                      style="
                                                        line-height: 1px;
                                                        font-size: 1px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                      >
                                                        <tr>
                                                          <td
                                                            class="pc-w620-halign-center"
                                                            align="left"
                                                            valign="top"
                                                            style="
                                                              padding: 0 0 16px;
                                                              height: auto;
                                                            "
                                                          >
                                                            <img
                                                              src="https://cloudfilesdm.com/postcards/ChatGPT_Image_13_05_23_4_thg_5_2026-61bfd000.png"
                                                              class="pc-w620-width-110 pc-w620-height-auto pc-w620-align-center"
                                                              style="
                                                                display: block;
                                                                outline: 0;
                                                                line-height: 100%;
                                                                -ms-interpolation-mode: bicubic;
                                                                width: 126px;
                                                                height: auto;
                                                                max-width: 100%;
                                                                border: 0;
                                                              "
                                                              width="126"
                                                              height="78"
                                                              alt=""
                                                            />
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                    <td
                                                      class="pc-w620-halign-center"
                                                      align="left"
                                                      valign="top"
                                                    >
                                                      <table
                                                        class="pc-w620-halign-center"
                                                        align="left"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                      >
                                                        <tr>
                                                          <td
                                                            class="pc-w620-valign-top pc-w620-halign-center"
                                                            align="left"
                                                          >
                                                            <table
                                                              class="pc-w620-halign-center pc-w620-width-hug"
                                                              align="left"
                                                              border="0"
                                                              cellpadding="0"
                                                              cellspacing="0"
                                                              role="presentation"
                                                            >
                                                              <tr>
                                                                <td
                                                                  style="
                                                                    width: unset;
                                                                  "
                                                                  valign="top"
                                                                >
                                                                  <table
                                                                    class="pc-width-hug pc-w620-width-hug pc-w620-halign-center"
                                                                    align="left"
                                                                    border="0"
                                                                    cellpadding="0"
                                                                    cellspacing="0"
                                                                    role="presentation"
                                                                  >
                                                                    <tbody>
                                                                      <tr>
                                                                        <td
                                                                          class="pc-g-rpt pc-g-rpb pc-w620-itemsVSpacings-30"
                                                                          valign="middle"
                                                                          style="
                                                                            padding-top: 0;
                                                                            padding-bottom: 0;
                                                                          "
                                                                        >
                                                                          <table
                                                                            style="
                                                                              width: 100%;
                                                                            "
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            role="presentation"
                                                                          >
                                                                            <tr>
                                                                              <td
                                                                                class="pc-w620-halign-center pc-w620-valign-top"
                                                                                align="left"
                                                                                valign="middle"
                                                                              >
                                                                                <table
                                                                                  class="pc-w620-halign-center"
                                                                                  width="100%"
                                                                                  border="0"
                                                                                  cellpadding="0"
                                                                                  cellspacing="0"
                                                                                  role="presentation"
                                                                                >
                                                                                  <tr>
                                                                                    <td
                                                                                      class="pc-w620-halign-center"
                                                                                      align="left"
                                                                                      valign="top"
                                                                                      style="
                                                                                        line-height: 1px;
                                                                                        font-size: 1px;
                                                                                      "
                                                                                    >
                                                                                      <table
                                                                                        width="100%"
                                                                                        border="0"
                                                                                        cellpadding="0"
                                                                                        cellspacing="0"
                                                                                        role="presentation"
                                                                                      >
                                                                                        <tr>
                                                                                          <td
                                                                                            class="pc-w620-halign-center"
                                                                                            align="left"
                                                                                            valign="top"
                                                                                          >
                                                                                            <a
                                                                                              class="pc-font-alt"
                                                                                              href="https://postcards.email/"
                                                                                              target="_blank"
                                                                                              style="
                                                                                                text-decoration: none;
                                                                                              "
                                                                                              ><img
                                                                                                src="https://cloudfilesdm.com/postcards/image-17332368937027-d727fc95.png"
                                                                                                class="pc-w620-width-110 pc-w620-height-auto pc-w620-align-center"
                                                                                                style="
                                                                                                  display: block;
                                                                                                  outline: 0;
                                                                                                  line-height: 100%;
                                                                                                  -ms-interpolation-mode: bicubic;
                                                                                                  width: 100%;
                                                                                                  height: auto;
                                                                                                  border: 0;
                                                                                                "
                                                                                                width="104"
                                                                                                height="auto"
                                                                                                alt=""
                                                                                            /></a>
                                                                                          </td>
                                                                                        </tr>
                                                                                      </table>
                                                                                    </td>
                                                                                  </tr>
                                                                                </table>
                                                                              </td>
                                                                            </tr>
                                                                          </table>
                                                                        </td>
                                                                        <td
                                                                          class="pc-w620-itemsHSpacings-8"
                                                                          valign="middle"
                                                                          style="
                                                                            padding-right: 4px;
                                                                            padding-left: 4px;
                                                                            mso-padding-left-alt: 0;
                                                                            margin-left: 4px;
                                                                          "
                                                                        ></td>
                                                                        <td
                                                                          class="pc-g-rpt pc-g-rpb pc-w620-itemsVSpacings-30"
                                                                          valign="middle"
                                                                          style="
                                                                            padding-top: 0;
                                                                            padding-bottom: 0;
                                                                          "
                                                                        >
                                                                          <table
                                                                            class="pc-w620-width-fill"
                                                                            style="
                                                                              width: 100%;
                                                                            "
                                                                            border="0"
                                                                            cellpadding="0"
                                                                            cellspacing="0"
                                                                            role="presentation"
                                                                          >
                                                                            <tr>
                                                                              <td
                                                                                class="pc-w620-halign-center pc-w620-valign-top"
                                                                                align="left"
                                                                                valign="middle"
                                                                              >
                                                                                <table
                                                                                  class="pc-w620-halign-center"
                                                                                  width="100%"
                                                                                  border="0"
                                                                                  cellpadding="0"
                                                                                  cellspacing="0"
                                                                                  role="presentation"
                                                                                >
                                                                                  <tr>
                                                                                    <td
                                                                                      class="pc-w620-halign-center"
                                                                                      align="left"
                                                                                      valign="top"
                                                                                      style="
                                                                                        line-height: 1px;
                                                                                        font-size: 1px;
                                                                                      "
                                                                                    >
                                                                                      <table
                                                                                        width="100%"
                                                                                        border="0"
                                                                                        cellpadding="0"
                                                                                        cellspacing="0"
                                                                                        role="presentation"
                                                                                      >
                                                                                        <tr>
                                                                                          <td
                                                                                            class="pc-w620-halign-center"
                                                                                            align="left"
                                                                                            valign="top"
                                                                                          >
                                                                                            <a
                                                                                              class="pc-font-alt"
                                                                                              href="https://postcards.email/"
                                                                                              target="_blank"
                                                                                              style="
                                                                                                text-decoration: none;
                                                                                              "
                                                                                              ><img
                                                                                                src="https://cloudfilesdm.com/postcards/image-17332368940158-151829a6.png"
                                                                                                class="pc-w620-width-110 pc-w620-height-auto pc-w620-align-center"
                                                                                                style="
                                                                                                  display: block;
                                                                                                  outline: 0;
                                                                                                  line-height: 100%;
                                                                                                  -ms-interpolation-mode: bicubic;
                                                                                                  width: 100%;
                                                                                                  height: auto;
                                                                                                  border: 0;
                                                                                                "
                                                                                                width="104"
                                                                                                height="auto"
                                                                                                alt=""
                                                                                            /></a>
                                                                                          </td>
                                                                                        </tr>
                                                                                      </table>
                                                                                    </td>
                                                                                  </tr>
                                                                                </table>
                                                                              </td>
                                                                            </tr>
                                                                          </table>
                                                                        </td>
                                                                      </tr>
                                                                    </tbody>
                                                                  </table>
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                        <td
                                          class="pc-w620-itemsHSpacings-0"
                                          valign="middle"
                                          style="
                                            padding-right: 23.5px;
                                            padding-left: 23.5px;
                                            mso-padding-left-alt: 0;
                                            margin-left: 23.5px;
                                          "
                                        ></td>
                                        <td
                                          class="pc-g-rb pc-g-rpb pc-g-wf pc-w620-itemsVSpacings-16"
                                          align="right"
                                          valign="middle"
                                          style="
                                            width: 50%;
                                            padding-top: 0;
                                            padding-bottom: 0;
                                          "
                                        >
                                          <table
                                            class="pc-w620-width-fill"
                                            style="width: 180px"
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                          >
                                            <tr>
                                              <td align="right" valign="middle">
                                                <table
                                                  width="100%"
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td
                                                      align="right"
                                                      valign="top"
                                                    >
                                                      <table
                                                        align="right"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                      >
                                                        <tr>
                                                          <td
                                                            class="pc-w620-spacing-0-8-0-8"
                                                            valign="top"
                                                          >
                                                            <table
                                                              border="0"
                                                              cellpadding="0"
                                                              cellspacing="0"
                                                              role="presentation"
                                                              width="100%"
                                                            >
                                                              <tr>
                                                                <td
                                                                  valign="top"
                                                                  align="left"
                                                                >
                                                                  <div
                                                                    class="pc-font-alt"
                                                                    style="
                                                                      text-decoration: none;
                                                                    "
                                                                  >
                                                                    <div
                                                                      style="
                                                                        text-align: left;
                                                                        text-align-last: left;
                                                                        font-family:
                                                                          &quot;DM Sans&quot;,
                                                                          Arial,
                                                                          Helvetica,
                                                                          sans-serif;
                                                                        font-size: 14px;
                                                                        line-height: 140%;
                                                                      "
                                                                      class="pc-w620-text-align-center"
                                                                    >
                                                                      <span
                                                                        style="
                                                                          font-family:
                                                                            &quot;DM Sans&quot;,
                                                                            Arial,
                                                                            Helvetica,
                                                                            sans-serif;
                                                                          color: rgb(
                                                                            20,
                                                                            20,
                                                                            20
                                                                          );
                                                                          font-size: 14px;
                                                                          line-height: 140%;
                                                                          letter-spacing: 0;
                                                                          font-weight: 400;
                                                                          font-style: normal;
                                                                        "
                                                                        >Download
                                                                        Binex
                                                                        App on
                                                                        Play
                                                                        Store
                                                                        and App
                                                                        Store to
                                                                        receive
                                                                        monthly
                                                                        promos
                                                                        and
                                                                        updates.</span
                                                                      >
                                                                    </div>
                                                                  </div>
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                            >
                              <tr>
                                <td
                                  class="pc-w620-spacing-0-0-20-0"
                                  valign="top"
                                  style="padding: 0 0 32px"
                                >
                                  <table
                                    width="100%"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                  >
                                    <tr>
                                      <td
                                        valign="top"
                                        style="
                                          line-height: 1px;
                                          font-size: 1px;
                                          border-bottom: 1px solid #e9e9e9;
                                        "
                                      >
                                        &nbsp;
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                            >
                              <tr>
                                <td align="center" style="padding: 0 0 16px">
                                  <table
                                    align="center"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                  >
                                    <tr>
                                      <td style="width: unset" valign="top">
                                        <table
                                          class="pc-width-hug"
                                          align="center"
                                          border="0"
                                          cellpadding="0"
                                          cellspacing="0"
                                          role="presentation"
                                        >
                                          <tbody>
                                            <tr>
                                              <td
                                                class="pc-g-rpt pc-g-rpb pc-w620-itemsVSpacings-0"
                                                valign="middle"
                                                style="
                                                  padding-top: 0;
                                                  padding-bottom: 0;
                                                "
                                              >
                                                <table
                                                  style="
                                                    border-collapse: separate;
                                                    border-spacing: 0;
                                                  "
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td
                                                      class="pc-w620-padding-0-0-0-0"
                                                      align="center"
                                                      valign="middle"
                                                      style="
                                                        padding: 8px;
                                                        mso-padding-left-alt: 0;
                                                        margin-left: 8px;
                                                        height: auto;
                                                        border-radius: 100px
                                                          100px 100px 100px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                      >
                                                        <tr>
                                                          <td
                                                            align="center"
                                                            valign="top"
                                                            style="
                                                              line-height: 1px;
                                                              font-size: 1px;
                                                            "
                                                          >
                                                            <table
                                                              align="center"
                                                              border="0"
                                                              cellpadding="0"
                                                              cellspacing="0"
                                                              role="presentation"
                                                            >
                                                              <tr>
                                                                <td
                                                                  valign="top"
                                                                >
                                                                  <a
                                                                    class="pc-font-alt"
                                                                    href="https://postcards.email/"
                                                                    target="_blank"
                                                                    style="
                                                                      text-decoration: none;
                                                                      display: inline-block;
                                                                      vertical-align: top;
                                                                    "
                                                                    ><img
                                                                      src="https://cloudfilesdm.com/postcards/0f8a3a3cc20f2945b88a0956fa8773a5.png"
                                                                      style="
                                                                        display: block;
                                                                        border: 0;
                                                                        outline: 0;
                                                                        line-height: 100%;
                                                                        -ms-interpolation-mode: bicubic;
                                                                        width: 18px;
                                                                        height: 18px;
                                                                      "
                                                                      width="18"
                                                                      height="18"
                                                                      alt=""
                                                                  /></a>
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                              <td
                                                class="pc-w620-itemsHSpacings-20"
                                                valign="middle"
                                                style="
                                                  padding-right: 8px;
                                                  padding-left: 8px;
                                                  mso-padding-left-alt: 0;
                                                  margin-left: 8px;
                                                "
                                              ></td>
                                              <td
                                                class="pc-g-rpt pc-g-rpb pc-w620-itemsVSpacings-0"
                                                valign="middle"
                                                style="
                                                  padding-top: 0;
                                                  padding-bottom: 0;
                                                "
                                              >
                                                <table
                                                  style="
                                                    border-collapse: separate;
                                                    border-spacing: 0;
                                                  "
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td
                                                      class="pc-w620-padding-0-0-0-0"
                                                      align="center"
                                                      valign="middle"
                                                      style="
                                                        padding: 8px;
                                                        mso-padding-left-alt: 0;
                                                        margin-left: 8px;
                                                        height: auto;
                                                        border-radius: 100px
                                                          100px 100px 100px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                      >
                                                        <tr>
                                                          <td
                                                            align="center"
                                                            valign="top"
                                                            style="
                                                              line-height: 1px;
                                                              font-size: 1px;
                                                            "
                                                          >
                                                            <table
                                                              align="center"
                                                              border="0"
                                                              cellpadding="0"
                                                              cellspacing="0"
                                                              role="presentation"
                                                            >
                                                              <tr>
                                                                <td
                                                                  valign="top"
                                                                >
                                                                  <a
                                                                    class="pc-font-alt"
                                                                    href="https://www.facebook.com/groups/binex.vn"
                                                                    target="_blank"
                                                                    style="
                                                                      text-decoration: none;
                                                                      display: inline-block;
                                                                      vertical-align: top;
                                                                    "
                                                                    ><img
                                                                      src="https://cloudfilesdm.com/postcards/8bad34d1f358a292aeb02d168f47f7b8.png"
                                                                      style="
                                                                        display: block;
                                                                        border: 0;
                                                                        outline: 0;
                                                                        line-height: 100%;
                                                                        -ms-interpolation-mode: bicubic;
                                                                        width: 20px;
                                                                        height: 20px;
                                                                      "
                                                                      width="20"
                                                                      height="20"
                                                                      alt=""
                                                                  /></a>
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                              <td
                                                class="pc-w620-itemsHSpacings-20"
                                                valign="middle"
                                                style="
                                                  padding-right: 8px;
                                                  padding-left: 8px;
                                                  mso-padding-left-alt: 0;
                                                  margin-left: 8px;
                                                "
                                              ></td>
                                              <td
                                                class="pc-g-rpt pc-g-rpb pc-w620-itemsVSpacings-0"
                                                valign="middle"
                                                style="
                                                  padding-top: 0;
                                                  padding-bottom: 0;
                                                "
                                              >
                                                <table
                                                  style="
                                                    border-collapse: separate;
                                                    border-spacing: 0;
                                                  "
                                                  border="0"
                                                  cellpadding="0"
                                                  cellspacing="0"
                                                  role="presentation"
                                                >
                                                  <tr>
                                                    <td
                                                      class="pc-w620-padding-0-0-0-0"
                                                      align="center"
                                                      valign="middle"
                                                      style="
                                                        padding: 8px;
                                                        mso-padding-left-alt: 0;
                                                        margin-left: 8px;
                                                        height: auto;
                                                        border-radius: 100px
                                                          100px 100px 100px;
                                                      "
                                                    >
                                                      <table
                                                        width="100%"
                                                        border="0"
                                                        cellpadding="0"
                                                        cellspacing="0"
                                                        role="presentation"
                                                      >
                                                        <tr>
                                                          <td
                                                            align="center"
                                                            valign="top"
                                                            style="
                                                              line-height: 1px;
                                                              font-size: 1px;
                                                            "
                                                          >
                                                            <table
                                                              align="center"
                                                              border="0"
                                                              cellpadding="0"
                                                              cellspacing="0"
                                                              role="presentation"
                                                            >
                                                              <tr>
                                                                <td
                                                                  valign="top"
                                                                >
                                                                  <a
                                                                    class="pc-font-alt"
                                                                    href="https://postcards.email/"
                                                                    target="_blank"
                                                                    style="
                                                                      text-decoration: none;
                                                                      display: inline-block;
                                                                      vertical-align: top;
                                                                    "
                                                                    ><img
                                                                      src="https://cloudfilesdm.com/postcards/30d8fa960d435febe4a3116e3ba8cc21.png"
                                                                      style="
                                                                        display: block;
                                                                        border: 0;
                                                                        outline: 0;
                                                                        line-height: 100%;
                                                                        -ms-interpolation-mode: bicubic;
                                                                        width: 18px;
                                                                        height: 18px;
                                                                      "
                                                                      width="18"
                                                                      height="18"
                                                                      alt=""
                                                                  /></a>
                                                                </td>
                                                              </tr>
                                                            </table>
                                                          </td>
                                                        </tr>
                                                      </table>
                                                    </td>
                                                  </tr>
                                                </table>
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <table
                              width="100%"
                              border="0"
                              cellpadding="0"
                              cellspacing="0"
                              role="presentation"
                            >
                              <tr>
                                <td
                                  class="pc-w620-spacing-0-20-0-20"
                                  align="center"
                                  valign="top"
                                  style="
                                    padding: 0 40px;
                                    mso-padding-left-alt: 0;
                                    margin-left: 40px;
                                    height: auto;
                                  "
                                >
                                  <table
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    width="100%"
                                    align="center"
                                    style="
                                      margin-right: auto;
                                      margin-left: auto;
                                    "
                                  >
                                    <tr>
                                      <td valign="top" align="center">
                                        <div
                                          class="pc-font-alt"
                                          style="text-decoration: none"
                                        >
                                          <div
                                            style="
                                              text-align: center;
                                              text-align-last: center;
                                              font-family:
                                                &quot;DM Sans&quot;, Arial,
                                                Helvetica, sans-serif;
                                              font-size: 12px;
                                              line-height: 140%;
                                            "
                                          >
                                            <span
                                              style="
                                                font-family:
                                                  &quot;DM Sans&quot;, Arial,
                                                  Helvetica, sans-serif;
                                                color: rgb(20, 20, 20);
                                                font-size: 12px;
                                                line-height: 140%;
                                                letter-spacing: 0;
                                                font-weight: 400;
                                                font-style: normal;
                                              "
                                              >Want to change which emails you
                                              receive from us? You can </span
                                            ><a
                                              href="https://postcards.email/"
                                              target="_blank"
                                              rel="noreferrer"
                                              style="
                                                text-decoration: none;
                                                color: inherit;
                                              "
                                              ><span
                                                style="
                                                  font-family:
                                                    &quot;DM Sans&quot;, Arial,
                                                    Helvetica, sans-serif;
                                                  color: rgb(20, 20, 20);
                                                  font-size: 12px;
                                                  line-height: 140%;
                                                  letter-spacing: 0;
                                                  font-weight: 600;
                                                  font-style: normal;
                                                  text-decoration: underline;
                                                "
                                                >update your preferences</span
                                              ></a
                                            ><span
                                              style="
                                                font-family:
                                                  &quot;DM Sans&quot;, Arial,
                                                  Helvetica, sans-serif;
                                                color: rgb(20, 20, 20);
                                                font-size: 12px;
                                                line-height: 140%;
                                                letter-spacing: 0;
                                                font-weight: 400;
                                                font-style: normal;
                                              "
                                            >
                                              or </span
                                            ><a
                                              href="https://postcards.email/"
                                              target="_blank"
                                              style="
                                                text-decoration: none;
                                                color: inherit;
                                              "
                                              ><span
                                                style="
                                                  font-family:
                                                    &quot;DM Sans&quot;, Arial,
                                                    Helvetica, sans-serif;
                                                  color: rgb(20, 20, 20);
                                                  font-size: 12px;
                                                  line-height: 20px;
                                                  letter-spacing: 0;
                                                  font-weight: 600;
                                                  font-style: normal;
                                                  text-decoration: underline;
                                                "
                                                >unsubscribe</span
                                              ></a
                                            ><span
                                              style="
                                                font-family:
                                                  &quot;DM Sans&quot;, Arial,
                                                  Helvetica, sans-serif;
                                                color: rgb(20, 20, 20);
                                                font-size: 12px;
                                                line-height: 140%;
                                                letter-spacing: 0;
                                                font-weight: 400;
                                                font-style: normal;
                                              "
                                              >. You can view our </span
                                            ><a
                                              href="https://postcards.email/"
                                              target="_blank"
                                              rel="noreferrer"
                                              style="
                                                text-decoration: none;
                                                color: inherit;
                                              "
                                              ><span
                                                style="
                                                  font-family:
                                                    &quot;DM Sans&quot;, Arial,
                                                    Helvetica, sans-serif;
                                                  color: rgb(20, 20, 20);
                                                  font-size: 12px;
                                                  line-height: 140%;
                                                  letter-spacing: 0;
                                                  font-weight: 600;
                                                  font-style: normal;
                                                  text-decoration: underline;
                                                "
                                                >privacy policy</span
                                              ></a
                                            ><span
                                              style="
                                                font-family:
                                                  &quot;DM Sans&quot;, Arial,
                                                  Helvetica, sans-serif;
                                                color: rgb(20, 20, 20);
                                                font-size: 12px;
                                                line-height: 140%;
                                                letter-spacing: 0;
                                                font-weight: 600;
                                                font-style: normal;
                                              "
                                              >.</span
                                            >
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <!--[if gte mso 9]></td><td width="48" style="line-height:1px;font-size:1px" valign="top">&nbsp;</td></tr><tr><td colspan="3" height="48" style="line-height:1px;font-size:1px">&nbsp;</td></tr></table></td></tr></table></div><p style="margin:0;mso-hide:all"><o:p xmlns:o="urn:schemas-microsoft-com:office:office">&nbsp;</o:p></p></v:textbox></v:rect><![endif]-->
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  width="100%"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                >
                  <tr>
                    <td
                      align="center"
                      valign="top"
                      style="
                        padding-top: 20px;
                        padding-bottom: 20px;
                        vertical-align: top;
                      "
                    >
                      <a
                        href="https://postcards.email/?uid=MzQ5MDUw&type=footer"
                        target="_blank"
                        style="
                          text-decoration: none;
                          overflow: hidden;
                          border-radius: 2px;
                          display: inline-block;
                        "
                        ><img
                          src="https://cloudfilesdm.com/postcards/promo-footer-dark.jpg"
                          width="198"
                          height="46"
                          alt="Made with (o -) binex"
                          style="
                            width: 198px;
                            height: auto;
                            margin: 0 auto;
                            border: 0;
                            outline: 0;
                            line-height: 100%;
                            -ms-interpolation-mode: bicubic;
                            vertical-align: top;
                          " /></a
                      ><img
                        src="https://api-postcards.designmodo.com/tracking/mail/promo?uid=MzQ5MDUw"
                        width="1"
                        height="1"
                        alt=""
                        style="display: none; width: 1px; height: 1px"
                      />
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
};
