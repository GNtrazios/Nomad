document.addEventListener("DOMContentLoaded", () => {
    const EMAILJS_SERVICE_ID = 'service_252rszn';
    const EMAILJS_TEMPLATE_ID = 'template_xejeurx';
    const EMAILJS_USER_ID = 'JGZjmSK5cu1LprSV5';

    const questionElement = document.querySelector('.question');
    const buttonsContainer = document.getElementById('InitialPage-buttons-container');
    const randomCocktailButton = document.getElementById('randomCocktailButton');
    const throwErrorButton = document.getElementById('throwErrorButton');
    const loadingOverlay = document.querySelector('.loading-overlay');
    const specialButton = document.getElementById('specialButton');
    const userId = new URLSearchParams(window.location.search).get('user');
    let cocktails = [];

    // Initialize the page
    init(); 

    function init() {
        // Display special button for specific users
        if (userId === 'specialUser') {
            specialButton.style.display = 'inline-block';
            throwErrorButton.style.display = 'inline-block';
        }
        
        // Initialize EmailJS
        emailjs.init(EMAILJS_USER_ID);
        
        // Fetch cocktail data and populate question and answers
        fetch('OubiCocktails.json')
            .then(response => response.json())
            .then(data => handleCocktailData(data))
            .catch(err => logError('Error loading cocktail data', err));
    }

    function handleCocktailData(data) {
        cocktails = data;
        const question = Object.keys(data[0])[1];
        const answers = [...new Set(data.map(c => c[question]))];

        questionElement.textContent = question;
        createAnswerButtons(answers);
    }

    // Create answer buttons dynamically
    function createAnswerButtons(answers) {
        buttonsContainer.innerHTML = ''; // Clear any existing buttons

        answers.forEach(answer => {
            const button = createButton(answer);
            buttonsContainer.appendChild(button);
        });
    }

    // Create a single answer button
    function createButton(answer) {
        const button = document.createElement('button');
        button.textContent = answer;
        button.className = 'answer-btn';
        button.dataset.answer = answer;

        button.addEventListener('click', debounce(handleAnswerClick, 300));
        return button;
    }

    // Handle answer button click
    async function handleAnswerClick(event) {
        const selectedAnswer = event.target.dataset.answer;
        // toggleLoading(true);

        try {
            await fetch('/api/updateCounter', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question: questionElement.textContent, answer: selectedAnswer })
            });

            window.location.href = `SecondPage.html?FirstQuestionAnswer=${encodeURIComponent(selectedAnswer)}`;
        } catch (err) {
            logError('Error updating click counter', err);
        } 
        // finally {
        //     toggleLoading(false);
        // }
    }

    // Handle random cocktail button click
    randomCocktailButton.addEventListener("click", () => {
        // toggleLoading(true);
        try {
            if (cocktails.length) {
                const randomCocktail = cocktails[Math.floor(Math.random() * cocktails.length)];
                window.location.href = `Result.html?name=${encodeURIComponent(randomCocktail.name)}`;
            }
        } catch (err) {
            logError('Εrror in handling random cocktail button', err);
        } 
        // finally {
        //     toggleLoading(false);
        // }
    });

    // Handle Error Simulation button click
    throwErrorButton.addEventListener("click", () => {
        // toggleLoading(true);
        try {
            throw new Error('Test error triggered by Throw Error button');
        } catch (err) {
            logError('Manually triggered error', err);
        }
        //  finally {
        //     toggleLoading(false);
        // }
    });

    // Toggle loading overlay visibility
    // function toggleLoading(show) {
    //     loadingOverlay.style.visibility = show ? 'visible' : 'hidden';
    // }

    // Debounce function to limit rapid function execution
    function debounce(func, delay) {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    }

    // Updated logError function
    function logError(message, error) {
        console.error(`[Error] ${message}`, { error: error?.message || error });

        // Log preparation of email parameters
        const templateParams = {
            error_message: message,
            error_details: error?.message || JSON.stringify(error),
            timestamp: new Date().toISOString(),
        };

        // Sending the email
        if (emailjs) {
            emailjs
                .send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
                .then(
                    (response) => {
                        console.log("✅ Email sent successfully", response.status, response.text);
                    },
                    (err) => {
                        console.error("❌ Failed to send email:", err);
                        console.error(emailjs);
                    }
                );
        } else {
            console.error("EmailJS is not loaded.");
        }         
    }
});
