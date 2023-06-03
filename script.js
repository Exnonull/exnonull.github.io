const recipes = document.getElementsByClassName('recipes')[0];
const craft = document.getElementsByClassName('craft')[0];
const data = document.getElementsByClassName('data')[0];
const categories = document.getElementsByClassName('category')[0];
const json = JSON.parse(localStorage.getItem('recipes')) || Array(categories.children.length).fill(0).map(()=>[]);
const craftItems = [];
const craftTargets = [];
let category = 0;
const catMax = [2,3,3];





const titles = [
    'Wood Piece',
    'Cloth',
    'Glass Shard',
    'Green Flower',
    'Red Flower',
    'Green Herb',
    'Green Fibre',
    'Bottle of Oil',
    'Black Mushroom',
    'Garlic',
    'Mold Gel',
    'Glass Bottle',
    'Big Glass Bottle',
    'Torch <Stick>',
    'Torch <Cloth>',
    'Torch <Mold Gel>',
    'Torch <Bottle of Oil>',
];
const descriptions = [
    'Wood Piece',
    'Cloth',
    'Glass Shard',
    'Green Flower',
    'Red Flower',
    'Green Herb',
    'Green Fibre',
    'Bottle of Oil',
    'Black Mushroom',
    'Garlic',
    'Mold Gel',
    'Glass Bottle',
    'Big Glass Bottle',
    'Torch <Stick>',
    'Torch <Cloth>',
    'Torch <Mold Gel>',
    'Torch <Bottle of Oil>',
];





function itemImage(item) {
    if (item == 0) {
        const img = document.createElement('div');
        img.style.width = '43px';
        img.style.height = '43px';
        return img;
    }
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
    div.itemId = item;
    return div;
}

function slotsToRow(slots) {
    const row = document.createElement('div');
    row.className = 'row';
    slots.map(slot => row.appendChild(slot));
    return row;
}

function rowsToRecipe(src, dist) {
    const recipe = document.createElement('a');
    recipe.className = 'recipe';
    const equality = document.createElement('span');
    equality.textContent = '=';
    recipe.appendChild(src);
    recipe.appendChild(equality);
    recipe.appendChild(dist);
    return recipe;
}

function itemsToRecipe(items, results) {
    const recipe = rowsToRecipe(
        slotsToRow(items.map(itemToSlot)),
        slotsToRow(results.map(itemToSlot)),
    );
    return recipe;
}





function update() {
    recipes.innerHTML = '';
    for (let cat in json) {
        const categoryName = categories.children[cat].textContent;
        const elem = document.createElement('span');
        elem.textContent = categoryName;
        recipes.appendChild(elem);
        if (json[cat].length == 0) {
            const recipe = itemsToRecipe(cat == 0 ? [0,0] : [0,0,0], [0]);
            recipes.appendChild(recipe);
        }
        json[cat].map((recipe, pos) => {
            const input = recipe[0].concat(Array(catMax[cat]).fill(0)).slice(0,catMax[cat]);
            recipe = itemsToRecipe(input, recipe[1]);
            recipe.onclick = () => revoke(cat, pos);
            recipes.appendChild(recipe);
        });
    }
    localStorage.setItem('recipes', JSON.stringify(json));
    data.value = JSON.stringify(json);
}

function apply() {
    if (craftItems.length < 0) return;
    if (craftTargets.length < 0) return;
    json[category].push([craftItems.slice(), craftTargets.slice()]);
    craftItems.splice(0);
    craftTargets.splice(0);
    update();
    craftUpdate();
}

function revoke(cat, pos) {
    json[cat].splice(pos,1);
    update();
}





function craftUpdate() {
    craft.innerHTML = '';
    let items = craftItems.slice();
    let targets = craftTargets.slice();
    if (craftItems.length < 3) items.push(...Array(3-craftItems.length).fill(0));
    if (craftTargets.length < 1) targets.push(0);
    craft.appendChild(itemsToRecipe(items, targets));
    [...craft.children[0].children[0].children].forEach((element, pos) => {
        element.onclick = () => {
            craftItems.splice(pos, 1);
            craftUpdate();
        };
    });
    [...craft.children[0].children[2].children].forEach((element, pos) => {
        element.onclick = () => {
            craftTargets.splice(pos, 1);
            craftUpdate();
        };
    });
}

function addCraftItem(id) {
    craftItems.push(id);
    craftUpdate();
}

function addCraftTarget(id) {
    craftTargets.push(id);
    craftUpdate();
}





function setCategory(id) {
    const cats = document.getElementsByClassName('category')[0].children;
    for (let i in cats) {
        cats[i].className = '';
        if (i == id) cats[i].className = 'active';
    }
    category = id;
}





function viewItems(items) {
    const preview = document.getElementsByClassName('items')[0];
    items.map(id => [id, itemToSlot(id)]).map(([id, slot]) => {
        const a = document.createElement('a');
        a.appendChild(slot);
        a.onclick = () => addCraftItem(id);
        a.oncontextmenu = function(e) {
            e.stopPropagation();
            e.preventDefault();
            addCraftTarget(id);
            return false;
        };
        preview.appendChild(a);
    });
}

viewItems(titles.map((v,k)=>k+1));
craftUpdate();
update();

data.value = JSON.stringify(json);
data.onchange = function() {
    const newItems = JSON.parse(data.value);
    if (newItems instanceof Array && newItems.length == 3) {
        json.splice(0);
        json.push(...newItems);
        try {
            update();
        } catch (e) {
            json.splice(0);
            json.push(...JSON.parse(localStorage.getItem('recipes')));
        }
    }
    data.value = JSON.stringify(json);
}