// Function to show a notification
function showNotification(message, color = 'bg-green-500') {
  const notification = document.getElementById('notification');
  notification.innerText = message;
  notification.classList.remove('hidden', 'bg-green-500', 'bg-red-500'); // Remove any old classes
  notification.classList.add(color, 'block'); // Add new color and make it visible

  // Automatically hide after 3 seconds
  setTimeout(() => {
    notification.classList.add('hidden'); // Hide the notification
    notification.classList.remove('block'); // Remove block class
  }, 5000); // Adjust the time if needed
}
