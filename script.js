let score = 0;
let autoClickers = 0;
let upgradeCost = 10;

const numberDisplay = document.getElementById('number-display');
const clickBtn = document.getElementById('click-btn');
const upgradeBtn = document.getElementById('upgrade-btn');
const cpsDisplay = document.getElementById('cps-display');

function updateUI() {
    numberDisplay.textContent = Math.floor(score);
    upgradeBtn.disabled = score < upgradeCost;
    upgradeBtn.textContent = `Buy Auto-Clicker (Cost: ${upgradeCost})`;
    cpsDisplay.textContent = `Autos: ${autoClickers} (${autoClickers}/sec)`;
}

clickBtn.addEventListener('click', () => {
    score += 1;
    updateUI();
});

upgradeBtn.addEventListener('click', () => {
    if (score >= upgradeCost) {
        score -= upgradeCost;
        autoClickers += 1;
        upgradeCost = Math.ceil(upgradeCost * 1.5);
        updateUI();
    }
});

setInterval(() => {
    if (autoClickers > 0) {
        score += autoClickers;
        updateUI();
    }
}, 1000);
