console.log("Game.js is loaded and running");

let selectedRocket = null;
let timeMultiplier = 1.00;  // Single time multiplier for all rockets
let rocketHeightA = 0, rocketHeightB = 0, rocketHeightC = 0;  // Start at the bottom (0%)
let intervalIdA = null, intervalIdB = null, intervalIdC = null;
let betAmount = 0;
let hasCashedOut = false;
let gameEnded = false;

const riskMultipliers = {
  A: 1,    // Low risk
  B: 1.45, // Medium risk
  C: 2     // High risk
};

// Minimum bet amounts for each rocket (in South African Rands)
const minBets = {
  A: 1,   // Minimum bet for Rocket A is 1 Rand
  B: 5,   // Minimum bet for Rocket B is 5 Rand
  C: 20   // Minimum bet for Rocket C is 20 Rand
};

// Disable the bet amount input initially
document.getElementById('betAmount').disabled = true;

// Rocket selection functionality
document.getElementById('selectRocketA').addEventListener('click', () => selectRocket('A'));
document.getElementById('selectRocketB').addEventListener('click', () => selectRocket('B'));
document.getElementById('selectRocketC').addEventListener('click', () => selectRocket('C'));

function selectRocket(rocket) {
  selectedRocket = rocket;

  // Enable the bet input field and Start button after rocket selection
  document.getElementById('betAmount').disabled = false;
  document.getElementById('startButton').disabled = false;

  // Ensure that all rockets are visible during the race
  document.getElementById('rocketASection').classList.remove('hidden');
  document.getElementById('rocketBSection').classList.remove('hidden');
  document.getElementById('rocketCSection').classList.remove('hidden');
}

// Function to show notifications
function showNotification(message, bgColor = 'rgba(0, 0, 0, 0.8)') {
  const notification = document.getElementById('notification');
  
  // Check if the notification element exists
  if (!notification) {
    console.log('Notification element not found.');
    return;
  }
  
  console.log('Displaying notification:', message); // Debug log
  
  // Set the notification message and background color
  notification.innerHTML = message;
  notification.style.backgroundColor = bgColor;
  
  // Display the notification
  notification.classList.add('show-notification');
  
  // Automatically hide the notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show-notification');
    console.log('Notification hidden'); // Debug log
  }, 3000);
}

// Function to update the central Time display
function updateTimeDisplay() {
  document.getElementById('timeDisplay').innerText = `Time: ${timeMultiplier.toFixed(2)}x`;
}

// Hide loader after page loads
window.addEventListener('load', function() {
  const loader = document.getElementById('loader');
  if (loader) loader.style.display = 'none'; // Hide loader

  // Ensure the rockets are static on page load
  document.getElementById('rocketA').style.bottom = '0%';
  document.getElementById('rocketB').style.bottom = '0%';
  document.getElementById('rocketC').style.bottom = '0%';
});

// Function to reset the game after the race ends
function resetGame() {
  rocketHeightA = 0;
  rocketHeightB = 0;
  rocketHeightC = 0;
  timeMultiplier = 1.00;
  hasCashedOut = false;
  gameEnded = false;

  document.getElementById('rocketA').style.bottom = '0%';
  document.getElementById('rocketB').style.bottom = '0%';
  document.getElementById('rocketC').style.bottom = '0%';

  // Reset buttons
  document.getElementById('startButton').disabled = false;
  document.getElementById('cashOutButton').disabled = true;
  document.getElementById('betAmount').value = '';
  document.getElementById('betAmount').disabled = true;
}

// Function to randomly determine if a rocket explodes based on chance
function randomExplosion(chance) {
  return Math.random() < chance; // Returns true if rocket should explode
}

// Start the race for all rockets
document.getElementById('startButton').addEventListener('click', () => {
  betAmount = parseFloat(document.getElementById('betAmount').value);

  if (betAmount >= minBets[selectedRocket] && betAmount <= balance) {
    balance -= betAmount;
    updateBalanceDisplay();

    document.getElementById('betAmount').disabled = true;
    document.getElementById('startButton').disabled = true;
    document.getElementById('cashOutButton').disabled = false;

    timeMultiplier = 1.00;

    // Update the time multiplier for all rockets every 100ms
    const updateInterval = setInterval(() => {
      timeMultiplier += 0.01;
      updateTimeDisplay();

      if (gameEnded) {
        clearInterval(updateInterval); // Stop updating time
        setTimeout(resetGame, 2000); // Reset the game after 2 seconds
      }
    }, 100);

    // Rocket A logic (Low Risk - Lower explosion chance)
    let explosionChanceA = 0.01; // Starts low
    intervalIdA = setInterval(() => {
      rocketHeightA += Math.random() * 0.8 + 0.5; // Slight speed variation
      document.getElementById('rocketA').style.bottom = rocketHeightA + '%';

      // Randomly decide if Rocket A explodes
      if (randomExplosion(explosionChanceA)) {
        clearInterval(intervalIdA); // Stop rocket A movement on explosion
        showNotification('Boom! Rocket A exploded!', '#FF4C4C');
        checkGameEnd();
        return; // Exit the interval if the rocket explodes
      }

      // Gradually increase the explosion chance
      explosionChanceA += 0.005; // Increases slowly over time
    }, 100); 

    // Rocket B logic (Medium Risk - Medium explosion chance)
    let explosionChanceB = 0.02; // Starts with a higher explosion chance
    intervalIdB = setInterval(() => {
      rocketHeightB += Math.random() * 1.2 + 0.7; // Slight speed variation
      document.getElementById('rocketB').style.bottom = rocketHeightB + '%';

      // Randomly decide if Rocket B explodes
      if (randomExplosion(explosionChanceB)) {
        clearInterval(intervalIdB); // Stop rocket B movement on explosion
        showNotification('Boom! Rocket B exploded!', '#FF4C4C');
        checkGameEnd();
        return; // Exit the interval if the rocket explodes
      }

      // Gradually increase the explosion chance
      explosionChanceB += 0.007; // Increases faster than Rocket A
    }, 100);

    // Rocket C logic (High Risk - Highest explosion chance)
    let explosionChanceC = 0.03; // Starts with the highest explosion chance
    intervalIdC = setInterval(() => {
      rocketHeightC += Math.random() * 1.5 + 1; // Slight speed variation
      document.getElementById('rocketC').style.bottom = rocketHeightC + '%';

      // Randomly decide if Rocket C explodes
      if (randomExplosion(explosionChanceC)) {
        clearInterval(intervalIdC); // Stop rocket C movement on explosion
        showNotification('Boom! Rocket C exploded!', '#FF4C4C');
        checkGameEnd();
        return; // Exit the interval if the rocket explodes
      }

      // Gradually increase the explosion chance
      explosionChanceC += 0.01; // Increases faster than both A and B
    }, 100);

  } else {
    showNotification(`Invalid bet amount or insufficient balance. Minimum bet for Rocket ${selectedRocket} is R${minBets[selectedRocket]}.`, '#FF4C4C');
  }
});

// Function to check if all rockets have finished their race
function checkGameEnd() {
  if (rocketHeightA > 0 && rocketHeightB > 0 && rocketHeightC > 0) {
    gameEnded = true;
  }
}

// Example of showing a notification when cashing out
document.getElementById('cashOutButton').addEventListener('click', () => {
  if (!hasCashedOut && !gameEnded) {
    hasCashedOut = true;
    
    // Calculate winnings based on the selected rocket
    let finalMultiplier = timeMultiplier;
    finalMultiplier *= riskMultipliers[selectedRocket];
    let winnings = betAmount * finalMultiplier;
    balance += winnings;
    
    updateBalanceDisplay();
    
    // Show notification for cashing out
    showNotification(`You cashed out at ${finalMultiplier.toFixed(2)}x! You won R${winnings.toFixed(2)}!`, '#28A745');
    
    // Disable the cash-out button after cashing out
    document.getElementById('cashOutButton').disabled = true;
  }
});
