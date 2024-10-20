const accessKey = '70e89936ce33ac5d0355a52378e7cff4';
const importantPairs = ['USD', 'GBP', 'JPY', 'AUD', 'CAD']; 

async function getCurrentRates() {
    const url = `http://api.exchangeratesapi.io/v1/latest?access_key=${accessKey}&base=EUR`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayCurrentRates(data.rates);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error fetching current rates:", error);
        document.getElementById('currentRates').innerText = `Error: ${error.message}`;
    }
}

function displayCurrentRates(rates) {
    const ratesDiv = document.getElementById('currentRates');
    ratesDiv.innerHTML = '<h3>Current Exchange Rates (Important Pairs):</h3>';
    
    const rateEntries = importantPairs.map(currency => {
        if (rates[currency]) {
            return `<p>EUR/${currency}: ${rates[currency]}</p>`;
        } else {
            return `<p>${currency} is not available.</p>`;
        }
    });

    ratesDiv.innerHTML += rateEntries.join('');
}

async function getHistoricalRates(date) {
    const url = `http://api.exchangeratesapi.io/v1/${date}?access_key=${accessKey}&base=EUR`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayHistoricalRates(data.rates, date);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error fetching historical rates:", error);
        document.getElementById('historicalRates').innerText = `Error: ${error.message}`;
    }
}

function displayHistoricalRates(rates, date) {
    const ratesDiv = document.getElementById('historicalRates');
    ratesDiv.innerHTML = `<h3>Exchange Rates on ${date}:</h3>`;
    Object.entries(rates).forEach(([currency, rate]) => {
        ratesDiv.innerHTML += `<p>${currency}: ${rate}</p>`;
    });
}

async function compareRates(currencies) {
    const baseCurrency = 'EUR';
    const url = `http://api.exchangeratesapi.io/v1/latest?access_key=${accessKey}&base=${baseCurrency}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (response.ok) {
            displayComparisonRates(data.rates, currencies, baseCurrency);
        } else {
            throw new Error(data.error);
        }
    } catch (error) {
        console.error("Error fetching comparison rates:", error);
        document.getElementById('comparisonRates').innerText = `Error: ${error.message}`;
    }
}

function displayComparisonRates(rates, currencies, baseCurrency) {
    const ratesDiv = document.getElementById('comparisonRates');
    ratesDiv.innerHTML = `<h3>Comparison Rates from ${baseCurrency}:</h3>`;
    
    importantPairs.forEach(currency => {
        if (rates[currency]) {
            const rate = rates[currency];
            const difference = rate - rates[baseCurrency];
            ratesDiv.innerHTML += `<p>${baseCurrency}/${currency}: ${rate} (Difference: ${difference})</p>`;
        }
    });

    currencies.split(',').forEach(currency => {
        currency = currency.trim().toUpperCase();
        if (rates[currency]) {
            const rate = rates[currency];
            const difference = rate - rates[baseCurrency];
            ratesDiv.innerHTML += `<p>${baseCurrency}/${currency}: ${rate} (Difference: ${difference})</p>`;
        } else {
            ratesDiv.innerHTML += `<p>${currency} is not available.</p>`;
        }
    });
}

document.getElementById('currentRatesBtn').addEventListener('click', getCurrentRates);

document.getElementById('dateInput').addEventListener('change', () => {
    const dateInput = document.getElementById('dateInput').value;
    if (dateInput) {
        getHistoricalRates(dateInput);
    }
});

document.getElementById('currencyInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        const currencyInput = document.getElementById('currencyInput').value;
        if (currencyInput) {
            compareRates(currencyInput);
        } else {
            alert("Please enter currency codes.");
        }
    }
});

document.getElementById('resetBtn').addEventListener('mouseover', () => {
    document.getElementById('resetBtn').style.backgroundColor = 'lightgray';
});

document.getElementById('resetBtn').addEventListener('click', () => {
    document.getElementById('currentRates').innerHTML = '';
    document.getElementById('historicalRates').innerHTML = '';
    document.getElementById('comparisonRates').innerHTML = '';
    document.getElementById('resetBtn').style.backgroundColor = ''; // Reset background color
});
