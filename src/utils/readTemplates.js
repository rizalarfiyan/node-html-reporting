import * as fs from "fs";
import path from "path";

class ReadTemplates {
  _isAllowed(ext) {
    const allowExtension = ["html", "css", "js", "json"];
    return allowExtension.includes(ext);
  }

  _read(fileName, fileType) {
    if (!this._isAllowed(fileType)) return;
    return fs
      .readFileSync(
        path.resolve(
          process.cwd(),
          "src",
          "templates",
          fileType,
          `${fileName}.${fileType}`
        )
      )
      .toString("utf8");
  }

  readCss(fileName) {
    return this._read(fileName, "css");
  }

  readJs(fileName) {
    return this._read(fileName, "js");
  }

  readHtml(fileName) {
    return this._read(fileName, "html");
  }

  readJson(fileName) {
    return JSON.parse(this._read(fileName, "json"));
  }
}

export default ReadTemplates;
