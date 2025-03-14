document.addEventListener("DOMContentLoaded", () => {
    const cocktailImage = document.getElementById('cocktail-image');
    const cocktailName = document.getElementById('cocktail-name');
    const cocktailDescription = document.getElementById('cocktail-description');
    const urlParams = new URLSearchParams(window.location.search);
    const selectedCocktailName = urlParams.get('name');
    const textlang = new URLSearchParams(window.location.search).get('textlang');
    let JSON_data;

    // Set language when clicking flags
    document.querySelectorAll('.language-switcher img').forEach(flag => {
        flag.addEventListener('click', function () {
            const lang = this.getAttribute('alt') === 'English' ? 'en' : 'gr';
            window.location.href = `index.html?textlang=${encodeURIComponent(lang)}`;
        });
    });

    // Initialize the page
    init();

    function init() {
        if (textlang === 'en') {
            JSON_data = 'CocktailsInEnglish.json';
        } else {
            JSON_data = 'CocktailsInGreek.json';
        }

        fetchCocktailData(selectedCocktailName)
            .then(cocktail => {
                if (cocktail) {
                    updateCocktailUI(cocktail);
                } else {
                    logError('Cocktail not found in data');
                    redirectToHome();
                }
            })
            .catch(err => logError('Error fetching cocktail data', err));
    }

    // Fetch cocktail data from JSON
    async function fetchCocktailData(cocktailName) {
        try {
            const response = await fetch(JSON_data);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.find(cocktail => cocktail.name === cocktailName);
        } catch (error) {
            throw new Error(`Failed to fetch cocktail data: ${error.message}`);
        }
    }

    // Update the UI with cocktail details
    function updateCocktailUI(cocktail) {
        //const imageName = cocktail.name.replace(/\s+/g, '') + '.jpg'; // Remove spaces for image name
        const imageName = 'MaiTai.jpg';
        cocktailImage.src = `images/${imageName}`;
        cocktailImage.alt = cocktail.name || 'Cocktail Image';
        cocktailName.textContent = cocktail.name || 'Unknown Cocktail';
        cocktailDescription.textContent = cocktail.description || 'Description not available.';
    }

    // Logging helper function
    function logError(message, error = null) {
        console.error(`[Error] ${message}`, { error: error?.message || error });
    }
});
