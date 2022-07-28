// dependencies
const fs = require('fs');
const path = require('path');

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
        path.join(__dirname, '../data/animals.json'),
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

module.exports = {
    filterByQuery,
    findById,
    createNewAnimal,
    validateAnimal
};
