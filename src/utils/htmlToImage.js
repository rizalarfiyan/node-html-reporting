import { Cluster } from "puppeteer-cluster";
import { compile } from "handlebars";

export default async function nodeHtmlToImage(options) {
  const {
    html,
    encoding,
    transparent,
    content,
    output,
    selector,
    type,
    quality,
    puppeteerArgs = {},
  } = options;

  const cluster = await Cluster.launch({
    concurrency: Cluster.CONCURRENCY_CONTEXT,
    maxConcurrency: 2,
    puppeteerOptions: { ...puppeteerArgs, headless: true },
  });

  const shouldBatch = Array.isArray(content);
  const contents = shouldBatch ? content : [{ ...content, output, selector }];

  try {
    const screenshots = await Promise.all(
      contents.map((content) => {
        const { output, selector: contentSelector, ...pageContent } = content;
        return cluster.execute(
          {
            html,
            encoding,
            transparent,
            output,
            content: pageContent,
            selector: contentSelector ? contentSelector : selectorselector,
            type,
            quality,
          },
          async ({ page, data }) => {
            const screenshot = await makeScreenshot(page, {
              ...options,
              screenshot: new Screenshot(data),
            });
            return screenshot;
          }
        );
      })
    );
    await cluster.idle();
    await cluster.close();

    return shouldBatch
      ? screenshots.map(({ buffer }) => buffer)
      : screenshots[0].buffer;
  } catch (err) {
    console.error(err);
    await cluster.close();
  }
}

async function makeScreenshot(
  page,
  { screenshot, waitUntil = "networkidle0" }
) {
  if (screenshot?.content) {
    const template = compile(screenshot.html);
    screenshot.setHTML(template(screenshot.content));
  }

  await page.setContent(screenshot.html, { waitUntil });
  const element = await page.$(screenshot.selector);
  if (!element) {
    throw Error("No element matches selector: " + screenshot.selector);
  }

  const buffer = await element.screenshot({
    path: screenshot.output,
    type: screenshot.type,
    omitBackground: screenshot.transparent,
    encoding: screenshot.encoding,
    quality: screenshot.quality,
  });

  screenshot.setBuffer(buffer);

  return screenshot;
}

class Screenshot {
  constructor(params) {
    if (!params || !params.html) {
      throw Error("You must provide an html property.");
    }

    const {
      html,
      encoding,
      transparent = false,
      output,
      content,
      selector = "body",
      quality = 80,
      type = "png",
    } = params;

    this.html = html;
    this.encoding = encoding;
    this.transparent = transparent;
    this.type = type;
    this.output = output;
    this.content = isEmpty(content) ? undefined : content;
    this.selector = selector;
    this.quality = type === "jpeg" ? quality : undefined;
  }

  setHTML(html) {
    if (!html) {
      throw Error("You must provide an html property.");
    }
    this.html = html;
  }

  setBuffer(buffer) {
    this.buffer = buffer;
  }
}

function isEmpty(val) {
  return val == null || !Object.keys(val).length;
}
