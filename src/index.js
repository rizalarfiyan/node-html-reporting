import { ReadTemplates, EditorJsToHtml } from "./utils";
import fs from 'fs'
import nodeHtmlToPdf from "./utils/htmlToPdf";

class PdfReportDesigner {
  constructor(
    options = {
      js: [],
      css: [],
      logo: "",
    }
  ) {
    this.options = options;
    this.parser = new EditorJsToHtml();
    this.reader = new ReadTemplates();
    this.init();
    return this;
  }

  init() {
    if (!this.options?.data) {
      throw new Error("No avaliable data");
    }

    this.data = this.reader.readJson(this.options.data).report_designer;
    this.css = this.readAllCss(this.options?.css || []);
    this.js = this.readAllJs(this.options?.js || []);
    this.logo = this.options.logo;
  }

  readAllCss(css) {
    return css
      .map((data) => {
        return this.reader.readCss(data);
      })
      .join("");
  }

  readAllJs(js) {
    return js
      .map((data) => {
        return this.reader.readJs(data);
      })
      .join("");
  }

  buildContent = () => {
    return this.data
      .map((block, idx) => {
        const page = idx + 1;
        const className = this.getClassPerPage(block, page);

        let htmlData = "";
        htmlData += this.parser.parse(block).join("");
        htmlData += this.addNotePerPage(page);
        htmlData += this.addFooter(page);

        return `<div class="page ${className}">${htmlData}</div>`;
      })
      .join("");
  };

  getClassPerPage = (block, page) => {
    const pages = `page-${page}`;
    const pagination = block?.pagination || "";
    return (pages + pagination).trim();
  };

  addNotePerPage = (page) => {
    if (page === 1 || page === 2) return "";
    return `
    <div class="note">
      <span>Note:</span>
      <ul class="list">
        <li>Values shown are estimates based on time spent by people captured by cameras.</li>
      </ul>
    </div>`;
  };

  addFooter = (page) => {
    if (page === 1) return "";
    return `
    <div class="footer">
      <div class="wrapper">
        <span>Generated by </span>
        <img src="${this.logo}" alt="Lauretta.io" />
        <span class="num-page"></span>
      </div>
    </div>`;
  };

  addCss = () => {
    this.css.trim();
    if (this.css === "") return "";
    return `<style type="text/css">${this.css}</style>`;
  };

  addJs = () => {
    this.js.trim();
    if (this.js === "") return "";
    return `<script type="text/javascript">${this.js}</script>`;
  };

  render = () => {
    return this.addCss() + this.buildContent() + this.addJs();
  };
}

const htmlReportDesigner = new PdfReportDesigner({
  // data: "report-designer-work",
  data: "report-designer",
  js: ["report-designer"],
  css: ["report-designer"],
  logo: "data:image/webp;base64,UklGRnILAABXRUJQVlA4TGYLAAAvxAALEGpQ3LaNI+0/dpLr5RsREwBycPMWxziyBXAuXa4LZmkgn9IeFmzxu+lU2/9YbgRyQSjHOTo/HX065wdBpfhuGqWp32JQLA5F1zaEy0C9Y6XKkcGFot4RUnaVGS0BcXBAID6qLwG3aVBsbQg53q2FYyuFzp1bo1CtfjGIwxJwtlmkqcxge1dbLwgDuAjW/8ppjziocg63WhQOF8JWxpFzGiIOANJAcbUV3Ma2bTWUTjmUQQEUQOi/j+QjMZJ3cLPtIJJkVxW1Egg//61fDfUJAhAAFAAADEkTzva9bdu2bdu2bdu2bdv+jx+NaIQJsOJs/2vJ0V2E0xKyfcBf8g84FPQCvBQvwDtP539Ondvm1ged7WJ3A861ApfMj7NptmFJV8V7Cccyy4kZHeeMEktXJVO7aeOmzub2hbWMlgo5FzTMAeUZ7shnCQ5ocs6DEndghQY67ODeCR0XcHWWUmpe0oGNJtGcE4obaNx8CpV01cwbmJx5SVdm02hioW8CGtbSlXcwcRclHTSJG1m1gsmDehMTlzA8T01Tb2Fi4VnCVa2glzCZJeIokm1XORIIP9zFWTQZAQjAvxY8ADe2bdeJyqAcQoWYF2IkcYM1ww7wEL7OkQQAYBlJeSwGa9u2bdu2bdu2bdu2bds62+gE0G0vxLLXw21ZnqIkf0slRI94UyxYS0l6UYMRPhYLFiniRFHxd1uDSHSz/Q/AB4foECM2lXA4xMaVYkIEeAMS3Ir+IMJjSBFQMCYWqIsVWzqJbVoDIiTEwBZDYB9oOYgcMNUI9UTm14C6qYNiQBys8zcEACOlBX4N5LAxYc8Bk7j2eS8EqYKomBQtjokj0bygndEgDAC/Q1jUiIzlDSKZxHKEleUaxbG6ERH6W37KAogCIwPwLoinfQkAFYWNeL/FJ5gkIpIRtSilTJIHDIeWvo4w8f204KBDTXlClEUAooNDzBwEb4BhM2ROEaOmfDR5TAmN6EQEURHi0JL/w0ZxM1kbH263z0jIQDllUigMh6ZChMHrm0JjuEtl340irWBdKZ81j2AjhIhcypaFoZtuiUTk83wljVg2iJ8MFtEDqZTj0OK/gUnMREOiFbKRp4AIjscMDiwMLCpAmATbKgDeP8RDJwiX7V2ZKUcYKVpZ8wg7FG6kQ6ETRERvKWpQHyjxK3OCVUSiDUM8DpHaqQI6X5YdYWD+18LiDWCfEZMNi5AJtBTEzjY6HOm/xYuQLHiUAYscFg6cnpgAZmehiATjZGD2loWjh+YHg2hwNTBkxIWFBp0ahL/LerKIp6GSFkBhSnk5ZNESsIi4ZasiIr+r0s4Hg7JIGBaNmmJDPFVXguENx0BmfSFBKUZhMRaYJF8Y0pERVNTgmTkLBYAsw+ApFKacNxIrBYvnTQcOAOmJwPPEsKDMhilERAHSdHSSBVNDQnC5rqLSM+ZEoPnMep7igkov0kw8zzAyLXIYCk/hI3ykMCGl4nn76nb3vlchxChMVgMUOFIyntHhiWUDO8YMj+eNtOgZrvCoqBA81uux8Fko5Xzlof2+CwaMjUzc9OYeNgf3OyYv18pyXe2zByxs8igkYntGTdInKfp7iSJhUicSoxiULvzBasAAqBbiC28VOlaiFN8fCmBV35eKOUbRUqCixBTLhklpCDMFkvRFO5UtAIyeGIQLX+kvBUjpq+9H+ypsRB+FrwdT+On7fpXp5dJsmn2Sop8PGtAiCCjd+EJFys5g35cFheYukUWVfzBJX7RQ8wwNR13cAW1fQdz2fKp4F//iNlWspH2Ht2kWiWu9gYA3iJqIwKmckNKbB/vRJcKL0s83izpGpCkaeDkAUQzbBQMrIYc0mgSAe5JXikYOpiaWDXuNz/ZIWFDMCA8uQ6GmzBsOoAaDaEf0ElD4WywWhRMpEWkW6UJAt1gsbglADg84ooKQQT66pBgmRDUGKgU22RL1kNKhMKlBIBSEDP/dJqxELsP+XRrbOogSmDIUPs9S40BxMnTCkb2Kmm/oXOGQTsWVEXzI9up9e2LZQN4olhUdsD5OxeB3V71rBBDLPxAcQqY7p5sTAfA4VRaXMCGUAKmvTQfNeEbSRBobn5Ery8JolKaT57WrNTYqSIBYFuzHZG/VCk7dOyOi6XwQL3aoLBtl/4APUjLpAn5WGZEVXzeN3B/yUB044sHm7gOiIU9vOfCCuxA68i1L7k4R4rqXz3wntHJ/IBFGyLhM6xXiZj0wf60PH3QgtIahEQ4YDAeAZl7yDGhPLbApBfM98/SlDKD9SZJ05vshxzdCa4jjdwwFHZO9DQyjrjyWhWFq+uMHmXYJgBdzoXNVo9yvJSJqjIXW0YDfgthyfdstkLgy/cnrUjosKjqID6PRMMeygSiCwU/X0mHZkE05pzKKBvJdGR1EHKIbZzKtzN8TlqqpJFh/byAaDGLl8TB/IGY+pxQSrRrvShX6ir98TgZvgLApvQOGuO6uYkE6DLAeEKcbR2p6RDO8pC8sb3oyv/MOp9Sg+B2VXt4Ba1GOM+9vp2giZfWZZjbcBkyVx5s0C0/z84IQwfFG0Fl4oK2BRDkljA6xIGJGTyQ2GSwRj5puucGwMdRdOd1raUY/h23PmCALw/J+teRop1SJjOO1KRsKjcCRmgSlxcA6cyXdTwOnpQcBqOcWDgXfhEO0+ryBANx8yQ7i+5DoK2+ULJiNsemVI6RA29dneMmDrHvHQZqKy+qMjQ8VHPleQCUfG1BEkP06m+V3xRJ2PQRj67bzZP5TO30NLGLG4FgJCoEvzgUEGsULw/STzNGTtD9xyusV+pXvXcC7VakMQqT43BsAaDlkULn+nEFg1znFSqiLWNtlYye3l3juJUwahudptrNOndqHF6ds3Bo6YmCR4PNtxLJBNwMpHQC1SDVeMmZaBYCR0QK8F0KPLwWoVB0TVsJPmpm+yYYqF+qez+BjFtnNyrd7kvNvgHI7ctPvGLXYGEBHdgrZZOPeSY4bphEOo58XAJPn3AXw+bkP8UbPRyvjD5uR586aDSwMbzhtFkoGAfe3WCZZvkx/uve0ukk1hX1OcSwl9JDHxrKBxTvGOzMyYtRotVPA1haNuLv+IdpHDSYcavdNuZ7GLawMKMPjsyBlost0v9nC6HA0sPcpugU5rVeoXDja5Zi7dVPOG0mSwU6OYfhrmf6XLlstQFYb7G0HpYBCS1bXd366NTA3gpjpEQuT6bp163o/H/NZEMD/VW/ATjllVk4sG3YdmVYV8EAge1u12+zrsi8ikx98GNDS2eCyfJkfJRIXD8sAsWzwF8VIItgsaRrD/H++rjkwomLnaUnTXYeTUb/7AV8fNo9blddJJTS0nmdng1a6ShWrJYGXbyxaOZjVXZrB031OhgsuqI+Pj+++ONuaZpGq6Aws15Wf9/teCHEURSX6pwFdg126op3B7/17A6velNZBBovSDtnn15tVV4W/q3cAXfO4BxevPVcRc2PDwUH9BjCLPEIWt6yt/SCw97Xk78bU1gL42bUJts8vNLz3qDTbzizo8jz4/3YwtJn83eDbhYwxeQY3/gwO/vD79U/vrJZXNCpxWH8IQEvFuIAkw9oPjLWCmuFpC0kyaB7R3wk87kf+m0kyyH/qZ9D2NIUBSZEBAAXP+JDkwQDwjm4/IEm3/qYPWbQGr73TFuqEjvBgkgyKo6Zb/jDg9JWuBrcEn4VCt7Ml/YABpefCrIqhcnDH39c9IIV3CAGlO1MapJb4Un39Zgs+Dl6ptAKAp5VKSgo2gLF7bF/fMc/z62LZAJapoZWlUqkOAP76xNtLA0aZgLo7buwQBrq9LL52R+m3GQDP3eqJGQA1pVKXBthp1DwdHV/q/AniOdv/AN6IXjKVe1gG5c7mclnEM5XLpdBLfj33sCTincrlMphbqA==",
});

const makeImagePdf = async (html) => {
  return await nodeHtmlToPdf({
    html,
    options: {
      path: "report-designer-test.pdf",
      format: "A4",
      landscape: true,
      margin: {
        top: "1cm",
        bottom: "0.5cm",
        right: "1cm",
        left: "1cm",
      }
    },
  }, false)
    .then((buffer) => {
      console.log("====================================")
      console.log("The PDF was created successfully!");
      console.log("====================================")
      // console.log("PDF buffer", buffer.toString('base64'));
    })
    .catch((err) => {
      console.error("Error: ", err);
    });
};

// makeImagePdf(htmlReportDesigner.render())
// console.log(htmlReportDesigner.buildContent())
const templateHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Report Designer</title>
  <link rel="stylesheet" href="./src/templates/css/normalize.min.css">
  <link rel="stylesheet" href="./src/templates/css/report-designer.css">
</head>
<body>
  ${htmlReportDesigner.buildContent()}
  <script src="./src/templates/js/report-designer.js"></script>
  </body>
</html>
`
fs.writeFileSync("index.html", templateHtml);