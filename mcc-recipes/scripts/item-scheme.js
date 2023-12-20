// MAIN
const unknownItem = '[???]';
const emptyItem = '[Empty]';
const anyItem = '[Any]';
const timeProcess = '[Time]';
const furnaceProcess = '[Furnace]';
const ashProcess = '[Ash Sifter]';
const compressorProcess = '[Compressor]';
const acceleratorProcess = '[Accelerator]'; // preons
const entityInfusor = '[Entity Infusor]';
const doNotLink = [
  unknownItem,
  emptyItem,
  anyItem,
  timeProcess,
  furnaceProcess,
  ashProcess,
  compressorProcess,
  acceleratorProcess,
  entityInfusor,
];

const recipeFrom = ({type, sources}) => ({type, sources});
const recipeTo = (result, {type, sources}) => ({result, type, sources});

const items = [
  {
    name: emptyItem,
    from: [],
    to: [],
  },
  {
    name: 'Ash Cube',
    from: [],
    to: [],
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

function linkAsh(itemName) {
  makeItem(ashProcess);
  makeItem("Ash Cube");

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
  const recipe = { type: "craft", sources: [itemName, furnaceProcess] };
  if ("Ash Cube".hasRecipeFrom(recipe)) return;
  "Ash Cube".getItem().from.push(recipe);
}

function linkCompressor(itemName, recipe) {
  makeItem(compressorProcess);
  if (recipe.type != 'craft') return;
  recipe.sources.forEach((otherName) => {
    makeItem(otherName);
    compressorProcess.getItem().to.push({ type: "craft", sources: [itemName, compressorProcess], result: otherName });
  });
}

function linkAccelerator(itemName) {
  makeItem(acceleratorProcess);
  makeItem("Preons");
  makeItem("Destroyed Particles");
  if (itemName == "Destroyed Particles") return;

  const recipe = { type: "craft", sources: [itemName, acceleratorProcess] };
  if ("Preons".hasRecipeFrom(recipe)) return;
  "Preons".getItem().from.push({ type: "craft", sources: [itemName, acceleratorProcess] });
}

function newRecipeFrom(itemName, recipe) {
  let item = makeItem(itemName);
  if (!itemName.hasRecipeFrom(recipe)) item.from.push(recipe);

  if (recipe.type == "craft")
    recipe.sources.forEach((otherName) => {
      let item = makeItem(otherName);
      if (!otherName.hasRecipeTo(recipe))
        item.to.push({ ...recipe, result: itemName });
    });

  if (recipe.type == "ash")
    recipe.sources.forEach((otherName) => {
      let item = makeItem(otherName);
      item.to.push({ ...recipe, result: itemName });
    });

  if (itemName == emptyItem && recipe.type != 'ash') return;
  if (doNotLink.includes(itemName)) return;

  linkAsh(itemName);
  linkCompressor(itemName, recipe);
  linkAccelerator(itemName);
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

function ashItem(recipes) {
  recipes.forEach(([name, sourceA, sourceB, sourceC]) =>
    newRecipeFrom(name, {
      type: "ash",
      sources: [sourceA, sourceB, sourceC].filter(i => i),
    })
  );
}

function itemCombinations(recipes) {
  recipes.forEach(([name, ...sources]) => {
    if (sources.length == 0) {
      if (!name.getItem()) makeItem(name);
      name.getItem().noResult = true;
    }
    sources.forEach(s => 
      newRecipeTo({
        type: "craft",
        sources: [name, s],
      })
    )
  });
}