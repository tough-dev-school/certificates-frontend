const express = require("express");
const api = require("./lib/api");

const router = express.Router();

router.get("/:slug", async (req, res) => {
  const diploma = await api.fetchDiploma({ slug: req.params.slug });
  res.redirect(301, `/${diploma.slug}/${diploma.language.toLowerCase()}`);
});

router.get("/:slug/:language", async (req, res) => {
  const { slug, language } = req.params;
  const diploma = await api.fetchDiploma({ slug });

  if (diploma.language.toLowerCase() !== language.toLowerCase()) {
    const diplomaToRedirect = diploma.other_languages.find(
      (d) => d.language === language.toUpperCase(),
    );
    res.redirect(
      301,
      `/${diplomaToRedirect.slug}/${diplomaToRedirect.language.toLowerCase()}`,
    );
  } else {
    res.json({ diploma });
  }
});

module.exports = router;
