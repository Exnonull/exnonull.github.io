const recipes = document.getElementsByClassName('recipes')[0];
const craft = document.getElementsByTagName('footer')[0];
const json = [];
const craftItems = [];
const craftTargets = [];

function itemImage(item) {
    if (item == 0) return document.createElement('div');
    const img = document.createElement('img');
    img.src = './images/'+item+'.png';
    return img;
}

function itemToSlot(item) {
    const div = document.createElement('div');
    div.className = 'slot ';
    if (item != 0) div.className += 'active ';
    if ([8,9].includes(item)) div.className += 'special ';
    div.appendChild(itemImage(item));
    return div;
}

function slotsToRow(slots) {
    const row = document.createElement('div');
    row.className = 'row';
    console.log(slots);
    slots.map(slot => row.appendChild(slot));
    return row;
}

function rowsToRecipe(src, dist) {
    const recipe = document.createElement('div');
    recipe.className = 'recipe';
    const equality = document.createElement('span');
    equality.textContent = '=';
    recipe.appendChild(src);
    recipe.appendChild(equality);
    recipe.appendChild(dist);
    return recipe;
}

function itemsToRecipe(items, result) {
    const recipe = rowsToRecipe(
        slotsToRow(items.map(itemToSlot)),
        slotsToRow([itemToSlot(result)]),
    );
    return recipe;
}

function update() {
    recipes.innerHTML = '';
    json.map(recipe => recipes.appendChild(itemsToRecipe(recipe[0], recipe[1])));
}

function apply() {
    json.push([craftItems.slice(), craftTargets.slice()]);
    craftItems.splice(0);
    craftTargets.splice(0);
    update();
}

function revoke(pos) {
    json.splice(pos,1);
    update();
}

function craftUpdate() {
    craft.innerHTML = '';
    craft.appendChild(itemsToRecipe(craftItems, craftTargets));
}

function viewItems(items) {
    const preview = document.getElementsByClassName('items')[0];
    items.map(itemToSlot).map(slot => preview.appendChild(slot));
}

viewItems(Array(7).fill(0).map((v,k)=>k+1));