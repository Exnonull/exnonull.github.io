items.sort((a, b) => {
  if (doNotLink.includes(a.name)) return 1;
  if (doNotLink.includes(b.name)) return -1;

  if (!a.from.length) return 1;
  if (!b.from.length) return -1;

  if ([a.name,b.name].sort(getSort())[0] == a.name) return -1;
  return 1;
}).forEach((item) => {
  const opt = document.createElement("option");
  opt.textContent = item.name;
  opt.value = item.name;
  opt.className = isActive(item.name);
  document.querySelector("#recipes").appendChild(opt);
});
input.onclick = function (e) {
  recipes.style.display = "block";
  input.style.borderRadius = "5px 5px 0 0";

  e.preventDefault();
  e.cancelBubble = true;
  return false;
};
for (let option of recipes.options) {
  option.onclick = function (e) {
    input.value = "";
    recipes.style.display = "none";
    input.style.borderRadius = "5px";

    openWindow(
      option.value.getItem() || {
        name: option.value,
        from: [],
        to: [],
      }
    );

    e.preventDefault();
    e.cancelBubble = true;
    return false;
  };
}
document.onclick = function (e) {
  recipes.style.display = "none";
  input.style.borderRadius = "5px";
  e.preventDefault();
  return false;
};

input.oninput = function () {
  currentFocus = -1;
  var text = input.value.toUpperCase();
  for (let option of recipes.options) {
    if (option.value.toUpperCase().indexOf(text) > -1 || text.trim().length == 0) {
      option.style.display = "block";
    } else {
      option.style.display = "none";
    }
  }
};
var currentFocus = -1;
input.onkeydown = function (e) {
  if (e.keyCode == 40) {
    currentFocus++;
    addActive(recipes.options);
  } else if (e.keyCode == 38) {
    currentFocus--;
    addActive(recipes.options);
  } else if (e.keyCode == 13) {
    e.preventDefault();
    if (currentFocus > -1) {
      /*and simulate a click on the "active" item:*/
      if (recipes.options) recipes.options[currentFocus].click();
    }
  }
};

function addActive(x) {
  if (!x) return false;
  removeActive(x);
  if (currentFocus >= x.length) currentFocus = 0;
  if (currentFocus < 0) currentFocus = x.length - 1;
  x[currentFocus].classList.add("optActive");
}
function removeActive(x) {
  for (var i = 0; i < x.length; i++) {
    x[i].classList.remove("optActive");
  }
}
