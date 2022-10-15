const productsList = document.querySelector('.products-list');

addEventListener('load', function() {

    displayProducts();

    this.document.querySelectorAll('.categories a').forEach(a => {
        a.addEventListener('click', function(e) {
            e.preventDefault();

            const target =  a.getAttribute('href').replace('#', '/');

            displayProducts(target == '/home' ? "" : '/category' + target);
        })
    });

    this.document.querySelector('.cart > .cart-items').innerText = JSON.parse(localStorage.getItem('cartify-cart-items') || "[]").length;

    initTooltips();
});

function initTooltips() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
}

document.querySelector('.searchbtn').addEventListener('click', function() {
    document.querySelector('.searchfield').style.display = 'flex';
});

document.querySelector('.searchfield button').addEventListener('click', function() {
    document.querySelector('.searchfield').style.display = 'none';
})

document.getElementById('viewProductModal').addEventListener('hidden.bs.modal', function() {
    document.getElementById('productContent').innerHTML = ""
});

var myModal = new bootstrap.Modal(document.getElementById('viewProductModal'), {
    keyboard: false
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
                const item = document.createElement('div');
                item.setAttribute('class', 'col-sm-6 col-md-4 col-lg-3 p-2');
                item.innerHTML = `
                    <a href="${product.title}" style="display: inline-block; text-decoration: none; height: 100%; width: 100%;">
                        <div class="card mx-auto" style="width: 15rem; height: 100%;">
                            <img src="${product.image}" class="card-img-top item-img mx-auto mt-2" alt="product_image">
                            <div class="card-body d-flex flex-column">
                            <div class="card-title flex-grow-1">${product.title}</div>
                            <span class="card-text badge bg-secondary align-self-start my-3">$ ${product.price}</span>
                            <div class="d-flex card-actions gap-2"> 
                                <button type="button" class="btn btn-outline-dark border-0 rounded-circle checkout"
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Checkout">
                                    <i class="ri-handbag-line"></i>
                                </button>
                                <button type="button" class="btn btn-outline-dark border-0 rounded-circle add-to-cart
                                    ${
                                        JSON.parse(localStorage.getItem('cartify-cart-items') || "[]").find(x => x.id == product.id) 
                                        ? `disabled`
                                        : ``
                                    }"
                                    data-bs-toggle="tooltip" data-bs-placement="bottom" title="Add to cart">
                                    <i class="ri-shopping-cart-2-fill"></i>
                                </button>
                            </div>
                            </div>
                        </div>
                    </a>
                `;

                item.addEventListener('click', function(e) {
                    e.preventDefault();

                    openViewProductModal(product, item);
                })

                item.querySelector('.add-to-cart').addEventListener('click', function(event) {
                    event.preventDefault();
                    event.stopPropagation();
                    
                    if(addtocart(product)) {
                        item.querySelector('.add-to-cart').classList.add('disabled')
                    }
                });
        
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
                    <button type="button" class="pa-btn add-to-cart 
                        ${JSON.parse(localStorage.getItem('cartify-cart-items') || "[]").find(x => x.id == json.id) ? "added" : ""}">
                        <i class="ri-shopping-cart-line"></i>
                    </button>
                </div>
            </div>
            `;

            item.addEventListener('click', function(e) {
                e.preventDefault();

                openViewProductModal(json);
            })

            item.querySelector('.add-to-cart').addEventListener('click', function(event) {
                event.preventDefault();
                event.stopPropagation();
                
                if(addtocart(json)) {
                    item.querySelector('.add-to-cart').classList.add('added')
                }
            });
    
            productsList.appendChild(item)
        }

        // initTooltips();
    })
}

function openViewProductModal(product, itemElement) {
    const modal = document.createElement('div');
    modal.setAttribute('class', '');
    modal.innerHTML = `
        <div class="container-fluid">
            <div class="row">
                <div class="col-md-6 p-5">
                    <img src="${product.image}" alt="img" class="view-img">
                </div>
                <div class="col-md-6">
                    <div class="d-flex flex-column h-100">
                        <div class="flex-grow-1">
                            <h3 class="text-underline">${product.title}</h3>
                            <p class="text-secondary" style="font-size: .9rem;">${product.description}</p>
                            <p class="badge bg-light text-dark fs-6">Price per item: <span class="badge bg-primary">$ ${product.price}</span></p>
                        </div>
                        <div class="mb-2">
                            <span class="w-50 d-inline-block">Quantity</span>
                        </div>
                        <div class="mb-3">
                            <div class="d-inline-flex gap-2 mb-2 w-50">
                                <button type="button" class="less btn btn-secondary c-btn">
                                    <i class="ri-arrow-left-s-line"></i>
                                </button>
                                <input type="number" class="form-control form-control-sm text-center border-0 quantity-input" value="1" max="99" min="0" step="1">
                                <button type="button" class="more btn btn-secondary c-btn">
                                    <i class="ri-arrow-right-s-line"></i>
                                </button>
                            </div>
                            <div class="mt-1 text-end">
                                Total amount
                                <span class="badge bg-dark p-2 ms-2">
                                    $ <span class="total">${product.price}</span>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="d-flex justify-content-end">
                <div class="p-actions">
                    <a href="#" class="checkout btn btn-info rounded-0 d-inline-flex align-items-center">
                        Checkout
                        <i class="ri-handbag-line ms-2"></i>
                    </a>
                    <a href="#" class="cart btn btn-warning text-white ms-3 rounded-0 d-inline-flex align-items-center
                        ${
                            JSON.parse(localStorage.getItem('cartify-cart-items') || "[]").find(x => x.id == product.id) 
                            ? `disabled`
                            : ``
                        }
                        ">
                        Add to cart
                        <i class="ri-shopping-cart-line ms-2"></i>   
                    </a>
                </div>
            </div>
        </div>
        
    `;

    modal.querySelectorAll('.c-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const counter = modal.querySelector('.quantity-input');

            if(btn.classList.contains('less')) {
                counter.value = parseInt(counter.value) - 1 < 1 ? 1 : parseInt(counter.value) - 1;
            }
            else if(btn.classList.contains('more')) {
                counter.value = parseInt(counter.value) + 1;
            }

            modal.querySelector('.total').innerHTML = (parseInt(counter.value) * product.price).toFixed(2);
        })
    });

    // add to card button
    if(!modal.querySelector('a.cart').classList.contains('disabled')) {
        modal.querySelector('a.cart').addEventListener('click', function(e) {
            e.preventDefault();
            if(addtocart(product)) {
                modal.querySelector('a.cart').classList.add('disabled');
    
                itemElement.querySelector('.add-to-cart').classList.add('disabled')

                myModal.hide();
            }
        });
    }

    document.getElementById('productContent').append(modal);
    myModal.show();
}

function addtocart(item) {
    const cartItems = JSON.parse(localStorage.getItem('cartify-cart-items') || "[]");
    
    if(cartItems.find(x => x.id == item.id))
        return false;

    cartItems.push(item);

    localStorage.setItem('cartify-cart-items', JSON.stringify(cartItems));

    document.querySelector('.cart > .cart-items').innerText = cartItems.length;

    return true;
}