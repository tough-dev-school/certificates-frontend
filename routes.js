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
    const languages = {};
    languages[diploma.language.toLowerCase()] = { slug: diploma.slug };
    diploma.other_languages.forEach((diplomaInOtherLanguage) => {
      languages[diplomaInOtherLanguage.language.toLowerCase()] = {
        slug: diplomaInOtherLanguage.slug,
      };
    });
    res.render("diploma.html", { diploma, languages });
  }
});

module.exports = router;
