// create server instance
const router = require('express').Router();

// dependencies
const { filterByQuery, findById, createNewZookeeper, validateZookeeper } = require('../../lib/zookeepers');
const { zookeepers } = require('../../data/zookeepers');

// add route for zookeeper data to server
router.get('/zookeepers', (req, res) => {
    let results = zookeepers;
    if (req.query) {
        results = filterByQuery(req.query, results);
    };
    res.json(results);
});

// add route for single zookeeper request
router.get('/zookeepers/:id', (req, res) => {
    const result = findById(req.params.id, zookeepers);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    };
});

// add route for post of user input
router.post('/zookeepers', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = zookeepers.length.toString();

    // if any data in req.body is incorrect, send 400 error
    if (!validateZookeeper(req.body)) {
        res.status(400).send('The zookeeper data is not formatted properly.');
    } else {
        // add zookeeper to json file and zookeepers array in this function
        const zookeeper = createNewZookeeper(req.body, zookeepers);
        res.json(zookeeper);
    }
});

module.exports = router;
