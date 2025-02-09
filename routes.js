const express = require("express");
const api = require("./lib/api");

const router = express.Router();

router.get("/:slug", async (req, res) => {
  const { slug } = req.params;
  const diploma = await api.fetchDiploma({ slug });

  const languages = {};
  languages[diploma.language.toLowerCase()] = { slug: diploma.slug };
  diploma.other_languages.forEach((diplomaInOtherLanguage) => {
    languages[diplomaInOtherLanguage.language.toLowerCase()] = {
      slug: diplomaInOtherLanguage.slug,
    };
  });
  res.render("diploma.html", { diploma, languages });
});

router.get("/:slug/:language", async (req, res) => { // legacy route
  const { slug, language } = req.params;
  const diploma = await api.fetchDiploma({ slug });

  res.redirect(`/${diploma.slug}`);
});

module.exports = router;
