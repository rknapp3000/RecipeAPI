const mongoCollections = require('../config/mongoCollections');
const recipes = mongoCollections.recipes;
const { ObjectId } = require('mongodb');
const validation = require('../validation');

module.exports = {
   
    async createRecipe(title, ingredients, steps) {
        title = validation.stringValidation(title, 'title');

        steps = validation.arrayAndStringValidation(steps, 'steps');

        const recipeCollection = await recipes();

        const newRecipe = {
            title: title,
            ingredients: ingredients,
            steps: steps
        };

        const insertedInfo = await recipeCollection.insertOne(newRecipe);
        const newId = insertedInfo.insertedId.toString();
        return await this.get(newId);
    },

    async get(id) {
        if (!id) throw 'An id must be provided.';
        if (typeof id !== 'string') throw 'The argument id must be a string.';
        if (id.trim().length === 0) throw 'Error; Id cannot be just spaces or an empty string.';
        id = id.trim();
        if (!ObjectId.isValid(id)) throw 'Object id is invalid.';

        const recipeCollection = await recipes();
        const recipe = await recipeCollection.findOne({ _id: ObjectId(id) });
        if (recipe == null) throw 'Error: You must provide a valid Id.';

        return recipe;
    },

    async getAll() {
        const recipeCollection = await recipes();
        const recipeList = await recipeCollection.find({}).toArray();
        if (!recipeList) throw ('Error: could not get list of all recipes.')

        return recipeList;
    },

    async update(id, updatedRecipe) {
            const recipeCollection = await recipes();
        
            const updatedRecipeData = {};
        
            if (updatedRecipe.title) {
                updatedRecipeData.title = validation.stringValidation(updatedRecipe.title,'title');
            }
            if (updatedRecipe.ingredients) {
                updatedRecipeData.ingredients = updatedRecipe.ingredients,'ingredients';
            }
            if (updatedRecipe.steps) {updatedRecipeData.steps = validation.arrayAndStringValidation(updatedRecipe.steps,'steps');
            }
        
            await recipeCollection.updateOne(
              {_id: ObjectId(id)},
              {$set: updatedRecipeData}
            );
        
            return await this.get(id);
          },

    async remove(id) {
        if (!id) throw 'An id must be provided.';
        if (typeof id !== 'string') throw 'The argument id must be a string.';
        if (id.trim().length === 0) throw 'Error: Id cannot be just spaces or an empty string.';
        id = id.trim();
        if (!ObjectId.isValid(id)) throw 'Error: please use a valid id.';

        const recipeCollection = await recipes();
        const deleteRecipeInfo = await recipeCollection.deleteOne({ _id: ObjectId(id) });
        if (deleteRecipeInfo.deletedCount === 0) { throw `Could not delete recipe with id of ${id}`; }

        return { deleted: true };
    }

}



