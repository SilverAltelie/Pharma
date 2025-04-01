var $ = jQuery.noConflict();
function updateProduct(button) {
    var itemIdClass= $(button).parent().parent().attr('class');
    var itemId = itemIdClass.split(' ')[0].split('-').pop();
    var quantity = $(button).parent().parent().find(".qtyProduct").val();
    window.location.href = "cart/update/"+itemId+'/'+quantity;
}
function deleteProduct(button) {
    var itemIdClass= $(button).parent().parent().attr('class');
    var itemId = itemIdClass.split(' ')[0].split('-').pop();
    window.location.href = "cart/delete/"+itemId;
}
// function calculateTotal() {
//     const priceElements = document.querySelectorAll('.price-product-total');
//     let total = 0;
//
//     priceElements.forEach(element => {
//         console.log(element.textContent);
//         total += parseFloat(convertNumberFormat(element.textContent)) || 0;
//     });
//
//     const subtotalElement = document.querySelector('.cart-subtotal');
//     subtotalElement.textContent = total.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,'); // Format to 2 decimal places
// }
// function convertNumberFormat(input) {
//     let noComma = input.replace(/,/g, '');
//
//     let formattedNumber = noComma;
//
//     return formattedNumber;
// }
// window.onload = calculateTotal;



