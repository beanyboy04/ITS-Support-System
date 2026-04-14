/*
  Purpose: handles navigation between the multiple pages.
  Also manages technician login state for the protected pages.
*/

const TECH_LOGIN_KEY = "isTechnicianLoggedIn";

function isTechnicianLoggedIn() {
  return localStorage.getItem(TECH_LOGIN_KEY) === "true";
}

function goHome() {
  window.location.href = "index.html";
}

function goToCheckIn() {
  window.location.href = "checkin.html";
}

function goToAnalytics() {
  if (!isTechnicianLoggedIn()) {
    loginTechnician();
  }

  window.location.href = "analytics.html";
}

function goToQueue() {
  if (!isTechnicianLoggedIn()) {
    loginTechnician();
  }

  window.location.href = "queue.html";
}

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");

  if (sidebar) {
    sidebar.classList.toggle("collapsed");
  }
}

function loginTechnician() {
  localStorage.setItem(TECH_LOGIN_KEY, "true");
}

function logoutTechnician() {
  localStorage.removeItem(TECH_LOGIN_KEY);
  window.location.href = "index.html";
}

function handleTechButton() {
  if (isTechnicianLoggedIn()) {
    logoutTechnician();
  } else {
    loginTechnician();
    updateTechUI();
  }
}

function updateTechUI() {
  const techBtn = document.getElementById("techBtn");
  const techLinks = document.getElementById("techLinks");
  const loggedIn = isTechnicianLoggedIn();

  if (techBtn) {
    techBtn.textContent = loggedIn ? "Log Out" : "Technician";
  }

  if (techLinks) {
    techLinks.style.display = loggedIn ? "block" : "none";
  }
}

function protectTechnicianPage() {
  if (!isTechnicianLoggedIn()) {
    loginTechnician();
    updateTechUI();
  }
}

document.addEventListener("DOMContentLoaded", updateTechUI);