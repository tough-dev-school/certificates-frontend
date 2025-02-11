const express = require("express");
const compression = require("compression");
const path = require("path");
const morgan = require("morgan");

const Sentry = require("@sentry/node");

if (process.env.NODE_ENV == "development") {
  require("dotenv").config();
}

const app = express();

// logging
app.set("trust proxy", true);
app.disable("x-powered-by");
app.use(morgan("combined"));

if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
  });
}

// view engine setup
app.set("view engine", "html");
app.engine("html", require("./lib/nunjucks"));

app.use(compression());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", require("./routes"));

app.use((err, req, res, next) => {
  // send 404 by default
  console.error(err);
  res.status(404).render("error");
});

if (process.env.NODE_ENV !== "development") {
  Sentry.setupExpressErrorHandler(app);
  app.use((err, req, res, next) => res.status(404).render("error", { path: req.path }));
}

module.exports = app;
