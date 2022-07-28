// This file is middleware for the apiRoutes folder
// It will be used as a hub for all route files in apiRoutes

// create instance of server
const router = require('express').Router();
// dependencies
const animalRoutes = require('../apiRoutes/animalRoutes');

router.use(animalRoutes);

module.exports = router;
