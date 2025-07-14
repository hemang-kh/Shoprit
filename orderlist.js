document.addEventListener("DOMContentLoaded", () => {
    const ordersTableBody = document.querySelector("#orders-table-body");
    const noOrdersMessage = document.querySelector("#no-orders-message");

    const user = JSON.parse(localStorage.getItem("shoprit_user"));

    if (!user || !user.orders || user.orders.length === 0) {
        if (noOrdersMessage) noOrdersMessage.style.display = "block";
        if (ordersTableBody) ordersTableBody.innerHTML = "";
        return;
    }

    if (noOrdersMessage) noOrdersMessage.style.display = "none";

    user.orders.forEach(order => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${order.orderId}</td>
            <td>${new Date(order.date).toLocaleDateString()}</td>
            <td>₹${order.total.toFixed(2)}</td>
            <td>${order.trackingStatus}</td>
            <td><a href="order-detail.html?id=${order.orderId}" class="btn btn-sm btn-outline-primary">View Details</a></td>
        `;
        ordersTableBody.appendChild(tr);
    });
});
