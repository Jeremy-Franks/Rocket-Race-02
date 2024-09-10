let balance = 0.00;

function updateBalanceDisplay() {
  document.getElementById('balance').innerText = balance.toFixed(2);
}

// Deposit functionality
document.getElementById('depositButton').addEventListener('click', () => {
  let deposit = parseFloat(document.getElementById('depositAmount').value);
  
  if (!isNaN(deposit) && deposit > 0) {
    balance += deposit;
    updateBalanceDisplay();
    document.getElementById('depositAmount').value = '';  // Clear input field after deposit
  } else {
    showModal('Please enter a valid deposit amount.');
  }
});
