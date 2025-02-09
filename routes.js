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

  const course = {
    name: diploma.course.name.split("(")[0].trim(),
    name_en: diploma.course.name_international.split("(")[0].trim(),
  };
  const title = {
    ru: `${diploma.student.first_name} ${diploma.student.last_name} — ${diploma.course.name}`,
    en: `${diploma.student.first_name_en} ${diploma.student.last_name_en} — ${diploma.course.name_international}`,
  };

  res.render("diploma.html", {
    diploma,
    languages,
    course,
    title,
  });
});

router.get("/:slug/:language", async (req, res) => {
  // legacy route
  const { slug, language } = req.params;
  const diploma = await api.fetchDiploma({ slug });

  res.redirect(`/${diploma.slug}`);
});

module.exports = router;
