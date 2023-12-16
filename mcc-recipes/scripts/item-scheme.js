// MAIN
const items = [];
String.prototype.getItem = function () {
  return items.find((i) => i.name == this);
};

function newItem(itemName, recipe) {
  if (recipe.type == "unknown" && itemName.getItem()) return;

  if (itemName.getItem()) {
    const recipes = itemName.getItem().recipes;
    const unknownRecipe = recipes.find((r) => r.type == "unknown");
    if (unknownRecipe) recipes.splice(recipes.indexOf(unknownRecipe), 1);
  }

  if (!itemName.getItem())
    items.push({
      name: itemName,
      recipes: [],
      output: [],
    });
  itemName.getItem().recipes.push(recipe);

  if (recipe.type != "location" && recipe.type != "loot") {
    if (recipe.source instanceof Array) {
      recipe.source.forEach((item) => {
        if (!item.getItem())
          items.push({
            name: item,
            recipes: [],
            output: [],
          });
        item.getItem().output.push({ ...recipe, result: itemName });
      });
    } else if (recipe.source) {
      if (!recipe.source.getItem())
        items.push({
          name: recipe.source,
          recipes: [],
          output: [],
        });
      recipe.source.getItem().output.push({ ...recipe, result: itemName });
    }
  }

  if (recipe.type == "furnace") {
    const ashRecipes = "Ash Cube".getItem().recipes;
    const ashRecipe = ashRecipes.find((r) => r.source == recipe.source);
    if (ashRecipe) ashRecipes.splice(ashRecipes.indexOf(ashRecipe), 1);
  }

  if (itemName == "<No Item>") return;
  const ashRecipes = "Ash Cube".getItem().recipes;
  const ashRecipe = ashRecipes.find((r) => r.source == itemName);

  const hasFurnaceRecipe = itemName
    .getItem()
    .output.find((r) => r.type == "furnace");
  if (hasFurnaceRecipe) {
    if (ashRecipe) ashRecipes.splice(ashRecipes.indexOf(ashRecipe), 1);
    return;
  }

  if (ashRecipe) return;
  const recipes = "Ash Cube".getItem().recipes;
  const unknownRecipe = recipes.find((r) => r.type == "unknown");
  if (unknownRecipe) recipes.splice(recipes.indexOf(unknownRecipe), 1);
  ashRecipes.push({ type: "furnace", source: itemName });
}

function unknownItem(...recipes) {
  recipes.forEach((name) =>
    newItem(name, {
      type: "unknown",
    })
  );
}
function locationItem(sourceName, ...recipes) {
  recipes.forEach((name) =>
    newItem(name, {
      type: "location",
      source: sourceName,
    })
  );
}
function lootItem(sourceName, ...recipes) {
  recipes.forEach((name) =>
    newItem(name, {
      type: "loot",
      source: sourceName,
    })
  );
}
function craftItem(recipes) {
  recipes.forEach(([name, sourceA, sourceB]) =>
    newItem(name, {
      type: "craft",
      source: [sourceA, sourceB],
    })
  );
}
function furnaceItem(recipes) {
  recipes.forEach(([name, sourceA]) =>
    newItem(name, {
      type: "furnace",
      source: sourceA,
    })
  );
}
function timeItem(recipes) {
  recipes.forEach(([name, sourceA]) =>
    newItem(name, {
      type: "time",
      source: sourceA,
    })
  );
}

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
