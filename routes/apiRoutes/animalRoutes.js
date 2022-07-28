// create server instance
const router = require('express').Router();

// dependencies
const { filterByQuery, findById, createNewAnimal, validateAnimal } = require('../../lib/animals');
const { animals } = require('../../data/animals');

// add route for animal data to server
router.get('/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    };
    res.json(results);
});

// add route for single animal request
router.get('/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    };
});

// add route for post of user input
router.post('/animals', (req, res) => {
    // set id based on what the next index of the array will be
    req.body.id = animals.length.toString();

    // if any data in req.body is incorrect, send 400 error
    if (!validateAnimal(req.body)) {
        res.status(400).send('The animal data is not formatted properly.');
    } else {
        // add animal to json file and animals array in this function
        const animal = createNewAnimal(req.body, animals);
        res.json(animal);
    }
});

module.exports = router;
