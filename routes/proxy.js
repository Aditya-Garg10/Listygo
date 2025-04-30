const express = require('express');
const { proxyGeocodeRequest, getCoordinates } = require('../controllers/proxy');

const router = express.Router();

router.get('/geocode', proxyGeocodeRequest);
router.get('/coordinates', getCoordinates);

module.exports = router;
