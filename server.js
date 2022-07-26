const express = require('express');
const { animals } = require('./data/animals');
const fs = require('fs');
const path = require('path');
const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();

// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON data
app.use(express.json());

// functions
function filterByQuery(query, animalsArray) {
    let personalityTraitsArray = [];
    let filteredResults = animalsArray;
    
    // get list of animals based on diet req
    if (query.diet) {
        filteredResults = filteredResults.filter(animal => animal.diet === query.diet);
    };
    // get list of animals based on species req
    if (query.species) {
        filteredResults = filteredResults.filter(animal => animal.species === query.species);
    };
    // get list of animals based on name req
    if (query.name) {
        filteredResults = filteredResults.filter(animal => animal.name === query.name);
    };
    // get list of animals based on personality req
    if (query.personalityTraits) {
        // save personalityTraits as a dedicated array
        if (typeof query.personalityTraits === 'string') {
            // check for personalityTraits being string
            personalityTraitsArray = [query.personalityTraits];
        } else {
            personalityTraitsArray = query.personalityTraits;
        };

        // filter based on each personality trait req
        personalityTraitsArray.forEach(trait => {
            // check trait against each animal in filteredResults
            // multiple traits are treated as '&&' so only animals with EVERY trait requested will be included in final response
            filteredResults = filteredResults.filter(animal => animal.personalityTraits.indexOf(trait) !== -1);
        });
    };

    return filteredResults;
};

function findById(id, animalsArray) {
    const result = animalsArray.filter(animal => animal.id === id)[0];
    return result;
};

function createNewAnimal(body, animalsArray) {
    const animal = body;
    animalsArray.push(animal);

    // update animals.json file
    fs.writeFileSync(
        path.join(__dirname, './data/animals.json'),
        JSON.stringify({ animals: animalsArray }, null, 2)
    );

    return animal;
};

function validateAnimal(animal) {
    // make sure each key/value pair exists and is correct data type
    if (!animal.name || typeof animal.name !== 'string') {
        return false;
    };
    if (!animal.species || typeof animal.species !== 'string') {
        return false;
    };
    if (!animal.diet || typeof animal.diet !== 'string') {
        return false;
    };
    if (!animal.personalityTraits || !Array.isArray(animal.personalityTraits)) {
        return false;
    };

    return true;
};

// add route for animal data to server
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    };
    res.json(results);
});

// add route for single animal request
app.get('/api/animals/:id', (req, res) => {
    const result = findById(req.params.id, animals);
    if (result) {
        res.json(result);
    } else {
        res.sendStatus(404);
    };
});

// add route for post of user input
app.post('/api/animals', (req, res) => {
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

// keep listen at end
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});
