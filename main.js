const searchInput = document.querySelector(".searchInput");
const searchBtn = document.querySelector(".searchBtn");
const randomBlk = document.getElementById("randomBlk");
const favLists = document.querySelector(".favLists");
const mealInfoBlk = document.querySelector(".mealInfoBlk");
const foodListBlk = document.querySelector(".foodListBlk");
const foodList = document.querySelector(".foodList");
const foodListtxt = document.querySelector(".foodListtxt");

// Random Food

const fetchRandomMeal = async () => {
  const data = await fetch(
    "https://www.themealdb.com/api/json/v1/1/random.php"
  );
  const jsonData = await data.json();
  const meal = jsonData.meals[0];
  // console.log(jsonData);
  // return meal;

  addRandomMeal(meal);
};

const addRandomMeal = (meal) => {
  // console.log(meal);

  const mealbox = createMealBox(meal);

  randomBlk.appendChild(mealbox);
  // console.log(mealbox);
  favMeal();
  // getLSData();
};

function createMealBox(meal) {
  const mealbox = document.createElement("li");
  mealbox.classList.add("foodBox");
  mealbox.innerHTML = `
  <div class="foodTemplate">
  <img 
    onclick="mealInfo(${meal.idMeal})" 
    data-mealId="${meal.idMeal}"
    src="${meal.strMealThumb}"
    alt="${meal.strMeal}"
  />
  <div class="foodBar">
    <span>${meal.strMeal}</span>
    <button class="favBtn" data-idMeal="${meal.idMeal}">
      <i class="fa-solid fa-heart"></i>
    </button>
  </div>
</div>`;
  // console.log(mealbox);`
  // favMeal();

  return mealbox;
}

fetchRandomMeal();

function favMeal() {
  const favBtn = document.querySelectorAll(".favBtn");
  fixProblem1(favBtn);
  // fixProblem2(favBtn);
  // console.log(favBtn);
  for (let i = 0; i < favBtn.length; i++) {
    const favbtn = favBtn[i];

    favbtn.addEventListener("click", () => {
      // console.log(favbtn.parentElement.parentElement);
      const curMealId = favbtn.getAttribute("data-idMeal");
      // console.log(curMealId);
      favbtn.classList.toggle("active");

      if (favbtn.classList.contains("active")) {
        setLSData(curMealId);
      } else {
        deleteLSData(curMealId);
      }

      favLists.innerHTML = "";
      showFavMeals();
      // delFavMeal();
    });
  }
}

function fixProblem2(favBtn) {
  return favBtn;
}

function delFavMeal(mealId) {
  // const delBtns = document.querySelectorAll(".delBtn");
  // console.log(delBtns);
  // for (let i = 0; i < delBtns.length; i++) {
  // const delBtn = delBtns[i];
  // const delBtn = document.querySelectorAll(".delBtn")
  // const curMealId = e.target.getAttribute("data-idMeal");
  // console.log(e);
  const favBtn = document.querySelectorAll(".favBtn");

  console.log(favBtn);
  console.log(mealId);
  favBtn.forEach((favbtn) => {
    const name = favbtn.getAttribute("data-idMeal");
    if (mealId == name) favbtn.classList.remove("active");
    // console.log(name);
  });
  deleteLSData(mealId);
  favLists.innerHTML = "";

  // console.log(mealId.parentNode);
  showFavMeals();
}

//Local Storage Operations

function setLSData(mealId) {
  // const mealId = meal.idMeal;
  const lsdata = getLSData();
  // console.log(lsdata);
  // console.log([...lsdata, mealId]);
  localStorage.setItem("MealIds", JSON.stringify([...lsdata, mealId]));
}

function getLSData() {
  const LSData = JSON.parse(localStorage.getItem("MealIds"));
  // LSData ? console.log("jei") : console.log("bye");
  // console.log(LSData);
  if (LSData) return LSData;
  else return [];
}

function deleteLSData(delId) {
  const lsdata = getLSData();
  // console.log(lsdata);
  const filIds = lsdata.filter((filid) => filid != delId);
  localStorage.setItem("MealIds", JSON.stringify([...filIds]));
  // console.log([...filIds]);
}

// Get Meal Data By Id

async function getMealById(mealId) {
  const datas = await fetch(
    "https://www.themealdb.com/api/json/v1/1/lookup.php?i=" + mealId
  );
  const jsonData = await datas.json();
  const mealData = jsonData.meals[0];
  return mealData;
}

document.addEventListener("DOMContentLoaded", () => {
  showFavMeals();
  // console.log("jei");
});

async function showFavMeals() {
  const favMealIds = getLSData();
  console.log(favMealIds);

  favMealIds.forEach(async (favMealId) => {
    const favMeal = await getMealById(favMealId);
    const favMealBox = document.createElement("li");
    favMealBox.innerHTML = `
      <img
      onclick="mealInfo(${favMeal.idMeal})"
      src="${favMeal.strMealThumb}"
      alt="${favMeal.strMeal}"
      />
      <span>${favMeal.strMeal}</span>
      <button class="delBtn" onclick="delFavMeal(${favMeal.idMeal})" data-idMeal="${favMeal.idMeal}">
        <i class="fa-sharp fa-solid fa-circle-xmark"></i>
      </button>
    `;
    // console.log(favMealBox);

    favLists.appendChild(favMealBox);
  });
}

// function showMeal(favMeal) {}

async function mealInfo(mealId) {
  const mealData = await getMealById(mealId);
  // console.log(mealData);

  const ingredientInfo = [];
  for (let i = 1; i <= 20; i++) {
    var strIngredient = mealData["strIngredient" + i];
    var strMeasure = mealData["strMeasure" + i];
    // if (strIngredient) console.log(strIngredient);
    // if (strMeasure) console.log(strMeasure);
    if (strIngredient && strMeasure)
      ingredientInfo.push(`${strIngredient}` + " -> " + `${strMeasure}`);
  }

  const getIngredientUl = getIngredientLi(ingredientInfo);
  // console.log(getIngredientUl);

  const mealInfobox = document.createElement("div");
  mealInfobox.classList.add("mealInfoBox");
  mealInfobox.innerHTML = `<h3 class="mitxt">${mealData.strMeal}</h3>
  <img
    class="miImg"
    src="${mealData.strMealThumb}"
  alt="${mealData.strMeal}"
  />
  <div class="rcpBox">
    <h3>Recipe</h3>
    <p class="recInfo">
      ${mealData.strInstructions}
    </p>
  </div>
  <div class="ingBox">
    <h3>Ingredient</h3>
    ${getIngredientUl.innerHTML}
  </div>
  <div class="midelBtn">
    <i class="fa-sharp fa-solid fa-circle-xmark"></i>
  </div>`;

  mealInfoBlk.appendChild(mealInfobox);
  mealInfoBlk.style.display = "flex";

  // console.log(mealInfobox);
  const midelBtn = document.querySelector(".midelBtn");
  midelBtn.addEventListener("click", () => {
    mealInfoBlk.style.display = "none";

    //remove old info
    mealInfobox.innerHTML = "";
    mealInfobox.classList.remove("mealInfoBox");
  });
  // console.log(ingredientInfo);
}

function getIngredientLi(ingredientInfo) {
  const ingUl = document.createElement("ul");
  ingUl.classList.add("ingList");
  ingredientInfo.forEach((ing) => {
    const ingLi = document.createElement("li");
    ingLi.innerHTML = `${ing}`;
    ingUl.appendChild(ingLi);
  });
  return ingUl;
}

async function searchMeal(mealName) {
  const datas = await fetch(
    "https://www.themealdb.com/api/json/v1/1/search.php?s=" + mealName
  );
  const jsonDatas = await datas.json();
  const mealData = jsonDatas.meals;
  console.log(mealData);
  return mealData;
}

async function afterClick() {
  try {
    var srchInput = searchInput.value;
    if (srchInput) {
      const srcMealData = await searchMeal(srchInput);
      randomBlk.style.display = "none";
      foodListBlk.style.display = "block";
      foodListBlk.style.backgroundColor = "rgba(221, 226, 178, 0.849)";
      foodListtxt.style.color = " rgba(255, 8, 193, 0.938)";
      foodList.innerHTML = "";
      foodListtxt.innerText = `${srchInput}` + " Related Foods";
      srcMealData.forEach((srcMeal) => {
        const mealbox = createMealBox(srcMeal);
        console.log(mealbox);
        foodList.appendChild(mealbox);
      });
    }
    favMeal();
    foodListBlk.scrollIntoView({
      behavior: "smooth",
    });
  } catch (err) {
    foodListtxt.innerText =
      "' " + `${srchInput}` + " '" + " Related Foods Not Found !!!";
    foodListBlk.style.backgroundColor = "red";
    foodListtxt.style.color = "white";
    // randomBlk.style.display = "flex";
  }
}

searchBtn.addEventListener("click", afterClick);

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") afterClick();
});

// Country's Food

async function ctryMealDatas(ctryName) {
  try {
    const datas = await fetch(
      "https://www.themealdb.com/api/json/v1/1/filter.php?a=" + ctryName
    );
    const jsonDatas = await datas.json();
    const mealDatas = jsonDatas.meals;
    console.log(mealDatas);
    // return mealDatas;
    randomBlk.style.display = "none";
    foodListBlk.style.display = "block";
    foodListBlk.style.backgroundColor = "rgba(221, 226, 178, 0.849)";
    foodListtxt.style.color = " rgba(255, 8, 193, 0.938)";
    foodList.innerHTML = "";
    foodListtxt.innerText = `${ctryName}` + " Foods";
    mealDatas.forEach((ctrMeal) => {
      const mealbox = createMealBox(ctrMeal);
      foodList.appendChild(mealbox);
    });
    favMeal();
    foodListBlk.scrollIntoView({
      behavior: "smooth",
    });
  } catch (err) {
    foodListtxt.innerText =
      "' " + `${ctryName}` + " '" + " Foods Not Found !!!";
    foodListBlk.style.backgroundColor = "red";
    foodListtxt.style.color = "white";
    foodListBlk.scrollIntoView({
      behavior: "smooth",
    });
  }
}

//Alphabet Foods

async function alphaMealData(alphabet) {
  try {
    const datas = await fetch(
      "https://www.themealdb.com/api/json/v1/1/search.php?f=" + alphabet
    );
    const jsonDatas = await datas.json();
    const mealDatas = jsonDatas.meals;
    console.log(mealDatas);

    randomBlk.style.display = "none";
    foodListBlk.style.display = "block";
    foodListBlk.style.backgroundColor = "rgba(221, 226, 178, 0.849)";
    foodListtxt.style.color = " rgba(255, 8, 193, 0.938)";
    foodList.innerHTML = "";
    foodListtxt.innerText = `${alphabet}` + " Letter Foods";
    mealDatas.forEach((alphaMeal) => {
      const mealbox = createMealBox(alphaMeal);
      foodList.appendChild(mealbox);
    });
    favMeal();
    foodListBlk.scrollIntoView({
      behavior: "smooth",
    });
  } catch (err) {
    foodListtxt.innerText =
      "' " + `${alphabet}` + " '" + " Letter Foods Not Found !!!";
    foodListBlk.style.backgroundColor = "red";
    foodListtxt.style.color = "white";
    foodListBlk.scrollIntoView({
      behavior: "smooth",
    });
  }
}

//Category Foods

async function categoryMealData(catName) {
  try {
    const datas = await fetch(
      "https://www.themealdb.com/api/json/v1/1/filter.php?c=" + catName
    );
    const jsonDatas = await datas.json();
    const mealDatas = jsonDatas.meals;
    console.log(mealDatas);

    randomBlk.style.display = "none";
    foodListBlk.style.display = "block";
    foodListBlk.style.backgroundColor = "rgba(221, 226, 178, 0.849)";
    foodListtxt.style.color = " rgba(255, 8, 193, 0.938)";
    foodList.innerHTML = "";
    foodListtxt.innerText = `${catName}` + " Category Foods";
    mealDatas.forEach((catMeal) => {
      const mealbox = createMealBox(catMeal);
      foodList.appendChild(mealbox);
    });
    favMeal();
    foodListBlk.scrollIntoView({
      behavior: "smooth",
    });
  } catch (err) {
    foodListtxt.innerText = "' " + `${catName}` + " '" + " Foods Not Found !!!";
    foodListBlk.style.backgroundColor = "red";
    foodListtxt.style.color = "white";
    foodListBlk.scrollIntoView({
      behavior: "smooth",
    });
  }
}

function fixProblem1(favBtn) {
  const favMealIds = getLSData();
  console.log(favBtn);
  // const allMealBox =

  for (let i = 0; i < favMealIds.length; i++) {
    const element = favMealIds[i];
    // console.log(element);
    favBtn.forEach((favbtn) => {
      const name = favbtn.getAttribute("data-idMeal");
      if (element === name) favbtn.classList.add("active");
      // else favbtn.classList.remove("active");
      // console.log(name);
    });
  }
}
