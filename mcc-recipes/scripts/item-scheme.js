// MAIN
globalThis.unknownItem = '[???]';
globalThis.emptyItem = '[Empty]';
globalThis.anyItem = '[Any]';
globalThis.timeProcess = '[Time]';
globalThis.furnaceProcess = '[Furnace]';
globalThis.ashProcess = '[Ash Sifter]';
globalThis.compressorProcess = '[Compressor]';
globalThis.enchantProcess = '[Enchantment Table]';
globalThis.acceleratorProcess = '[Particle Accelerator]'; // preons
globalThis.entityInfuser = '[Entity Infuser]';
globalThis.burnerProcess = '[Burner]';
globalThis.doNotLink = [
  unknownItem,
  emptyItem,
  anyItem,
  timeProcess,
  furnaceProcess,
  ashProcess,
  compressorProcess,
  acceleratorProcess,
  enchantProcess,
  entityInfuser,
  burnerProcess,
];

globalThis.recipeFrom = ({type, sources}) => ({type, sources});
globalThis.recipeTo = (result, {type, sources}) => ({result, type, sources});

globalThis.items = [
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

String.prototype.isFun = function () {
  return this.toLowerCase().includes('admin') || this.toLowerCase().includes('moderator') || this.toLowerCase().includes('player');
};

String.prototype.mark = function () {
  return '`' + this + '`';
};
String.prototype.markBlack = function () {
  return '`' + this + '`';
};
String.prototype.markWhite = function () {
  return '**' + this + '**';
};
String.prototype.underline = function () {
  return '__' + this + '__';
};
String.prototype.markList = function () {
  return '```js\n' + this + '```';
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

function linkInfuser(itemName, recipe) {
  makeItem(entityInfuser);
  if (recipe.type != 'infuser') return;
  if (entityInfuser.hasRecipeTo(recipe)) return;
  entityInfuser.getItem().to.push({ ...recipe, result: itemName });
  recipe.sources.forEach((otherName) => {
    makeItem(otherName);
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

  if (recipe.type == 'infuser')
      recipe.sources.forEach((otherName) => {
        let item = makeItem(otherName);
        if (!otherName.hasRecipeTo(recipe))
          item.to.push({ ...recipe, result: itemName });
      });

  if (recipe.type == "craft")
    recipe.sources.forEach((otherName) => {
      if (itemName.isFun() && !otherName.isFun()) return;

      let item = makeItem(otherName);
      if (!otherName.hasRecipeTo(recipe))
        item.to.push({ ...recipe, result: itemName });
    });

  if (recipe.type == "ash")
    recipe.sources.forEach((otherName) => {
      let item = makeItem(otherName);
      item.to.push({ ...recipe, result: itemName });
    });

  if (itemName.isFun()) return;
  if (itemName == emptyItem && recipe.type != 'ash') return;
  if (doNotLink.includes(itemName)) return;

  linkAsh(itemName);
  linkInfuser(itemName, recipe);
  if (recipe.type != 'infuser') linkCompressor(itemName, recipe);
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

function infuserItem(recipes) {
  recipes.forEach(([name, ...sources]) =>
    newRecipeFrom(name, {
      type: "infuser",
      sources: sources,
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

// https://stackoverflow.com/a/34810528/17592157
function getSort(caseInsensitive) {
  caseInsensitive = !!caseInsensitive;
  // Splits a string in to string and number fragments, parsing integers along the way.
  function getFragments(string) {
      var strings = string.split(/\d/);
      var numbers = string.split(/\D/);
      if (caseInsensitive === true) {
          strings = strings.map(function(string) {
              return string.toLowerCase();
          });
      }
      // Remove any empty strings (there's likely to be one at the start or at the end).
      var fragments = strings.filter(function(value) {
          return value.length > 0;
      });
      var insertIndex = 0;
      // Insert numbers in the correct place in the fragments array.
      for (var i = 0; i < numbers.length; i++) {
          if (numbers[i].length > 0) {
              fragments.splice(insertIndex, 0, parseInt(numbers[i]));
              // Add one to insert index to account for the element we just added.
              insertIndex++;
          }
          insertIndex++;
      }
      return fragments;
  }

  // Actual comparison function.
  return function(lhs, rhs) {
      var lhsFragments = getFragments(lhs);
      var rhsFragments = getFragments(rhs);

      for (var i = 0; i < lhsFragments.length; i++) {
          // Sort right-hand-side in front of left-hand-side if left-hand-side has more fragments.
          if (i >= rhsFragments.length) {
              return 1;
          }
          if (lhsFragments[i] !== rhsFragments[i]) {
              if (lhsFragments[i] < rhsFragments[i]) {
                  return -1;
              } else {
                  return 1;
              }
          }
      }
      // Sort left-hand-side in front of right-hand-side if right-hand-side has more fragments.
      if (lhsFragments.length < rhsFragments.length) {
          return -1;
      }
      return 0;
  }
}


function getEditDistance(a, b) {
  if(a.length == 0) return b.length; 
  if(b.length == 0) return a.length; 

  var matrix = [];

  // increment along the first column of each row
  var i;
  for(i = 0; i <= b.length; i++){
    matrix[i] = [i];
  }

  // increment each column in the first row
  var j;
  for(j = 0; j <= a.length; j++){
    matrix[0][j] = j;
  }

  // Fill in the rest of the matrix
  for(i = 1; i <= b.length; i++){
    for(j = 1; j <= a.length; j++){
      if(b.charAt(i-1) == a.charAt(j-1)){
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(matrix[i-1][j-1] + 1, // substitution
                                Math.min(matrix[i][j-1] + 1, // insertion
                                         matrix[i-1][j] + 1)); // deletion
      }
    }
  }

  return matrix[b.length][a.length];
}