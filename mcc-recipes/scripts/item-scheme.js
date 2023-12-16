// MAIN
const unknownItem = '[???]';
const emptyItem = '[Empty]';
const anyItem = '[Any]';
const timeProcess = '[Time]';
const furnaceProcess = '[Furnace]';

const recipeFrom = ({type, sources}) => ({type, sources});
const recipeTo = (result, {type, sources}) => ({result, type, sources});

const items = [
  {
    name: emptyItem,
    from: [{type: 'craft', sources: ['Ash Cube', furnaceProcess]}],
    to: [],
  },
  {
    name: 'Ash Cube',
    from: [],
    to: [{result: emptyItem, type: 'craft', sources: ['Ash Cube', furnaceProcess]}],
  },
];

String.prototype.getItem = function () {
  return items.find((i) => i.name == this);
};
String.prototype.getResultProcess = function (process) {
  return this.getItem().to.find(r => r.sources.includes(process))?.result;
};
String.prototype.getItemProcess = function (process) {
  let items = this.getItem().from.find(r => r.sources.includes(process))?.sources;

  if (!items) return null;
  if (items[0] == process) return items[1];
  return items[0];
};
String.prototype.hasRecipeFrom = function ({type, sources}) {
  return this.getItem().from.find(r => r.type == type && sources.every(s => r.sources.includes(s)));
};
String.prototype.hasRecipeTo = function ({type, sources}) {
  return this.getItem().to.find(r => r.type == type && sources.every(s => r.sources.includes(s)));
};
String.prototype.removeRecipeFrom = function (recipe) {
  return this.getItem().from.splice(this.getItem().from.indexOf(recipe), 1);
};
String.prototype.removeRecipeTo = function (recipe) {
  return this.getItem().to.splice(this.getItem().to.indexOf(recipe), 1);
};

function makeItem(itemName) {
  let item = itemName.getItem();
  if (item) return item;
  item = {
    name: itemName,
    from: [],
    to: [],
  };
  items.push(item);
  return item;
}

function newRecipeFrom(itemName, recipe) {
  let item = makeItem(itemName);
  if (!itemName.hasRecipeFrom(recipe)) item.from.push(recipe);

  if (recipe.type == "craft")
    recipe.sources.forEach((otherName) => {
      let item = makeItem(otherName);
      item.to.push({ ...recipe, result: itemName });
    });

  if (itemName == emptyItem) return;

  let fromFurnace = itemName.getItemProcess(furnaceProcess);
  if (fromFurnace) { // itemName <- item + furnace => remove item
    const ashRecipes = "Ash Cube".getItem().from;
    const ashRecipe = ashRecipes.find((r) => r.sources.includes(fromFurnace));
    if (ashRecipe) "Ash Cube".removeRecipeFrom(ashRecipe);
  }

  let toFurnace = itemName.getResultProcess(furnaceProcess);
  if (toFurnace) { // item <- itemName + furnace => remove itemName
    const ashRecipes = "Ash Cube".getItem().from;
    const ashRecipe = ashRecipes.find((r) => r.sources.includes(itemName));
    if (ashRecipe) "Ash Cube".removeRecipeFrom(ashRecipe);
  }

  if (fromFurnace || toFurnace) return;
  if ("Ash Cube".hasRecipeFrom(itemName)) return;
  "Ash Cube".getItem().from.push({ type: "craft", sources: [itemName, furnaceProcess] });
}

function newRecipeTo(recipe) {
  recipe.sources.forEach(itemName => {
    let item = makeItem(itemName);
    
    if (itemName.hasRecipeTo(recipe)) return;
    recipe.result = unknownItem;
    item.to.push(recipe);

    let toFurnace = itemName.getResultProcess(furnaceProcess);
    if (toFurnace) { // item <- itemName + furnace => remove itemName
      const ashRecipes = "Ash Cube".getItem().from;
      const ashRecipe = ashRecipes.find((r) => r.sources.includes(itemName));
      if (ashRecipe) "Ash Cube".removeRecipeFrom(ashRecipe);
    }

    if (toFurnace) return;
    if ("Ash Cube".hasRecipeFrom(itemName)) return;
    "Ash Cube".getItem().from.push({ type: "craft", sources: [itemName, furnaceProcess] });
  });
}

function locationItem(recipes) {
  recipes.forEach(([name, sourceName]) =>
    newRecipeFrom(name, {
      type: "location",
      sources: [sourceName],
    })
  );
}

function lootItem(recipes) {
  recipes.forEach(([name, sourceName]) =>
    newRecipeFrom(name, {
      type: "loot",
      sources: [sourceName],
    })
  );
}

function craftItem(recipes) {
  recipes.forEach(([name, sourceA, sourceB]) =>
    newRecipeFrom(name, {
      type: "craft",
      sources: [sourceA, sourceB],
    })
  );
}

function itemCombinations(recipes) {
  recipes.forEach(([name, ...sources]) =>
    sources.forEach(s => 
      newRecipeTo({
        type: "craft",
        sources: [name, s],
      })
    )
  );
}