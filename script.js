let cartCount = 0;

document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function() {
        cartCount++;
        document.getElementById('cart-count').textContent = cartCount;
        alert("Item added to cart!");
    });
});

document.querySelectorAll('.box').forEach(box => {
    box.addEventListener('click', function() {
        const productName = box.getAttribute('data-name');
        const productPrice = box.getAttribute('data-price');
        
        document.querySelector('.product-name').textContent = "Product: " + productName;
        document.querySelector('.product-price').textContent = "Price: ₹" + productPrice;
        
        document.querySelector('.popup').style.display = 'block';
    });
});

document.querySelector('.close-btn').addEventListener('click', function() {
    document.querySelector('.popup').style.display = 'none';
});
