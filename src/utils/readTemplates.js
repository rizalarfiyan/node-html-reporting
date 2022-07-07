import * as fs from "fs";
import path from "path";

export const getLocation = (fileName, fileType, fileExt = "") => {
  return path.resolve(
    process.cwd(),
    "src",
    "templates",
    fileType,
    `${fileName}.${fileExt || fileType}`
  );
};

export const readTemplate = (fileName, fileType, fileExt = "") => {
  return fs.readFileSync(getLocation(fileName, fileType, fileExt));
};

export const readJson = (filename) => {
  return JSON.parse(readTemplate(filename, "json").toString("utf8"));
};

export const readCss = (filename) => {
  return readTemplate(filename, "css").toString("utf8");
};

export const readJs = (filename) => {
  return readTemplate(filename, "js").toString("utf8");
};

export default {
  getLocation,
  readTemplate,
  readJson,
  readCss,
  readJs,
};
