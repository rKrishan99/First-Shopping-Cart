//Variable that maintains the visible state of the cart
var cartVisible = false;

//We wait for all the elements of the page to load to execute the script
if(document.readyState == 'loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready();
}

function ready(){
    
    //Let's add functionality to the remove from cart buttons
    var buttonsEliminateItem = document.getElementsByClassName('btn-eliminate');
    for(var i=0;i<buttonsEliminateItem.length; i++){
        var button = buttonsEliminateItem[i];
        button.addEventListener('click',eliminateItemCart);
    }

    //Add functionality to the add quantity button
    var buttonsAddAmount = document.getElementsByClassName('add-amount');
    for(var i=0;i<buttonsAddAmount.length; i++){
        var button = buttonsAddAmount[i];
        button.addEventListener('click',addAmount);
    }

    //Add functionality to the subtract amount button
    var buttonsSubtractAmount = document.getElementsByClassName('subtract-amount');
    for(var i=0;i<buttonsSubtractAmount.length; i++){
        var button = buttonsSubtractAmount[i];
        button.addEventListener('click',subtractAmount);
    }

    //Add functionality to the Add to cart button
    var buttonsAddToCart = document.getElementsByClassName('button-item');
    for(var i=0; i<buttonsAddToCart.length;i++){
        var button = buttonsAddToCart[i];
        button.addEventListener('click', addToCartClicked);
    }

    //Add functionality to the buy button
    document.getElementsByClassName('btn-pay')[0].addEventListener('click',payClicked)
}
// We remove all items from the cart and hide it
function payClicked(){
    alert("Thank you for purchasing");
    //Remove all cart items
    var cartItems = document.getElementsByClassName('cart-items')[0];
    while (cartItems.hasChildNodes()){
        cartItems.removeChild(cartItems.firstChild)
    }
    updateTotalCart();
    hideCart();
}
//Function that controls the clicked button to add to the cart
function addToCartClicked(event, product){
    var button = event.target;
    var item = button.parentElement;
    var title = product.name;
    var imageSrc = item.getElementsByClassName('img-item')[0].src;
    var price = product.price;
    

    addItemToCart(title, price, imageSrc);

    makeVisibleCart();
}

//Function that makes the cart visible
function makeVisibleCart(){
    cartVisible = true;
    var cart = document.getElementsByClassName('cart')[0];
    cart.style.marginRight = '0';
    cart.style.opacity = '1';

    var items =document.getElementsByClassName('container-items')[0];
    items.style.width = '60%';
}

//Function that adds an item to the cart
function addItemToCart(title, price, imageSrc){
    var item = document.createElement('div');
    item.classList.add = ('item');
    var itemsCart = document.getElementsByClassName('cart-items')[0];

    //we check that the item you are trying to enter is not in the cart
    var namesItemsCart = itemsCart.getElementsByClassName('cart-item-title');
    for(var i=0;i < namesItemsCart.length;i++){
        if(namesItemsCart[i].innerText==title){
            alert("The item is already in the cart");
            return;
        }
    }

    var itemCartContainer = `
        <div class="cart-item">
            <img src="${imageSrc}" width="80px" alt="">
            <div class="cart-item-details">
                <span class="cart-item-title">${title}</span>
                <div class="selector-amount">
                    <i class="fa-solid fa-minus subtract-amount" class="btn-mius-plus" ></i>
                    <input type="text" value="1" class="cart-item-amount" disabled>
                    <i class="fa-solid fa-plus add-amount class="btn-mius-plus""></i>
                </div>
                <span class="cart-item-price">${price}</span>
            </div>
            <button class="btn-eliminate">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `
    item.innerHTML = itemCartContainer;
    itemsCart.append(item);

    //Add the delete functionality to the new item
    item.getElementsByClassName('btn-eliminate')[0].addEventListener('click', eliminateItemCart);

    //Add the subtract amount of the new item functionality
    var buttonSubtractAmount = item.getElementsByClassName('subtract-amount')[0];
    buttonSubtractAmount.addEventListener('click',subtractAmount);

    // We add the functionality to add quantity of the new item
    var buttonAddAmount = item.getElementsByClassName('add-amount')[0];
    buttonAddAmount.addEventListener('click',addAmount);

    //We update total
    updateTotalCart();
}
//Increase the number of the selected element by one
function addAmount(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    console.log(selector.getElementsByClassName('cart-item-amount')[0].value);
    var amountUpdate = selector.getElementsByClassName('cart-item-amount')[0].value;
    amountUpdate++;
    selector.getElementsByClassName('cart-item-amount')[0].value = amountUpdate;
    updateTotalCart();
}
//Remainder by one the quantity of the selected item
function subtractAmount(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    console.log(selector.getElementsByClassName('cart-item-amount')[0].value);
    var amountUpdate = selector.getElementsByClassName('cart-item-amount')[0].value;
    amountUpdate--;
    if(amountUpdate>=1){
        selector.getElementsByClassName('cart-item-amount')[0].value = amountUpdate;
        updateTotalCart();
    }
}

//Remove the selected item from the cart
function eliminateItemCart(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    //Update the cart total
    updateTotalCart();

    //the following function checks if there are items in the cart
    // If there is not, I delete the cart
    hideCart();
}
//Function that checks if there are items in the cart. If there is no hidden cart.
function hideCart(){
    var cartItems = document.getElementsByClassName('cart-items')[0];
    if(cartItems.childElementCount==0){
        var cart = document.getElementsByClassName('cart')[0];
        cart.style.marginRight = '-100%';
        cart.style.opacity = '0';
        cartVisible = false;
    
        var items =document.getElementsByClassName('container-items')[0];
        items.style.width = '100%';
    }
}
//Update the cart total
function updateTotalCart(){
    //select the cart container
    var cartContainer = document.getElementsByClassName('cart')[0];
    var cartItems = cartContainer.getElementsByClassName('cart-item');
    var total = 0;
    // iterate through each item in the cart to update the total
    for(var i=0; i< cartItems.length;i++){
        var item = cartItems[i];
        var priceElement = item.getElementsByClassName('cart-item-price')[0];
        //remove the weight symbol and the thousandths point.
        var price = parseFloat(priceElement.innerText.replace('$','').replace('.','.'));
        var amountItem = item.getElementsByClassName('cart-item-amount')[0];
        console.log(price);
        var amount = amountItem.value;
        total = total + (price * amount);
    }
    total = Math.round(total * 100)/100;

    document.getElementsByClassName('cart-price-total')[0].innerText = '$'+total.toLocaleString("es") + ".00";

}



function loadProducts() {
    fetch("https://dummyjson.com/products")
      .then((respose) => {
        return respose.json();
      })
      .then((json) => {
        const productsDiv = document.getElementById("product-container");
        const products = json;
        for (var product of products.products) {
          const id = "product" + uuid.v4();
          let productHtml = generateProductHtml(id, product);
          productsDiv.innerHTML += productHtml;
        }
      })
      .catch((error) => {
        console.log(error);
      });
}

function generateProductHtml(id, product) {
    return `  
    <div class="item" id="${id}">

        <figure class="item-fig">
            <img src="${product.thumbnail}" alt="" class="img-item"/>
        </figure>
        <div class="p-details">
            <div class="p-title">
                <span class="title-item">${product.title}</span>
            </div>
            <div class="p-discription">
                <span class="text-xs text-gray-400 leading-none">${product.description}</span>
            </div>
            
            <div class="p-price">
                <span class="price-item">$${product.price}</span>
            </div>
        </div>
        
            <button class="button-item"

            onclick="addToCartClicked(event,{id:'${id}',name:'${product.title}',price:${product.price}})"
            href="javascript:;"
        
            >Add to cart</button>   

        

    </div>
    `;
}
  
loadProducts();

//----------------------

const productsPerPage = 8; // Number of products to display per page

function loadProducts(page) {
    fetch("https://dummyjson.com/products")
        .then((response) => response.json())
        .then((json) => {
            const productsDiv = document.getElementById("product-container");
            const products = json.products;

            // Calculate the starting and ending index for the current page
            const startIndex = (page - 1) * productsPerPage;
            const endIndex = startIndex + productsPerPage;

            // Clear the productsDiv before appending new products
            productsDiv.innerHTML = "";

            // Loop through products for the current page and generate HTML
            for (let i = startIndex; i < endIndex && i < products.length; i++) {
                const id = "product" + uuid.v4();
                let productHtml = generateProductHtml(id, products[i]);
                productsDiv.innerHTML += productHtml;
            }

            // Generate pagination links
            generatePaginationLinks(page, products.length);
        })
        .catch((error) => {
            console.log(error);
        });
}

// Generate pagination links
function generatePaginationLinks(currentPage, totalProducts) {
    const totalPages = Math.ceil(totalProducts / productsPerPage);
    const paginationDiv = document.getElementById("pagination");
    paginationDiv.innerHTML = "";

    for (let i = 1; i <= totalPages; i++) {
        const link = document.createElement("a");
        link.href = "javascript:;";
        link.textContent = i;
        link.classList.add("pagination-link");
        if (i === currentPage) {
            link.classList.add("active");
        }
        link.addEventListener("click", () => {
            loadProducts(i);
        });
        paginationDiv.appendChild(link);
    }
}

loadProducts(1); 



// Function to filter products based on search query
function filterProducts(query) {
    const productItems = document.getElementsByClassName('item');
    
    for (const item of productItems) {
        const title = item.querySelector('.title-item').textContent.toLowerCase();
        const description = item.querySelector('.p-discription').textContent.toLowerCase();
        
        if (title.includes(query) || description.includes(query)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    }
}

// Event listener for search button
document.getElementById('search-button').addEventListener('click', () => {
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.trim().toLowerCase();
    filterProducts(searchTerm);
});

