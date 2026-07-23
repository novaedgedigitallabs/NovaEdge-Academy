const { search, getIndianCities, byCountry } = require("@novaedgedigitallabs/citykit");

// GET /api/v1/city/search?q=Bhopal&limit=8
exports.searchCities = async (req, res) => {
  try {
    const { q, limit = 8 } = req.query;
    if (!q || q.trim().length < 2) {
      return res.status(200).json({ success: true, results: [] });
    }

    const results = search(q.trim(), { limit: parseInt(limit, 10) || 8 });
    
    res.status(200).json({
      success: true,
      results: results || [],
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
