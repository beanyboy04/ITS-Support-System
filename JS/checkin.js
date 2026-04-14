/*
  Purpose: User or admin inputs tickets in to the system.
  Inputs are validated and submitted to the backend API and stored live in the database.
*/

const API_BASE = "http://localhost:3000/api";

/* verify gsou email */
function isGeorgiaSouthernEmail(email) {
  return email.toLowerCase().endsWith("@georgiasouthern.edu");
}

/* load category options from the database */
async function loadCategories() {
  const categorySelect = document.getElementById("category");

  try {
    const response = await fetch(`${API_BASE}/categories`);

    if (!response.ok) {
      throw new Error("Failed to load categories.");
    }

    const categories = await response.json();

    categorySelect.innerHTML = `<option value="">Select Category</option>`;

    categories.forEach(category => {
      categorySelect.innerHTML += `
        <option value="${category.CatID}">${category.CatName}</option>
      `;
    });
  } catch (error) {
    console.error("Failed to load categories:", error);
    categorySelect.innerHTML = `<option value="">Failed to load categories</option>`;
  }
}

/* validate and submit a new ticket */
async function submitTicket() {
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim().toLowerCase();
  const role = document.getElementById("role").value;
  const catId = document.getElementById("category").value;

  if (!name || !email || !role || !catId) {
    alert("Please complete all fields properly.");
    return;
  }

  if (!isGeorgiaSouthernEmail(email)) {
    alert("Only Georgia Southern email addresses ending in @georgiasouthern.edu are allowed.");
    return;
  }

  if (role !== "Student" && role !== "Faculty") {
    alert("Please select a valid role.");
    return;
  }

  if (isNaN(Number(catId)) || Number(catId) <= 0) {
    alert("Please select a valid category.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/tickets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        role,
        catId: Number(catId)
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to submit ticket.");
      return;
    }

    alert("Ticket submitted successfully!");
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error submitting ticket:", error);
    alert("Could not connect to the server.");
  }
}

/* load categories when the page is ready */
document.addEventListener("DOMContentLoaded", loadCategories);