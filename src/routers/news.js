const express = require('express');
const router = new express.Router();
const News = require('../models/news');
const auth = require('../middleware/auth');

router.get('/news', auth, async (req,res) => {
  try {
    const news = await News.find({});
    res.send(news);
  } catch (e) {
    res.status(500).send(e);
  }

});

router.post('/news', auth, async (req, res) => {
  const news = new News({
    ...req.body
  })

  try {
    await news.save();
    res.status(201).send(news);
  } catch (e) {
    res.status(400).send(e);
  }

});

module.exports = router;
