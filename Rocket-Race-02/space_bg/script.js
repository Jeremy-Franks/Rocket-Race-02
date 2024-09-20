document.addEventListener('DOMContentLoaded', () => {
    const backgroundContainer = document.querySelector('.background-container');
    const numberOfStars = 100;  // Define how many stars you want

    function getRandomRGB() {
        const r = Math.floor(Math.random() * 150);  // Random value for Red
        const g = Math.floor(Math.random() * 256);  // Random value for Green
        const b = Math.floor(Math.random() * 256);  // Random value for Blue
        return `rgb(${r},${g},${b})`;  // Return the RGB string
    }

    function createStar() {
        const star = document.createElement('div'); // Create a star element
        star.classList.add('star'); // Add the star class for styling
        
        // Randomly position the star
        const randomX = Math.random() * 100; // Random left position (percentage)
        const randomY = Math.random() * 100; // Random top position (percentage)
        
        star.style.left = `${randomX}%`;  // Set the star's horizontal position
        star.style.top = `${randomY}%`;   // Set the star's vertical position
        
        // Set a random RGB color for each star
        star.style.backgroundColor = getRandomRGB();
        
        // Add random delay to the twinkle animation for randomness
        const randomDelay = Math.random() * 5;  // Random delay between 0 and 5 seconds
        star.style.animationDelay = `${randomDelay}s`;

        return star;
    }

    // Generate the stars
    for (let i = 0; i < numberOfStars; i++) {
        const star = createStar();
        backgroundContainer.appendChild(star);  // Add each star to the background container
    }
});
