const nunjucks = require("nunjucks");

nunjucks.configure({
  watch: process.env.NODE_ENV === "development",
  noCache: process.env.NODE_ENV === "development",
});

const env = new nunjucks.Environment(new nunjucks.FileSystemLoader("views"), {
  throwOnUndefined: true,
  trimBlocks: true,
  lstripBlocks: true,
});

env.addFilter("cover", (url, width, height) => {
  // crop images using our CDN magic
  url = new URL(url);
  url.searchParams.set("width", width);
  url.searchParams.set("crop", `${width},${height},x0,y0`);

  return env.filters.safe(url.toString());
});

const appWideTemplateContext = {
  origin: process.env.ORIGIN ? process.env.ORIGIN : "https://certificates.tough-dev.school",
};

module.exports = (filePath, opts, callback) => {
  const rendered = env.render(filePath, { ...opts, ...appWideTemplateContext }, callback);
};
