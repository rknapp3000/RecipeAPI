const express = require('express');
const router = express.Router()
const data = require('../data');
const recipeData = data.recipes;
const validation = require('../validation');


router.get('/:id', async (req, res) => {

  try {
    const recipe = await recipeData.get(req.params.id);
    res.json(recipe);
  } catch (e) {
    res.status(404).json({ error: e });
  }
});

router.get('/', async (req, res) => {
  try {
    const recipeList = await recipeData.getAll();
    res.json(recipeList);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.post('/', async (req, res) => {
  const recipePostData = req.body;
  try {
    recipePostData.title = validation.stringValidation(recipePostData.title, 'title');
    // recipePostData.ingredients = validation.stringValidation(recipePostData.ingredients, 'ingredients');
    if(!Array.isArray(recipePostData.ingredients)) throw 'ingredients must be an array'
    recipePostData.steps = validation.arrayAndStringValidation(recipePostData.steps, 'steps');
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  recipePostData.id = (recipePostData.id, 'id');

  try {
    const { title, ingredients, steps } = recipePostData;
    const newRecipe = await recipeData.createRecipe(title, ingredients, steps);
    res.json(newRecipe);
  } catch (e) {
    res.status(500).json({ error: e });
  }
});

router.put('/:id', async (req, res) => {
  const updatedRecipeData = req.body;
  req.params.id = validation.idValidation(req.params.id, 'Recipe ID');
  
  if (updatedRecipeData.title) updatedRecipeData.title = validation.stringValidation(updatedRecipeData.title, 'title');
  //if (reqbody.ingredients) reqbody.ingredients = validation.arrayAndStringValidation(reqbody.ingredients, 'ingredients');
  if(!Array.isArray(updatedRecipeData.ingredients)) throw 'ingredients must be an array'
  if (updatedRecipeData.steps) updatedRecipeData.steps = validation.arrayAndStringValidation(updatedRecipeData.steps, 'steps');
  
  try {
    await recipeData.get(req.params.id);
  } catch (error) {
    return res.status(400).json({ error: "recipe not found" });
  }

  try {
    updatedRecipe = await recipeData.update(req.params.id, updatedRecipeData);
  } catch (error) {
    return res.status(500).json({ error: e });
  }
  res.json(updatedRecipe);

});

router.patch('/:id', async (req, res) => {
  const reqbody = req.body;
  let updatedRes = {};

  try {
    req.params.id = validation.idValidation(req.params.id, 'Recipe ID');
    if (reqbody.title) reqbody.title = validation.stringValidation(reqbody.title, 'title');
    if(!Array.isArray(reqbody.ingredients)) throw 'ingredients must be an array'
    if (reqbody.steps) reqbody.steps = validation.arrayAndStringValidation(reqbody.steps, 'steps');

  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const oldRecipe = await recipeData.get(req.params.id);
    if (reqbody.title && reqbody.title !== oldRecipe.title) updatedRes.title = reqbody.title;
    if (reqbody.ingredients && reqbody.ingredients !== oldRecipe.ingredients) updatedRes.ingredients = reqbody.ingredients;
    if (reqbody.steps && reqbody.steps !== oldRecipe.steps) updatedRes.steps = reqbody.steps;
  } catch (e) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  if (Object.keys(updatedRes).length !== 0) {
    try {
      const updatedRecipe = await recipeData.update(
        req.params.id,
        updatedRes
      );
      res.json(updatedRecipe);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  } else {
    res.status(400).json({
      error:
        'No update has been made'
    });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    req.params.id = validation.idValidation(req.params.id, 'Id is URL Parameter');
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    await recipeData.get(req.params.id);
  } catch (e) {
    return res.status(404).json({ error: 'Recipe not found' });
  }
  try {
    await recipeData.remove(req.params.id);
    res.status(200).json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e });
  }
});


module.exports = router;