import {
  cE,
  qS,
  createProduct,
  createModal,
  addCartItem,
  createLogIn,
} from "./utils/fn.js";

export const rootEl = qS("#root");
export const productList = cE("div");
const searchBar = qS("#search");
const priceRange = qS(".priceRange");
const categoryFilter = qS(".categoryFilter");
const ratingRange = qS(".ratingRange");
const cartButton = qS(".cartBtn");
const cart = qS(".cart");
export const cartItems = qS(".cartItems");
export let cartItemsList = [];
// const cartTotal = qS(".cartTotal");

// contatore
const itemCounter = (array, item) => {
  return array.filter((currentItem) => currentItem.id == item.id).length;
};

productList.className = "productList";

export let allProducts = [];
let searchInput = "";

fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => (allProducts = data.products));

// LOGIN
rootEl.append(productList);
document.body.append(createLogIn());

// spotlight effect
window.addEventListener("DOMContentLoaded", () => {
  const spotlight = document.querySelector(".spotlight");

  let spotlightSize = "transparent 160px, rgba(0, 0, 0, 0.85) 200px)";

  window.addEventListener("mousemove", (e) => updateSpotlight(e));

  window.addEventListener("mousedown", (e) => {
    spotlightSize = "transparent 130px, rgba(0, 0, 0, 0.95) 150px)";

    updateSpotlight(e);
  });

  window.addEventListener("mouseup", (e) => {
    spotlightSize = "transparent 160px, rgba(0, 0, 0, 0.85) 200px)";

    updateSpotlight(e);
  });

  function updateSpotlight(e) {
    spotlight.style.backgroundImage = `radial-gradient(circle at ${
      (e.pageX / window.innerWidth) * 100
    }% ${(e.pageY / window.innerHeight) * 150}%, ${spotlightSize}`;
  }
});

// In questo modo il search riesce a filtrare le cards per titolo, descrizione, marca e categoria
searchBar.addEventListener("input", (e) => {
  searchInput = e.target.value.toLowerCase();
  if (e.target.value.length >= 3) {
    productList.textContent = ""; //resetta il contenuto di productList
    allProducts
      .filter(
        (product) =>
          product.title.toLowerCase().includes(searchInput) ||
          product.description.toLowerCase().includes(searchInput) ||
          product.brand.toLowerCase().includes(searchInput) ||
          product.category.toLowerCase().includes(searchInput)
      )
      .forEach((product) => productList.append(createProduct(product)));
  } else {
    //resetta il contenuto di productList e rimette tutte le card quando svuotiamo l'imput
    productList.textContent = "";
    allProducts.forEach((product) =>
      productList.append(createProduct(product))
    );
  }
});

// Usando funzioni simili sono riuscito a rendere anche i filtri funzionanti
priceRange.addEventListener("change", function (e) {
  if (e.target.value) {
    productList.textContent = "";
    allProducts
      .filter(
        (product) =>
          product.price > e.target.value.split("-")[0] &&
          product.price <= e.target.value.split("-")[1]
      )
      .forEach((product) => productList.append(createProduct(product)));
  } else {
    productList.textContent = "";
    allProducts.forEach((product) =>
      productList.append(createProduct(product))
    );
  }
});

categoryFilter.addEventListener("change", function (e) {
  if (e.target.value) {
    productList.textContent = "";
    allProducts
      .filter((product) => product.category.includes(e.target.value))
      .forEach((product) => productList.append(createProduct(product)));
  } else {
    productList.textContent = "";
    allProducts.forEach((product) =>
      productList.append(createProduct(product))
    );
  }
});

ratingRange.addEventListener("change", function (e) {
  if (e.target.value) {
    productList.textContent = "";
    allProducts
      .filter(
        (product) =>
          product.rating > e.target.value.split("-")[0] &&
          product.rating < e.target.value.split("-")[1]
      )
      .forEach((product) => productList.append(createProduct(product)));
  } else {
    productList.textContent = "";
    allProducts.forEach((product) =>
      productList.append(createProduct(product))
    );
  }
});

// Carrello
cartButton.addEventListener("click", () => {
  cart.classList.toggle("show"); // nasconde e mostra il carrello
  cartItems.textContent = "";
  let quantity = 0;
  cartItemsList.forEach((item) => {
    let quantityI = itemCounter(cartItemsList, item);
    if (quantityI > 1) {
      quantity++;
    } else if (quantityI === 1) {
      quantity = 0;
    }
    cartItems.append(addCartItem(item, quantityI));
    if (quantity > 1) {
      cartItems.removeChild(cartItems.lastChild);
    }
  });
});
