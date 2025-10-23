// routes/srhr.js
const express = require("express");
const axios = require("axios");
const router = express.Router();

// GET /srhr
router.get("/", async (req, res) => {
  try {
    const query = req.query.q ? req.query.q.trim() : "";

    // if first load, show empty page
    if (!query) {
      return res.render("srhr", {
        title: "SRHR Connect",
        results: [],
        query: ""
      });
    }

    // fetch open-access data from Zenodo
    const url = `https://zenodo.org/api/records/?q=${encodeURIComponent(query)}&size=6`;
    const response = await axios.get(url);

    const results = response.data.hits.hits.map(r => {
      const htmlLink =
        (r.links && (r.links.html || r.links.doi || r.links.self_html)) ||
        (r.metadata && r.metadata.doi
          ? `https://doi.org/${r.metadata.doi}`
          : `https://zenodo.org/record/${r.id}`);
      const title = r.metadata.title || "Untitled Research";
      const creators = r.metadata.creators
        ? r.metadata.creators.map(c => c.name).join(", ")
        : "Unknown Author";
      return { title, link: htmlLink, creators };
    });

    res.render("srhr", {
      title: "SRHR Connect",
      results,
      query
    });
  } catch (err) {
    console.error("Zenodo API Error:", err.message);
    res.render("srhr", {
      title: "SRHR Connect",
      results: [],
      query: ""
    });
  }
});

module.exports = router;
