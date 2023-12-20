let dragging = null;
const getFontSize = (textLength) => {
  const baseSize = 16;
  const fontSize = Math.max(8, baseSize - textLength * 0.25);
  return `${fontSize}px`;
};
function sortWindows() {
  [...document.querySelectorAll(".recipe")]
    .sort((a, b) => a.date - b.date)
    .forEach((el, i) => {
      el.style.zIndex = i;
    });
}



function openWindow(item) {
  let win = document.createElement("div");
  win = document.getElementsByClassName("recipes")[0].appendChild(win);
  win.className = "recipe";
  win.style = `left: ${window.outerWidth / 2 - 275 / 2}px; top: ${document.querySelector("#input").offsetTop + 100}px;`;
  win.view = true;
  win.item = item;
  win.innerHTML = `
  <div class="head" draggable="true">
    <div class="change"><span>~</span></div>
    <div class="name"><span title="${item.name}">${item.name}</span></div>
    <div class="close"><span>X</span></div>
  </div>
  <div class="body">
  </div>`;
  changeRecipe(win);

  win.date = +new Date();
  sortWindows();

  win.onclick = (e) => {
    win.date = +new Date();
    sortWindows();
  };
  win.querySelector(".head").addEventListener(`touchstart`, (e) => {
    win.date = +new Date();
    sortWindows();

    win.dx = win.offsetLeft - e.touches[0].pageX;
    win.dy = win.offsetTop - e.touches[0].pageY;
    dragging = win;

    return false;
  });
  win.querySelector(".head").addEventListener(`dragstart`, (e) => {
    win.date = +new Date();
    sortWindows();

    win.dx = win.offsetLeft - e.clientX;
    win.dy = win.offsetTop - e.clientY;
    dragging = win;

    e.preventDefault();
    return false;
  });
  win.querySelector(".head").addEventListener(`dragover`, (e) => {
    e.preventDefault();
    dragging = null;
    return false;
  });
  win.querySelector(".change").onclick = (e) => changeRecipe(win);
  win.querySelector(".close").onclick = (e) => win.remove();
  [...win.querySelectorAll(".slot")].forEach((i) => {
    i.style.fontSize = getFontSize(i.textContent.length);
  });
  [...win.querySelectorAll(".active")].forEach((i) => {
    i.onclick = function (e) {
      openWindow(
        this.title.getItem() || {
          name: this.title,
          from: [],
          to: [],
        }
      );

      e.preventDefault();
      e.cancelBubble = true;
      return false;
    };
  });
}



const isActive = itemName => {
  if (itemName == unknownItem) return 'unknown';
  if ([furnaceProcess, timeProcess, ashProcess, anyItem, emptyItem, compressorProcess, acceleratorProcess].includes(itemName)) return 'special';
  if (itemName.getItem().from.length) return 'active';
  return 'inactive';
};
const ashWater = itemName => {
  if (itemName != "Water Cube") return '';
  return `<div class="waterLine"></div>`;
};
const toSlot = itemName => `<span class="slot ${isActive(itemName)}" title="${itemName}">${itemName.replace('[', '').replace(']', '')}</span>`;
const noRecipeText = win => win.item.noResult ? '[No Combinations]' : '[No Data]';
function changeRecipe(win) {
  win.view = !win.view;
  if (win.view) {
    win.querySelector(".body").innerHTML = `${
      win.item.to
      .map((r) => {
        let rec;

        if (r.type == "craft")
          rec = `<div class="recipeData">
            ${toSlot(r.sources[1])}
            <span class="sign">+</span>
            ${toSlot(r.sources[0])}
            <span class="sign">=</span>
            ${toSlot(r.result)}
        </div>`;

        if (r.type == "ash")
          rec = `<div class="recipeData">
            ${ashWater(r.sources[2])}
            ${toSlot(r.sources[1])}
            <span class="sign">+</span>
            ${toSlot(r.sources[0])}
            <span class="sign">=</span>
            ${toSlot(r.result)}
        </div>`;

        return `<div class="itemRecipe">${rec}</div>`;
      })
      .join("")}`;
  } else {
    win.querySelector(".body").innerHTML = `${
      win.item.from
      .map((r) => {
        let rec;

        if (r.type == "location")
          rec = `<div class="recipeData locationRecipe">
            <span class="recipeType location">Location</span>
            <span class="sign">:</span>
            <span class="slot">${r.sources[0]}</span>
        </div>`;

        if (r.type == "loot")
          rec = `<div class="recipeData lootRecipe">
            <span class="recipeType loot">Loot</span>
            <span class="sign">:</span>
            <span class="slot">${r.sources[0]}</span>
        </div>`;

        if (r.type == "craft")
          rec = `<div class="recipeData">
            <span class="recipeType craft">Craft</span>
            <span class="sign">:</span>
            ${toSlot(r.sources[1])}
            <span class="sign">+</span>
            ${toSlot(r.sources[0])}
        </div>`;

        if (r.type == "ash")
          rec = `<div class="recipeData">
            <span class="recipeType craft">Ash Sifter</span>
            <span class="sign">:</span>
            ${ashWater(r.sources[2])}
            ${toSlot(r.sources[1])}
            <span class="sign">+</span>
            ${toSlot(r.sources[0])}
        </div>`;

        return `<div class="itemRecipe">${rec}</div>`;
      })
      .join("")}`;
  }

  if (!win.querySelector(".body").innerHTML.trim().length)
    win.querySelector(".body").innerHTML = `<div class="itemRecipe"><div class="recipeData noData">${noRecipeText(win)}</div></div>`;
  
  [...win.querySelectorAll(".slot")].forEach((i) => {
    i.style.fontSize = getFontSize(i.textContent.length);
  });
  [...win.querySelectorAll(".active"), ...win.querySelectorAll(".inactive"), ...win.querySelectorAll(".special")].forEach((i) => {
    i.onclick = function (e) {
      openWindow(
        this.title.getItem() || {
          name: this.title,
          from: [],
          to: [],
        }
      );

      e.preventDefault();
      e.cancelBubble = true;
      return false;
    };
  });
}



document.onmousemove = function (e) {
  if (!dragging) return;
  dragging.style.left = e.clientX + dragging.dx + "px";
  dragging.style.top = e.clientY + dragging.dy + "px";
};
document.ontouchmove = function (e) {
  if (!dragging) return;
  dragging.style.left = e.touches[0].pageX + dragging.dx + "px";
  dragging.style.top = e.touches[0].pageY + dragging.dy + "px";
};
document.onmouseup = function (e) {
  dragging = null;
};
document.ontouchcancel = function (e) {
  dragging = null;
};
document.ontouchend = function (e) {
  dragging = null;
};
