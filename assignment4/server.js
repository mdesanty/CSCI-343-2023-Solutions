require('dotenv').config();

const pgClient = require('./pgClient');

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.json());

app.get('/recipes', getRecipes);
app.get('/recipes/:id', getRecipe);
app.post('/recipes', createRecipe);
app.put('/recipes/:id', updateRecipe);
app.delete('/recipes/:id', deleteRecipe);

const listener = app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(`Server listening at ${listener.address().address}:${listener.address().port}`);
});

function getRecipes(req, res) {
  const sql = 'SELECT id, name, ingredient_1, ingredient_2, ingredient_3, recipe_author_first_name, recipe_author_last_name, recipe_category_name FROM recipes ORDER BY name';
  pgClient.query(sql)
    .then(results => {
      res.json(results.rows);
    })
    .catch(error => {
      res.status(500).json({ error: `There was an error with your request: ${error}`});
    });
}

function getRecipe(req, res) {
  const sql = 'SELECT id, name, ingredient_1, ingredient_2, ingredient_3, recipe_author_first_name, recipe_author_last_name, recipe_category_name FROM recipes WHERE id = $1';
  pgClient.query(sql, [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.json(results.rows[0]);
      }
      else {
        res.status(404).json({ error: 'Recipe not found.'} );
      }
    })
    .catch(error => {
      res.status(500).json({ error: `There was an error with your request: ${error}` });
    });
}

function createRecipe(req, res) {
  const recipe = req.body;

  const sql =
    'INSERT INTO recipes (name, ingredient_1, ingredient_2, ingredient_3, recipe_author_first_name, recipe_author_last_name, recipe_category_name) ' +
    'VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id';
  const sqlParams =
    [recipe.name, recipe.ingredient_1, recipe.ingredient_2, recipe.ingredient_3, recipe.recipe_author_first_name, recipe.recipe_author_last_name, recipe.recipe_category_name];

  pgClient.query(sql, sqlParams)
    .then(results => {
      res.location(`/recipes/${results.rows[0].id}`);
      res.json({ message: 'Recipe created successfully' });
    })
    .catch(error => {
      res.status(500).json({ error: `There was an error with your request: ${error}` });
    });
}

function updateRecipe(req, res) {
  const recipe = req.body;

  const sql =
    'UPDATE recipes ' +
    'SET name = $1, ingredient_1 = $2, ingredient_2 = $3, ingredient_3 = $4, recipe_author_first_name = $5, recipe_author_last_name = $6, recipe_category_name = $7' +
    'WHERE id = $8';
  const sqlParams =
    [recipe.name, recipe.ingredient_1, recipe.ingredient_2, recipe.ingredient_3, recipe.recipe_author_first_name, recipe.recipe_author_last_name, recipe.recipe_category_name, req.params.id];

  pgClient.query(sql, sqlParams)
    .then(results => {
      if(results.rowCount > 0) {
        res.json({ message: 'Recipe updated successfully' });
      }
      else {
        res.status(404).json({ error: `Recipe not found for id ${req.params.id}.` });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `There was an error with your request: ${error}` });
    });
}

function deleteRecipe(req, res) {
  pgClient.query('DELETE FROM recipes WHERE id = $1', [req.params.id])
    .then(results => {
      if (results.rowCount > 0) {
        res.json({ message: 'Recipe successfully deleted.' });
      }
      else {
        res.status(404).json({ error: 'Recipe not found.' });
      }
    })
    .catch(error => {
      res.status(500).json({ error: `There was an error with your request: ${error}` });
    });
}