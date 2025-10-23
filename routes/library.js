// routes/library.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /library
router.get("/", async (req, res) => {
  const query = req.query.q ? req.query.q.trim() : "";

  if (!query) {
    return res.render("library", {
      title: "Open Learning Library",
      results: [],
      query: ""
    });
  }

  try {
    const url = `https://zenodo.org/api/records/?q=${encodeURIComponent(query)}&size=6`;
    const response = await axios.get(url);

    const results = response.data.hits.hits.map(r => {
      const htmlLink =
        (r.links && (r.links.html || r.links.doi || r.links.self_html)) ||
        (r.metadata && r.metadata.doi
          ? `https://doi.org/${r.metadata.doi}`
          : `https://zenodo.org/record/${r.id}`);
      const title = r.metadata.title || "Untitled Resource";
      const creators = r.metadata.creators
        ? r.metadata.creators.map(c => c.name).join(", ")
        : "Unknown Author";
      return { title, link: htmlLink, creators };
    });

    res.render("library", {
      title: "Open Learning Library",
      results,
      query
    });
  } catch (error) {
    console.error("Zenodo API error:", error.message);
    res.render("library", {
      title: "Open Learning Library",
      results: [],
      query
    });
  }
});

module.exports = router;
