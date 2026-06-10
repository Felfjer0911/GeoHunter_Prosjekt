let rankings = {};
let countries = [];
let score = 0;

let randomCountry = null;
let currentCategory = null;

let usedCategories = [];
let usedCountry = [];

const countryDisplay = document.getElementById("country");
const scoreDisplay = document.querySelector(".score");

// --------------------
// LASTER JSON-FILER
// --------------------

async function loadRanking(name) {
    const response = await fetch(
        `./geohunter_country_rankings/${name}.json`
    );

    const data = await response.json();

    rankings[name] = data;

    if (countries.length === 0) {
        countries = Object.keys(data.countries);
    }
}

async function loadAllRankings() {
    await Promise.all([
        loadRanking("population"),
        loadRanking("gdp"),
        loadRanking("tourism"),
        loadRanking("crime_rate"),
        loadRanking("small_country_size"),
        loadRanking("football_performance"),
        loadRanking("capital_city_population_pct"),
        loadRanking("women_in_parliament")
    ]);

    console.log("Alle rankings lastet!");
    console.log(rankings);

    generateNewCountry();
}

// --------------------
// LAND
// --------------------

function getRandomCountry() {
    return countries[
        Math.floor(Math.random() * countries.length)
    ];
}

function generateNewCountry() {
    randomCountry = getRandomCountry();

    console.log("Nytt land:", randomCountry);

    updateDisplay();
}

// --------------------
// DISPLAY
// --------------------

function updateDisplay() {
    countryDisplay.textContent = randomCountry;
    scoreDisplay.textContent = score;
}

// --------------------
// KATEGORIER
// --------------------

function showRank(category) {

    if (usedCategories.includes(category)) {
        console.log("Denne kategorien er allerede brukt!");
        return;
    }

    usedCategories.push(category);

    const button = document.querySelector(
        `[data-category="${category}"]`
    );

    button.style.opacity = "0.5";
    button.style.pointerEvents = "none";

    currentCategory = category;

    const countryData =
        rankings[category]?.countries?.[randomCountry];

    if (!countryData) {
        console.log("Fant ikke data");
        return;
    }

    const rank = countryData.rank;

    button.querySelector(".countryFlag").textContent =
        randomCountry;

    button.querySelector(".rankValue").textContent =
        rank;

    console.log(
        `${randomCountry} er rangert #${rank} i ${category}`
    );

    score += rank;

    updateDisplay();

    if (usedCategories.length === 8) {
        gameOver();
        return;
    }

    generateNewCountry();
}

// --------------------
// RESET
// --------------------

function resetGame() {
    score = 0;
    usedCategories = [];
    currentCategory = null;

    const buttons =
        document.querySelectorAll(".category");

    buttons.forEach(button => {
        button.style.opacity = "1";
        button.style.pointerEvents = "auto";

        button.querySelector(".countryFlag").textContent =
            "🌍";

        button.querySelector(".rankValue").textContent =
            "0";
    });

    generateNewCountry();
    updateDisplay();

    console.log("Spillet er restartet!");
}

// --------------------
// GAME OVER
// --------------------

function gameOver() {
    countryDisplay.textContent = "Game Over";

    console.log("Spillet er ferdig!");
    console.log("Sluttscore:", score);
}

// --------------------
// START SPILLET
// --------------------

loadAllRankings();