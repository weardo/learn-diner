import { menuArray } from './data.js'

let order = [];

document.addEventListener('click', function(e) {
    if(e.target.dataset.menuItem) {
        addOrderItem(parseInt(e.target.dataset.menuItem))
        renderOrderDetails();
    }
    
    if(e.target.id === 'order-submit-btn') {
        document.getElementById('payment-modal').style.display = 'block';
    }
    
    if(e.target.id === 'payment-btn') {
        e.preventDefault()
        handlePayment()
    }
    
    if(e.target.dataset.removeOrderItem) {
        removeOrderItem(parseInt(e.target.dataset.removeOrderItem))
        renderOrderDetails();
    }
})

function getPaymentFormDetails() {
    const name = document.getElementById('payment-input-name').value;
    const cardNo = document.getElementById('payment-input-card-no').value;
    const cardCVV = document.getElementById('payment-input-card-cvv').value;
    
    return {
        name, cardNo, cardCVV
    }
}

function handlePayment() {
    document.getElementById('payment-modal').style.display = 'none';
    document.getElementById('order').style.display = 'none'
    document.getElementById('success-toast').style.display = 'block';
    
}

function removeOrderItem(itemId) {
    console.log(order)
    order = order.filter(item => item.id !== itemId)   
    
    console.log(order)
}

function addOrderItem(itemId) {
    const menuItem = menuArray.find(menu => menu.id === itemId)
    const existingItem = order.find(orderItem => orderItem.id === menuItem.id)
    if(existingItem) {
        existingItem.count++
    } else {
        order.push({
            ...menuItem,
            count: 1
        })
    }
}

function getOrderTotalAmount() {
    return order.reduce((total, item) => {
        return total += item.count * item.price
    }, 0)
}

render();

function render() {
    document.getElementById('menu').innerHTML = getMenuHTML();
}

function renderOrderDetails() {
    if(order.length) {
        document.getElementById('order').style.display = 'block'
        document.getElementById('order-items').innerHTML = getOrderItemsHTML()
        document.getElementById('order-total-amount').innerText = '$' + getOrderTotalAmount()
    } else {
        document.getElementById('order').style.display = 'none'
    }
}

function getMenuHTML() {
    return menuArray.reduce((t, menu) => {
        return t += `
            <div class="menu-item" id="menu-${menu.id}">
                <div class="menu-item-details">
                    <div class="menu-item-emoji">${menu.emoji}</div>
                    <div class="menu-item-info">
                        <div class="menu-item-name">${menu.name}</div>
                        <div class="menu-item-ingredients">${menu.ingredients}</div>
                        <div class="menu-item-price">$${menu.price}</div>
                    </div>
                </div>
                <div class="menu-item-actions">
                    <div class="menu-item-add" data-menu-item="${menu.id}">+</div>
                </div>
            </div>
        `
    }, '')
}

function getOrderItemsHTML() {
    return order.reduce((t, item) => {
        return t += `
            <div class="order-item">
                <div class="order-item-name">
                    ${item.name}
                    <span class="order-item-remove" data-remove-order-item="${item.id}">remove</span>
                </div>
                <div class="order-item-price">$${item.price} × ${item.count}</div>
            </div>
        `
    }, '')
}