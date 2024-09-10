let balance = 0.00;
let selectedRocket = null;
let multiplierA = 1, multiplierB = 1, multiplierC = 1;
let rocketHeightA = 80, rocketHeightB = 80, rocketHeightC = 80;
let intervalId;
let rocketExploded = false;
let betAmount = 0;

// Risk multipliers
const riskMultiplierB = 1.45;  // Rocket B has 1.45x bonus
const riskMultiplierC = 2.0;   // Rocket C has 2x bonus

// Function to update displayed balance
function updateBalanceDisplay() {
  document.getElementById('balance').innerText = balance.toFixed(2);
}

// Function to show the selected rocket and hide others
function selectRocket(rocket) {
  selectedRocket = rocket;

  document.getElementById('rocketASection').classList.add('hidden');
  document.getElementById('rocketBSection').classList.add('hidden');
  document.getElementById('rocketCSection').classList.add('hidden');

  if (rocket === 'A') {
    document.getElementById('rocketASection').classList.remove('hidden');
  } else if (rocket === 'B') {
    document.getElementById('rocketBSection').classList.remove('hidden');
  } else if (rocket === 'C') {
    document.getElementById('rocketCSection').classList.remove('hidden');
  }

  document.getElementById('betAmount').disabled = false;
}

// Rocket selection buttons
document.getElementById('selectRocketA').addEventListener('click', () => selectRocket('A'));
document.getElementById('selectRocketB').addEventListener('click', () => selectRocket('B'));
document.getElementById('selectRocketC').addEventListener('click', () => selectRocket('C'));

// Deposit balance
document.getElementById('depositButton').addEventListener('click', () => {
  let deposit = parseFloat(document.getElementById('depositAmount').value);
  if (deposit > 0) {
    balance += deposit;
    updateBalanceDisplay();
    document.getElementById('depositAmount').value = '';  // Clear input
  }
});

// Function to randomly explode the rocket
function randomExplosion(chance) {
  return Math.random() < chance;  // Explosion chance based on rocket type
}

// Start the rocket race
document.getElementById('startButton').addEventListener('click', () => {
  betAmount = parseFloat(document.getElementById('betAmount').value);

  if (betAmount > 0 && betAmount <= balance && selectedRocket) {
    balance -= betAmount;
    updateBalanceDisplay();

    document.getElementById('cashOutButton').disabled = false;
    document.getElementById('startButton').disabled = true;
    document.getElementById('betAmount').disabled = true;

    // Handle the logic for the selected rocket
    if (selectedRocket === 'A') {
      intervalId = setInterval(() => {
        if (randomExplosion(0.05)) {
          alert('Boom! Rocket A exploded!');
          clearInterval(intervalId);
          rocketExploded = true;
          resetGame();
          return;
        }
        multiplierA += 0.01;
        rocketHeightA -= 1;
        document.getElementById('multiplierA').innerText = multiplierA.toFixed(2) + 'x';
        document.getElementById('rocketA').style.top = rocketHeightA + '%';
      }, 100);

    } else if (selectedRocket === 'B') {
      intervalId = setInterval(() => {
        if (randomExplosion(0.08)) {
          alert('Boom! Rocket B exploded!');
          clearInterval(intervalId);
          rocketExploded = true;
          resetGame();
          return;
        }
        multiplierB += 0.015;
        rocketHeightB -= 1;
        document.getElementById('multiplierB').innerText = multiplierB.toFixed(2) + 'x';
        document.getElementById('rocketB').style.top = rocketHeightB + '%';
      }, 100);

    } else if (selectedRocket === 'C') {
      intervalId = setInterval(() => {
        if (randomExplosion(0.1)) {
          alert('Boom! Rocket C exploded!');
          clearInterval(intervalId);
          rocketExploded = true;
          resetGame();
          return;
        }
        multiplierC += 0.02;
        rocketHeightC -= 1;
        document.getElementById('multiplierC').innerText = multiplierC.toFixed(2) + 'x';
        document.getElementById('rocketC').style.top = rocketHeightC + '%';
      }, 100);
    }

  } else {
    alert('Invalid bet amount or insufficient balance.');
  }
});

// Cash out logic (Apply risk-based multiplier at the time of cash-out)
document.getElementById('cashOutButton').addEventListener('click', () => {
  if (!rocketExploded && selectedRocket) {
    let finalMultiplier;
    if (selectedRocket === 'A') {
      finalMultiplier = multiplierA;  // No extra risk, no bonus
    }
    if (selectedRocket === 'B') {
      finalMultiplier = multiplierB * riskMultiplierB;  // Apply Rocket B's bonus multiplier
    }
    if (selectedRocket === 'C') {
      finalMultiplier = multiplierC * riskMultiplierC;  // Apply Rocket C's bonus multiplier
    }

    let winnings = betAmount * finalMultiplier;  // Calculate payout
    balance += winnings;
    alert(`You cashed out at ${finalMultiplier.toFixed(2)}x! You won $${winnings.toFixed(2)}!`);
    updateBalanceDisplay();
    clearInterval(intervalId);
    resetGame();
  }
});

// Reset the game
function resetGame() {
  document.getElementById('rocketA').style.top = '80%';
  document.getElementById('rocketB').style.top = '80%';
  document.getElementById('rocketC').style.top = '80%';

  multiplierA = 1;
  multiplierB = 1;
  multiplierC = 1;

  rocketHeightA = 80;
  rocketHeightB = 80;
  rocketHeightC = 80;

  rocketExploded = false;

  document.getElementById('multiplierA').innerText = '1.00x';
  document.getElementById('multiplierB').innerText = '1.00x';
  document.getElementById('multiplierC').innerText = '1.00x';

  document.getElementById('startButton').disabled = false;
  document.getElementById('cashOutButton').disabled = true;
  document.getElementById('betAmount').disabled = false;
}

// Enable Start button when there's a bet amount
document.getElementById('betAmount').addEventListener('input', () => {
  document.getElementById('startButton').disabled = parseFloat(document.getElementById('betAmount').value) <= 0 || !selectedRocket;
});
