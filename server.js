const express = require('express');
const { animals } = require('./data/animals');
const apiRoutes = require('./routes/apiRoutes');
const htmlRoutes = require('./routes/htmlRoutes');
const path = require('path');
const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();

// make public/ files readily available
app.use(express.static('public'));
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());
// include all api routes
app.use('/api', apiRoutes);
// include all frontend routes
app.use('/', htmlRoutes);

// keep listen at end
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});
