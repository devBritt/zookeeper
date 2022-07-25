const express = require('express');
const { animals } = require('./data/animals');
const PORT = process.env.PORT || 3001;
// instantiate the server
const app = express();

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
}

// add route for animal data to server
app.get('/api/animals', (req, res) => {
    let results = animals;
    if (req.query) {
        results = filterByQuery(req.query, results);
    };
    res.json(results);
});

// keep listen at end
app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}`);
});
