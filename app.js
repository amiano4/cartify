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
                const item = document.createElement('div');
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
        
                productsList.appendChild(item)
            });
        }
        else {
            const item = document.createElement('div');
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