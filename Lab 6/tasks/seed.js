const dbConnection = require('../config/mongoConnection');
const data = require('../data');
const recipes = data.recipes;

async function main() {

    const db = await dbConnection.dbConnection();
    await db.dropDatabase();

    const recipe1 = await recipes.createRecipe(
        'fried eggs',
        [{name: "Egg",
        amount: "2 eggs"}],[
        "First, heat a non-stick pan on medium-high until hot",
        "Add the oil to the pan and allow oil to warm; it is ready the oil immediately sizzles upon contact with a drop of water.",
        "Crack the egg and place the egg and yolk in a small prep bowl; do not crack the yolk!",
        "Gently pour the egg from the bowl onto the oil and cook till done.",
        ]
       )
    try {
        console.log(recipe1);
    } catch (error) {
        console.log(error)
    }
 
    await dbConnection.closeConnection();
}

main();
















