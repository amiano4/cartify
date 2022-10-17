
var totalAmount = 0;

addEventListener('load',function(){
  let chartItem = JSON.parse(localStorage.getItem('cartify-cart-items') || "[]");

  if(this.localStorage.getItem('checkout')) {
    
    fetch('https://fakestoreapi.com/products/' + this.localStorage.getItem('checkout'))
              .then(res=>res.json())
              .then(p => {
                
                showItems([p])
                this.localStorage.removeItem('checkout')
                
              })  
  }
  else {
    showItems(chartItem)
  }
});

function showItems(chartItem) {
  
  const checkout_item = this.document.querySelector(".checkout_item");
  chartItem.forEach((product)=>
  {
    const row = this.document.createElement('div');
    row.setAttribute('class','row mb-4 border-bottom p-3');
    row.innerHTML = `
      <div class="col-md-6 p-5">
        <img src="${product.image}" alt="img" class="view-cart-img mx-auto">
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
                      Total
                      <span class="badge bg-dark p-2 ms-2">
                          $   <span class="total">${product.price}</span>
                      </span>
                  </div>
              </div>
          </div>
      </div>
    `;
    
    row.querySelectorAll('.c-btn').forEach(btn => {
      btn.addEventListener('click', function() {
          const counter = row.querySelector('.quantity-input');

          if(btn.classList.contains('less')) {
            if(parseInt(counter.value) - 1 >=1)
            updateTotalAmount(-product.price);
              counter.value = parseInt(counter.value) - 1 < 1 ? 1 : parseInt(counter.value) - 1;
          }
          else if(btn.classList.contains('more')) {
            updateTotalAmount(+product.price)
              counter.value = parseInt(counter.value) + 1;
          }

          row.querySelector('.total').innerHTML = (parseInt(counter.value) * product.price).toFixed(2);
      })
    });

    updateTotalAmount(product.price);

    checkout_item.append(row)
    

  })
}


function updateTotalAmount(price) {
  totalAmount += price;
  document.querySelector('.amounttopay').innerText = `$ ` + totalAmount.toFixed(2);
}

document.getElementById('form').addEventListener('submit', function(e) {
  e.preventDefault()
  e.stopPropagation()
    modalify.confirm("Checkout confirmation", "Do you really wish to proceed?").then(x => {
      if(x.isConfirmed) {
        modalify.ok().then(() => {
          localStorage.clear();
          location.href = "./"
        });
      }
    });
});