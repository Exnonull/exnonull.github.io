let dragging = null;
const getFontSize = (textLength) => {
    const baseSize = 16;
    const fontSize = Math.max(9, baseSize - textLength * 0.25);
    return `${fontSize}px`
};
function changeRecipe(el) {
    el.view = !el.view;
    if (el.view) {
    el.querySelector('.body').innerHTML = `${
        el.item.output.map(r => {
        let rec;

        if (r.type == 'craft') rec = `<div class="recipeData craftRecipe">
            <span class="slot sourceItem" title="${r.result}">${r.result}</span>
            <span class="sign">:</span>
            <span class="slot sourceItem" title="${r.source[0]}">${r.source[0]}</span>
            <span class="sign">+</span>
            <span class="slot sourceItem" title="${r.source[1]}">${r.source[1]}</span>
        </div>`;

        if (r.type == 'furnace') rec = `<div class="recipeData furnaceRecipe">
            <span class="slot sourceItem" title="${r.result}">${r.result}</span>
            <span class="sign">:</span>
            <span class="slot">Furnace</span>
            <span class="sign">+</span>
            <span class="slot sourceItem" title="${r.source}">${r.source}</span>
        </div>`;

        if (r.type == 'time') rec = `<div class="recipeData timeRecipe">
            <span class="slot sourceItem" title="${r.result}">${r.result}</span>
            <span class="sign">:</span>
            <span class="slot sourceItem">Time</span>
        </div>`;

        return `<div class="itemRecipe">${rec}</div>`
        }).join('')
    }`;
    } else {
    el.querySelector('.body').innerHTML = `${
        el.item.recipes.map(r => {
        let rec;

        if (r.type == 'location') rec = `<div class="recipeData locationRecipe">
            <span class="recipeType location">Location</span>
            <span class="sign">:</span>
            <span class="slot sourceLoot">${r.source}</span>
        </div>`;

        if (r.type == 'loot') rec = `<div class="recipeData lootRecipe">
            <span class="recipeType loot">Loot</span>
            <span class="sign">:</span>
            <span class="slot sourceLoot">${r.source}</span>
        </div>`;

        if (r.type == 'craft') rec = `<div class="recipeData craftRecipe">
            <span class="recipeType craft">Craft</span>
            <span class="sign">:</span>
            <span class="slot sourceItem" title="${r.source[0]}">${r.source[0]}</span>
            <span class="sign">+</span>
            <span class="slot sourceItem" title="${r.source[1]}">${r.source[1]}</span>
        </div>`;

        if (r.type == 'furnace') rec = `<div class="recipeData furnaceRecipe">
            <span class="recipeType furnace">Furnace</span>
            <span class="sign">:</span>
            <span class="slot sourceItem" title="${r.source}">${r.source}</span>
        </div>`;

        if (r.type == 'time') rec = `<div class="recipeData timeRecipe">
            <span class="recipeType time">Time</span>
            <span class="sign">:</span>
            <span class="slot sourceItem" title="${r.source}">${r.source}</span>
        </div>`;

        if (r.type == 'unknown') rec = `<div class="recipeData unknownRecipe">
            <span class="recipeType unknown">No Data</span>
        </div>`;

        return `<div class="itemRecipe">${rec}</div>`
        }).join('')
    }`;
    }
    [...el.querySelectorAll('.slot')].forEach((i) => {
    i.style.fontSize = getFontSize(i.textContent.length);
    });
    [...el.querySelectorAll('.sourceItem')].forEach((i) => {
    i.onclick = function(e) {
        openRecipe(this.title.getItem() || {name: this.title, recipes: [{type:'unknown'}]});

        e.preventDefault();
        e.cancelBubble = true;
        return false;
    };
    });
}
function openRecipe(item) {
    let win = document.createElement('div');
    win = document.getElementsByClassName('recipes')[0].appendChild(win);
    win.outerHTML = `<div class="recipe" id="check" style="left: ${window.outerWidth/2 - 275/2}px; top: ${document.querySelector('#input').offsetTop + 100}px;">
    <div class="head" draggable="true">
        <div class="change"><span>~</span></div>
        <div class="name"><span>${item.name}</span></div>
        <div class="close"><span>X</span></div>
    </div>
    <div class="body">
        ${
        item.recipes.map(r => {
            let rec;

            if (r.type == 'location') rec = `<div class="recipeData locationRecipe">
            <span class="recipeType location">Location</span>
            <span class="sign">:</span>
            <span class="slot sourceLoot">${r.source}</span>
            </div>`;

            if (r.type == 'loot') rec = `<div class="recipeData lootRecipe">
            <span class="recipeType loot">Loot</span>
            <span class="sign">:</span>
            <span class="slot sourceLoot">${r.source}</span>
            </div>`;

            if (r.type == 'craft') rec = `<div class="recipeData craftRecipe">
            <span class="recipeType craft">Craft</span>
            <span class="sign">:</span>
            <span class="slot sourceItem" title="${r.source[0]}">${r.source[0]}</span>
            <span class="sign">+</span>
            <span class="slot sourceItem" title="${r.source[1]}">${r.source[1]}</span>
            </div>`;

            if (r.type == 'furnace') rec = `<div class="recipeData furnaceRecipe">
            <span class="recipeType furnace">Furnace</span>
            <span class="sign">:</span>
            <span class="slot sourceItem" title="${r.source}">${r.source}</span>
            </div>`;

            if (r.type == 'time') rec = `<div class="recipeData timeRecipe">
            <span class="recipeType time">Time</span>
            <span class="sign">:</span>
            <span class="slot sourceItem" title="${r.source}">${r.source}</span>
            </div>`;

            if (r.type == 'unknown') rec = `<div class="recipeData unknownRecipe">
            <span class="recipeType unknown">No Data</span>
            </div>`;

            return `<div class="itemRecipe">${rec}</div>`
        }).join('')
        }
    </div>
    </div>`;

    const el = document.querySelector('#check');
    el.item = item;
    el.date = +new Date();
    [...document.querySelectorAll('.recipe')].sort((a,b) => a.date - b.date).forEach((el, i) => {
    el.style.zIndex = i;
    });

    [...document.querySelectorAll('.recipe')].forEach(el => {
    if (el.was) return;
    el.was = true;
    el.onclick = e => {
        el.date = +new Date();
        [...document.querySelectorAll('.recipe')].sort((a,b) => a.date - b.date).forEach((el, i) => {
        el.style.zIndex = i;
        });
    };
    el.querySelector('.head').addEventListener(`dragstart`, (e) => {
        e.preventDefault();
        el.date = +new Date();
        [...document.querySelectorAll('.recipe')].sort((a,b) => a.date - b.date).forEach((el, i) => {
        el.style.zIndex = i;
        });
        el.dx = el.offsetLeft - e.clientX;
        el.dy = el.offsetTop - e.clientY;
        dragging = el;
        return false;
    })
    el.querySelector('.head').addEventListener(`dragover`, (e) => {
        e.preventDefault();
        dragging = null;
        return false;
    });
    el.querySelector('.change').onclick = e => changeRecipe(el);
    el.querySelector('.close').onclick = e => el.remove();
    [...el.querySelectorAll('.slot')].forEach((i) => {
        i.style.fontSize = getFontSize(i.textContent.length);
    });
    [...el.querySelectorAll('.sourceItem')].forEach((i) => {
        i.onclick = function(e) {
        openRecipe(this.title.getItem() || {name: this.title, recipes: [{type:'unknown'}]});

        e.preventDefault();
        e.cancelBubble = true;
        return false;
        };
    });
    });
}
document.onmousemove = function(e) {
    if (!dragging) return;
    dragging.style.left = (e.clientX + dragging.dx) + 'px';
    dragging.style.top = (e.clientY + dragging.dy) + 'px';
}
document.onmouseup = function(e) {
    dragging = null;
}