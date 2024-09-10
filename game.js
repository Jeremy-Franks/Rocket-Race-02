let selectedRocket = null;
let multiplierA = 1, multiplierB = 1, multiplierC = 1;
let rocketHeightA = 0, rocketHeightB = 0, rocketHeightC = 0;  // Start at the bottom (0%)
let intervalIdA = null, intervalIdB = null, intervalIdC = null;
let rocketExplodedA = false, rocketExplodedB = false, rocketExplodedC = false;
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

// Random rocket explosion logic
function randomExplosion(chance) {
  return Math.random() < chance;
}

// Function to reset the game after all rockets have crashed
function resetGame() {
  rocketHeightA = 0;
  rocketHeightB = 0;
  rocketHeightC = 0;
  multiplierA = 1;
  multiplierB = 1;
  multiplierC = 1;
  rocketExplodedA = false;
  rocketExplodedB = false;
  rocketExplodedC = false;
  hasCashedOut = false;
  gameEnded = false;

  // Reset rocket positions and multipliers
  document.getElementById('rocketA').style.bottom = '0%';
  document.getElementById('rocketB').style.bottom = '0%';
  document.getElementById('rocketC').style.bottom = '0%';

  document.getElementById('multiplierA').innerText = '1.00x';
  document.getElementById('multiplierB').innerText = '1.00x';
  document.getElementById('multiplierC').innerText = '1.00x';

  // Re-enable Start button, disable Cash-Out, and clear bet input
  document.getElementById('startButton').disabled = false;
  document.getElementById('cashOutButton').disabled = true;
  document.getElementById('betAmount').value = '';  // Clear the bet amount
  document.getElementById('betAmount').disabled = true;  // Disable bet input again
}

// Check if all rockets have crashed
function checkGameEnd() {
  if (rocketExplodedA && rocketExplodedB && rocketExplodedC) {
    gameEnded = true;
    // Automatically reset the game after a short delay
    setTimeout(resetGame, 2000);  // Delay of 2 seconds to reset the game
  }
}

// Start the race for all rockets
document.getElementById('startButton').addEventListener('click', () => {
  betAmount = parseFloat(document.getElementById('betAmount').value);

  if (betAmount >= minBets[selectedRocket] && betAmount <= balance) {
    balance -= betAmount;
    updateBalanceDisplay();

    document.getElementById('cashOutButton').disabled = false;
    document.getElementById('startButton').disabled = true;
    document.getElementById('betAmount').disabled = true;

    // Set explosion chances for each rocket
    let explosionChanceA = 0.05, explosionChanceB = 0.08, explosionChanceC = 0.1;

    // Start Rocket A
    intervalIdA = setInterval(() => {
      if (randomExplosion(explosionChanceA) && !rocketExplodedA) {
        if (selectedRocket === 'A' && !hasCashedOut) {  // Show explosion only if not cashed out
          showNotification(`Boom! Rocket A exploded!`, 'bg-red-500');
        }
        clearInterval(intervalIdA);
        rocketExplodedA = true;
        checkGameEnd();
        return;
      }

      multiplierA += 0.01;
      rocketHeightA += 1;
      document.getElementById('multiplierA').innerText = multiplierA.toFixed(2) + 'x';
      document.getElementById('rocketA').style.bottom = rocketHeightA + '%';
    }, 100);

    // Start Rocket B
    intervalIdB = setInterval(() => {
      if (randomExplosion(explosionChanceB) && !rocketExplodedB) {
        if (selectedRocket === 'B' && !hasCashedOut) {
          showNotification(`Boom! Rocket B exploded!`, 'bg-red-500');
        }
        clearInterval(intervalIdB);
        rocketExplodedB = true;
        checkGameEnd();
        return;
      }

      multiplierB += 0.015;
      rocketHeightB += 1;
      document.getElementById('multiplierB').innerText = multiplierB.toFixed(2) + 'x';
      document.getElementById('rocketB').style.bottom = rocketHeightB + '%';
    }, 100);

    // Start Rocket C
    intervalIdC = setInterval(() => {
      if (randomExplosion(explosionChanceC) && !rocketExplodedC) {
        if (selectedRocket === 'C' && !hasCashedOut) {
          showNotification(`Boom! Rocket C exploded!`, 'bg-red-500');
        }
        clearInterval(intervalIdC);
        rocketExplodedC = true;
        checkGameEnd();
        return;
      }

      multiplierC += 0.02;
      rocketHeightC += 1;
      document.getElementById('multiplierC').innerText = multiplierC.toFixed(2) + 'x';
      document.getElementById('rocketC').style.bottom = rocketHeightC + '%';
    }, 100);
  } else {
    showNotification(`Invalid bet amount or insufficient balance. Minimum bet for Rocket ${selectedRocket} is R${minBets[selectedRocket]}.`, 'bg-red-500');
  }
});

// Function to handle cash-out logic for the selected rocket
document.getElementById('cashOutButton').addEventListener('click', () => {
  if (!hasCashedOut && !gameEnded) {
    hasCashedOut = true;

    // Calculate winnings based on the selected rocket
    let finalMultiplier = selectedRocket === 'A' ? multiplierA : selectedRocket === 'B' ? multiplierB : multiplierC;
    finalMultiplier *= riskMultipliers[selectedRocket];
    let winnings = betAmount * finalMultiplier;
    balance += winnings;

    updateBalanceDisplay();
    showNotification(`You cashed out at ${finalMultiplier.toFixed(2)}x! You won R${winnings.toFixed(2)}!`, 'bg-green-500');
    
    // Allow other rockets to keep racing and crash based on their explosion chances
  }
});
