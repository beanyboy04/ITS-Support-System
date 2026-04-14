/*
  Purpose: Load ticket analytics from the backend.
  Display the total number of tickets, status breakdown, and category breakdown.
*/

const API_BASE = "http://localhost:3000/api";

/* load analytics data */
async function loadAnalytics() {
  try {
    const response = await fetch(`${API_BASE}/tickets`);

    if (!response.ok) {
      throw new Error("Failed to load analytics data.");
    }

    const tickets = await response.json();

    let activeTickets = 0;
    let holdTickets = 0;
    let resolvedTickets = 0;

    tickets.forEach((ticket) => {
      if (ticket.Status === "Active") activeTickets++;
      else if (ticket.Status === "On Hold") holdTickets++;
      else if (ticket.Status === "Resolved") resolvedTickets++;
    });

    document.getElementById("totalTickets").textContent = tickets.length;
    document.getElementById("activeTickets").textContent = activeTickets;
    document.getElementById("holdTickets").textContent = holdTickets;
    document.getElementById("resolvedTickets").textContent = resolvedTickets;

    loadCategoryBreakdown(tickets);
  } catch (error) {
    console.error("Failed to load analytics:", error);

    document.getElementById("categoryBreakdown").innerHTML =
      "<p class='note-text'>Failed to load analytics data.</p>";
  }
}

/* build category breakdown table */
function loadCategoryBreakdown(tickets) {
  const categoryList = document.getElementById("categoryBreakdown");
  if (!categoryList) return;

  if (tickets.length === 0) {
    categoryList.innerHTML = "<p class='note-text'>No ticket data available yet.</p>";
    return;
  }

  const counts = {};

  tickets.forEach((ticket) => {
    counts[ticket.CatName] = (counts[ticket.CatName] || 0) + 1;
  });

  let rows = "";

  for (const category in counts) {
    rows += `
      <tr>
        <td>${category}</td>
        <td>${counts[category]}</td>
      </tr>
    `;
  }

  categoryList.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Category</th>
          <th>Total Tickets</th>
        </tr>
      </thead>
      <tbody>
        ${rows}
      </tbody>
    </table>
  `;
}

document.addEventListener("DOMContentLoaded", loadAnalytics);