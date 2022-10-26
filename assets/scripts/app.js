class Product {
  constructor(title, image, price, description) {
    this.title = title;
    this.imageUrl = image;
    this.price = price;
    this.description = description;
  }
}

class ElementAttribute {
  constructor(attrName, attrValue) {
    this.name = attrName;
    this.value = attrValue;
  }
}

class Component {
  constructor(renderHookId) {
    this.hookId = renderHookId;
  }

  createRootElement(tag, cssClasses, attributes) {
    const rootElement = document.createElement(tag);
    if (cssClasses) {
      rootElement.className = cssClasses;
    }
    if (attributes) {
      for (const attr of attributes) {
        rootElement.setAttribute(attr.name, attr.value);
      }
    }
    document.getElementById(this.hookId).append(rootElement);
    return rootElement;
  }
}

class ShoppingCart extends Component {
  items = [];

  set cartItems(value) {
    this.items = value;
    this.totalPrice.innerHTML = `<h2>Total: ${this.totalAmount.toFixed(
      2
    )}\$</h2>`;
  }

  get totalAmount() {
    const sum = this.items.reduce(
      (prevValue, currentValue) => prevValue + currentValue.price,
      0
    );
    return sum;
  }

  constructor(renderHookId) {
    super(renderHookId);
  }

  addProduct(product) {
    const updatedItems = [...this.items];
    updatedItems.push(product);
    this.cartItems = updatedItems;
  }

  render() {
    const cartEl = this.createRootElement("section", "cart");
    cartEl.innerHTML = `
        <h2>Total: ${0}\$</h2>
        <button>Order!</button>
        `;
    cartEl.className = "cart";
    this.totalPrice = cartEl.querySelector("h2");
  }
}

class SingleProduct extends Component {
  constructor(product, renderHookId) {
    super(renderHookId);
    this.product = product;
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  render() {
    const prodEl = this.createRootElement("li", "product-item");
    prodEl.innerHTML = `
        <div>
        <img src="${this.product.imageUrl}" alt="${this.product.title}">
        </div>
        <div class="product-item__content">
        <h2>${this.product.title}</h2>
        <h3>${this.product.price}\$</h3>
        <p>${this.product.description}</p>
        <button>Add to cart</button>
        </div>
        `;
    const addCartButton = prodEl.querySelector("button");
    addCartButton.addEventListener("click", this.addToCart.bind(this));
  }
}

class ProductList extends Component {
  products = [
    new Product(
      "PS2",
      "https://upload.wikimedia.org/wikipedia/commons/1/1c/PS2-Versions.jpg",
      99.99,
      "Best console ever"
    ),
    new Product(
      "Xbox",
      "https://upload.wikimedia.org/wikipedia/commons/4/43/Xbox-console.jpg",
      95.99,
      "Second best console ever"
    ),
  ];

  constructor(renderHookId) {
    super(renderHookId);
  }

  render() {
    this.createRootElement("ul", "product-list", [
      new ElementAttribute("id", "prod-list"),
    ]);
    for (const prod of this.products) {
      const singleProduct = new SingleProduct(prod, "prod-list");
      singleProduct.render();
    }
  }
}

class Shop {
  render() {
    this.cart = new ShoppingCart("app");
    this.cart.render();
    const productList = new ProductList("app");
    productList.render();
  }
}

class App {
  static cart;

  static init() {
    const shop = new Shop();
    shop.render();
    this.cart = shop.cart;
  }
  static addProductToCart(product) {
    this.cart.addProduct(product);
  }
}

App.init();
