const recipes = document.getElementsByClassName('recipes')[0];
const craft = document.getElementsByClassName('craft')[0];
const data = document.getElementsByClassName('data')[0];
const categories = document.getElementsByClassName('category')[0];
const initialList = [[[[1,1],[14]],[[1,2],[15]],[[1,11],[16]],[[1,8],[17]]],[[[3],[12]],[[3,3],[13]],[[12],[3]],[[13],[3]],[[13],[12]],[[2,6],[18]],[[2,6,6],[19]],[[2,4],[20]],[[2,4,4],[21]],[[2,10],[22]],[[2,10,10],[22]],[[2,5],[22]],[[2,5,5],[22]],[[2,9],[23]],[[2,9,9],[24]],[[2,6,9],[25]],[[2,4,9],[26]],[[2,10,9],[23]]],[]];
const json = JSON.parse(localStorage.getItem('recipes')) || initialList;
const craftItems = [];
const craftTargets = [];
let category = 0;
const catMax = [2,3,3];





const titles = [
    'Air',
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
    'Torch\n<Stick>',
    'Torch\n<Cloth>',
    'Torch\n<Mold Gel>',
    'Torch\n<Bottle of Oil>',
    'Bandage\n<Green Herb>',
    'Bandage\n<Green Herb, Green Herb>',
    'Bandage\n<Green Flower>',
    'Bandage\n<Green Flower, Green Flower>',
    'Bandage\n<Garlic | Red Flower>',
    'Bandage\n<Black Mushroom>',
    'Bandage\n<Black Mushroom, Black Mushroom>',
    'Bandage\n<Green Herb, Black Mushroom>',
    'Bandage\n<Green Flower, Black Mushroom>',
];
const descriptions = [
    'Air of abyss, contains particles of force field.',
    'A piece of old wood. It can be burnt.',
    'Piece of cloth, often used into medicine due to its capability to absorb liquids.',
    'Very sharp, be careful when handling this thing.',
    'This flower seems to be somehow attracted magnetically by plants.',
    'This flower seems to be somehow attracted magnetically by precious metals.',
    'A natural herb that is said to develop healing powers when mixed with boiling water and cooled down.',
    'Plant based fibre with slight healing capabilities, can be used to make a soft and elastic fabric.',
    'Bottle of flammable oil.',
    'Odd looking mushroom.',
    'This thing stinks like old socks.',
    'This gel is very light and flammable.',
    'Empty glass bottle.',
    'Empty big glass bottle.',
    'Perfect for lighting up the dark spots.',
    'Perfect for lighting up the dark spots.',
    'Perfect for lighting up the dark spots.',
    'Perfect for lighting up the dark spots.',
    'Used to heal wounds instantly.',
    'Used to heal wounds instantly.',
    'Used to heal wounds instantly.',
    'Used to heal wounds instantly.',
    'Used to heal wounds instantly.',
    'Used to heal wounds instantly.',
    'Used to heal wounds instantly.',
    'Used to heal wounds instantly.',
    'Used to heal wounds instantly.',
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
    div.className = 'slot tooltip ';
    if (item != 0) div.className += 'active ';
    if ([8,9].includes(item)) div.className += 'special ';
    div.appendChild(itemImage(item));

    const hint = document.createElement('div');
    hint.className = 'tooltiptext';
    hint.textContent = titles[item]+'\n'+descriptions[item];
    div.appendChild(hint);

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
    if (craftItems.length < 1) return;
    if (craftTargets.length < 1) return;
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

viewItems(titles.map((v,k)=>k+1).slice(0,-1));
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