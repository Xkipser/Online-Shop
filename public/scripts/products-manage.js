const deleteProductBtnElements = document.querySelectorAll('.prod-container button');

async function deleteProduct(event) {
    const buttonElement = event.target;
    const productId = buttonElement.dataset.productid;
    const csrfToken = buttonElement.dataset.csrf;

    const response = await fetch('/admin/update-product/' + productId + '?_csrf=' + csrfToken, {
        method: 'DELETE'
    });

    if (!response.ok) {
        alert('Something went wrong!');
        return;
    }

    buttonElement.parentElement.parentElement.remove();
}

for (const deleteProductBtnElement of deleteProductBtnElements) {
    deleteProductBtnElement.addEventListener('click', deleteProduct);
}