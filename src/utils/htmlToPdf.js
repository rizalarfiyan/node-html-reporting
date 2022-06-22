import { Cluster } from "puppeteer-cluster";
import { compile } from "handlebars";

export default async function nodeHtmlToPdf(options) {
  const { html, options: pdfOptions, puppeteerArgs = {} } = options;

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    puppeteerOptions: { ...puppeteerArgs, headless: true },
  });

  try {
    const pdf = await cluster.execute(
      {
        html,
        pdfOptions,
      },
      async ({ page, data: { html, pdfOptions } }) => {
        let htmlTemplate = "";
        if (!!html) {
          const template = compile(html, { strict: true });
          htmlTemplate = template(html);
        }

        await page.setContent(htmlTemplate, {
          waitUntil: "networkidle0",
        });

        return await page.pdf(pdfOptions);
      }
    );

    await cluster.idle();
    await cluster.close();

    return pdf;
  } catch (err) {
    await cluster.close();
  }
}
