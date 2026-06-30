document.addEventListener("DOMContentLoaded", () => {
  fetch("http://localhost:8800/dashboard")
      .then(response => response.json())
      .then(data => {
          document.getElementById("totalSupplies").textContent = data.totalSupplies;
          document.getElementById("borrowedSupplies").textContent = data.borrowedSupplies;
          document.getElementById("pendingRequests").textContent = data.pendingRequests;
          document.getElementById("approvedSupplies").textContent = data.approvedSupplies;
      })
      .catch(error => console.error("❌ ดึงข้อมูลผิดพลาด:", error));
});