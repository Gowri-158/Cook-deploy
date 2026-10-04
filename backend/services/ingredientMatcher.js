// CookShare's unique non-CRUD feature:
// Rank recipes according to the percentage of required ingredients
// that are already available in the user's pantry.

function rankRecipes(recipes, pantryIngredients) {
  const pantry = new Set(
    pantryIngredients
      .map(x => String(x).trim().toLowerCase())
      .filter(Boolean)
  );

  return recipes.map(recipe => {
    const required = (recipe.ingredients || [])
      .map(x => String(x.name || x).trim().toLowerCase())
      .filter(Boolean);

    const matched = required.filter(item => pantry.has(item)).length;
    const score = required.length
      ? Math.round((matched / required.length) * 100)
      : 0;

    return {
      ...recipe,
      matchedIngredients: matched,
      totalIngredients: required.length,
      matchScore: score
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}

module.exports = { rankRecipes };
