const productsList = document.querySelector('.products-list');

addEventListener('load', function() {

    displayProducts();

    this.document.querySelectorAll('.categories a').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();

            const target =  a.getAttribute('href').replace('#', '/');

            displayProducts(target == '/home' ? "" : '/category' + target);
        })
    })
})

// function
function displayProducts(category = "") {
    productsList.innerHTML = '';

    
    fetch('https://fakestoreapi.com/products' + category)
    .then(res=>res.json())
    .then(json=> {
        // console.log(json)
        document.querySelector('.products-label').innerHTML = `
                    Products${category == "" ? "" : `<span class="p-subcategory">${json[0].category}</span>`}`;
        
        if(json.length > 1) {
            json.forEach(product => {
                // console.log(product.category)
                const item = document.createElement('a');
                item.href = product.title;
                item.setAttribute('class', 'item-wrap');
                item.innerHTML = `
                    <div class="item">
                        <div class="img">
                            <img src="${product.image}" alt="">
                        </div>
                        <div class="label">
                            <span class="name">${product.title}</span>
                            <span class="price">${product.price}</span>
                            </div>
                            <div class="p-actions">
                                <button type="button" class="pa-btn place-order">
                                    Checkout
                                </button>
                                <button type="button" class="pa-btn add-to-cart">
                                    <i class="ri-shopping-cart-line"></i>
                                </button>
                            </div>
                    </div>
                `;

                item.addEventListener('click', function(e) {
                    e.preventDefault();

                    openViewProductModal(product);
                })
        
                productsList.appendChild(item)
            });
        }
        else {
            const item = document.createElement('a');
            item.setAttribute('class', 'item-wrap');
            item.innerHTML = `
            <div class="item">
                <div class="img">
                    <img src="${json.image}" alt="">
                </div>
                <div class="label">
                    <span class="name">${json.title}</span>
                    <span class="price">${json.price}</span>
                    </div>
                    <div class="p-actions">
                        <button type="button" class="pa-btn place-order">
                            Checkout
                        </button>
                        <button type="button" class="pa-btn add-to-cart">
                            <i class="ri-shopping-cart-line"></i>
                        </button>
                    </div>
            </div>
            `;
    
            productsList.appendChild(item)
        }
    })
}

function openViewProductModal(product) {
    const modal = document.createElement('div');
    modal.setAttribute('class', 'modal');
    modal.innerHTML = `
    <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title">View Product</h1>
            <button type="button" class="modal-close"></button>
        </div>
        <div class="modal-body">
            <div class="p-grid">
                <div class="p-view">
                    <img src="${product.image}" alt="img">
                </div>
                <div class="p-details">
                    <span class="name">${product.title}</span>
                    <span class="description">${product.description}</span>
                    <span class="price">Price per item: <span class="p">${product.price} USD</span></span>
                </div>
            </div>
            <div class="checkout-details">
                <div class="quantity">
                    <div>Quantity</div>
                    <button type="button" class="c-btn less"><</button>
                    <input type="number" class="quantity-counter" value="1" step="1">
                    <button type="button" class="c-btn more">></button>
                </div>
                <div class="total">Total price: ${product.price} USD</div>
            </div>
        </div>
        <div class="modal-footer">
            <div class="p-actions">
                <a href="#" class="checkout">Checkout</a>
                <a href="#" class="cart" style="margin-left: 20px;">
                    Add to
                    <i class="ri-shopping-cart-line"></i>   
                </a>
            </div>
        </div>
    </div>
    `;

    modal.querySelectorAll('.c-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const counter = modal.querySelector('.quantity-counter');

            if(btn.classList.contains('less')) {
                counter.value = parseInt(counter.value) - 1 < 1 ? 1 : parseInt(counter.value) - 1;
            }
            else if(btn.classList.contains('more')) {
                counter.value = parseInt(counter.value) + 1;
            }

            modal.querySelector('.total').innerHTML = `Total price: ${(parseInt(counter.value) * product.price).toFixed(2)} USD`;
        })
    })

    modal.querySelector('.modal-close').addEventListener('click', function() {
        modal.remove();
    })

    document.body.append(modal);
}