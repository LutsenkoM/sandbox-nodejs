const express = require('express');
const router = new express.Router();

router.get('/test', async (req, res) => {
  try {
    res.status(200).send('Request was correct');
  } catch (e) {
    res.status(400).send(e);
  }
});

module.exports = router;
