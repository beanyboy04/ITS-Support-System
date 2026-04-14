/* 
  Purpose: Load active tickets for the dashboard view.
  Only the first ten non-resoled tickets should display with the current ticket information.
*/

const API_BASE = "http://localhost:3000/api";

function getStatusClass(status) {
  return `status-${status.toLowerCase().replace(/\s+/g, "-")}`;
}

/* display tickets on dashboard*/
async function loadTickets() {
  const table = document.getElementById("ticketBody");
  if (!table) return;

  table.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE}/tickets`);
    const tickets = await response.json();

    // only show non-resolved tickets. Limit is 10
    const visibleTickets = tickets
      .filter(ticket => ticket.Status !== "Resolved")
      .slice(0, 10);

    if (visibleTickets.length === 0) {
      table.innerHTML = `
        <tr>
          <td colspan="5">No active tickets.</td>
        </tr>
      `;
      return;
    }

    visibleTickets.forEach(ticket => {
      table.innerHTML += `
        <tr>
          <td>${ticket.TicketID}</td>
          <td>${ticket.UserName}</td>
          <td>${ticket.CatName}</td>
          <td class="${getStatusClass(ticket.Status)}">${ticket.Status}</td>
          <td>${ticket.TechName || "Unassigned"}</td>
        </tr>
      `;
    });

  } catch (error) {
    console.error("Failed to load dashboard tickets:", error);

    table.innerHTML = `
      <tr>
        <td colspan="5">Failed to load tickets.</td>
      </tr>
    `;
  }
}

document.addEventListener("DOMContentLoaded", loadTickets);