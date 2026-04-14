/*
  Purpose: Load tickets on the queue page. Tickets fields (statuc, technician, and resolution notes)
  can be updated and saved through this page. 
*/

const API_BASE = "http://localhost:3000/api";

let technicians = [];
let allTickets = [];

/* Load all technicians */
async function loadTechnicians() {
  try {
    const response = await fetch(`${API_BASE}/technicians`);

    if (!response.ok) {
      throw new Error("Failed to load technicians.");
    }

    technicians = await response.json();
  } catch (error) {
    console.error("Failed to load technicians:", error);
    technicians = [];
  }
}

/* Build technician dropdown */
function buildTechnicianOptions(selectedTechId) {
  let options = `<option value="">Unassigned</option>`;

  technicians.forEach((tech) => {
    const selected =
      Number(selectedTechId) === Number(tech.TechID) ? "selected" : "";

    options += `<option value="${tech.TechID}" ${selected}>${tech.Name}</option>`;
  });

  return options;
}

/* Build status dropdown */
function buildStatusOptions(selectedStatus) {
  const statuses = ["Active", "On Hold", "Resolved"];

  return statuses
    .map((status) => {
      const selected = status === selectedStatus ? "selected" : "";
      return `<option value="${status}" ${selected}>${status}</option>`;
    })
    .join("");
}

/* Format date */
function formatDateTime(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);
  return Number.isNaN(date.getTime()) ? dateString : date.toLocaleString();
}

/* Escape text */
function escapeHtml(value) {
  if (value === null || value === undefined) return "";

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* Load tickets */
async function loadQueue() {
  const table = document.getElementById("queueBody");
  if (!table) return;

  table.innerHTML = "";

  try {
    const response = await fetch(`${API_BASE}/tickets`);

    if (!response.ok) {
      throw new Error("Failed to load tickets.");
    }

    allTickets = await response.json();
    applyFilter();
  } catch (error) {
    console.error("Failed to load queue:", error);

    table.innerHTML = `
      <tr>
        <td colspan="11">Failed to load tickets.</td>
      </tr>
    `;
  }
}

/* Apply filter */
function applyFilter() {
  const selectedFilter =
    document.getElementById("statusFilter")?.value || "Active";

  const filteredTickets =
    selectedFilter === "All"
      ? allTickets
      : allTickets.filter(t => t.Status === selectedFilter);

  renderQueue(filteredTickets);
}

/* Render table */
function renderQueue(tickets) {
  const table = document.getElementById("queueBody");
  if (!table) return;

  if (tickets.length === 0) {
    table.innerHTML = `
      <tr>
        <td colspan="11">No tickets found for this filter.</td>
      </tr>
    `;
    return;
  }

  let rows = "";

  tickets.forEach((ticket) => {
    rows += `
      <tr>
        <td>${ticket.TicketID}</td>
        <td>${escapeHtml(ticket.UserName)}</td>
        <td>${escapeHtml(ticket.Email)}</td>
        <td>${escapeHtml(ticket.Role)}</td>
        <td>${escapeHtml(ticket.CatName)}</td>
        <td>
          <select id="status-${ticket.TicketID}" class="inline-select">
            ${buildStatusOptions(ticket.Status)}
          </select>
        </td>
        <td>
          <select id="tech-${ticket.TicketID}" class="inline-select">
            ${buildTechnicianOptions(ticket.TechID)}
          </select>
        </td>
        <td>
          <textarea
            id="notes-${ticket.TicketID}"
            class="resolution-notes-input"
            rows="3"
            placeholder="Enter resolution notes..."
          >${escapeHtml(ticket.ResolutionNotes)}</textarea>
        </td>
        <td>${formatDateTime(ticket.CheckInTime)}</td>
        <td>${formatDateTime(ticket.CheckOutTime)}</td>
        <td>
          <button onclick="saveTicketUpdate(${ticket.TicketID})">Save</button>
        </td>
      </tr>
    `;
  });

  table.innerHTML = rows;
}

/* Save ticket */
async function saveTicketUpdate(ticketId) {
  const status = document.getElementById(`status-${ticketId}`)?.value;
  const techId = document.getElementById(`tech-${ticketId}`)?.value;
  const resolutionNotes =
    document.getElementById(`notes-${ticketId}`)?.value.trim();

  if (!status) {
    alert("Status is required.");
    return;
  }

  if (status === "Resolved" && !techId) {
    alert("You must assign a technician before resolving a ticket.");
    return;
  }

  if (status === "Resolved" && !resolutionNotes) {
    alert("You must enter resolution notes before resolving a ticket.");
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/tickets/${ticketId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        techId: techId || null,
        resolutionNotes
      })
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.error || "Failed to update ticket.");
      return;
    }

    await loadQueue();
    alert("Ticket updated successfully.");
  } catch (error) {
    console.error("Error updating ticket:", error);
    alert("Could not connect to the server.");
  }
}

/* Init */
document.addEventListener("DOMContentLoaded", async () => {
  await loadTechnicians();
  await loadQueue();
});