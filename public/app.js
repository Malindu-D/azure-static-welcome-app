// Get DOM elements
const nameInput = document.getElementById("nameInput");
const submitBtn = document.getElementById("submitBtn");
const welcomeMessage = document.getElementById("welcomeMessage");

// Function to display welcome message
function showWelcomeMessage() {
  const name = nameInput.value.trim();

  if (name === "") {
    welcomeMessage.textContent = "Please enter your name!";
    welcomeMessage.style.color = "#e74c3c";
  } else {
    welcomeMessage.textContent = `Welcome, ${name}! 🎉`;
    welcomeMessage.style.color = "#667eea";
    welcomeMessage.classList.add("show");

    // Remove animation class after animation completes
    setTimeout(() => {
      welcomeMessage.classList.remove("show");
    }, 500);
  }
}

// Event listener for button click
submitBtn.addEventListener("click", showWelcomeMessage);

// Event listener for Enter key press
nameInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    showWelcomeMessage();
  }
});

// Clear message when user starts typing again
nameInput.addEventListener("input", () => {
  if (nameInput.value === "") {
    welcomeMessage.textContent = "";
  }
});
