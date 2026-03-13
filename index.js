// --- constants ---
const Tangry = "./71H9VKgKCXL._AC_UF894,1000_QL80_.jpg";
const Tmog = "./January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg";

const pointCounter = document.getElementById("point-counter");
const quotesT = document.querySelector("h4");
const autoClickerBtn = document.querySelector("button");
const abilityContainer = document.getElementById("ac-ability-panel");

// --- game state ---
let points = Number(localStorage.getItem("points")) || 0;
let clickPower = 1;
let autoInterval = null;
let coinRainInterval = null;
let autoclickerActive = false;

const randomQuotes = [
    "Do you mind if I sit back a little? Because your breath is very bad.",
    "I actually don't have a bad hairline.",
    "Sometimes by losing a battle you find a new way to win the war.",
    "I have a great relationship with the Mexican people."
];

// --- click handler ---
function handleClick(isAuto = false) {
    if (!isAuto) {
        // animation & quotes only for manual clicks
        quotesT.innerText = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
        quotesT.style.opacity = 1;

        setTimeout(() => {
            document.getElementById("imgT").src = Tmog;
            quotesT.style.opacity = 0;
        }, 450);

        document.getElementById("imgT").src = Tangry;
    }
    console.log(points)
    points += clickPower;
    setTimeout(() => {
        document.getElementById("imgT").src = Tmog;
        quotesT.style.opacity = 0;
    }, 450);

    document.getElementById("imgT").src = Tangry;
    pointCounter.innerText = `You touched Trump ${points} times`;
    localStorage.setItem("points", points);
}

// --- manual click ---
document.getElementById("clicker-box").addEventListener("click", () => {
    if (autoclickerActive) {
        clearInterval(autoInterval);
        autoClickerBtn.innerText = "Auto clicker";
        autoclickerActive = false;
    }
    handleClick();
});

// --- auto-clicker button ---
autoClickerBtn.addEventListener("click", () => {
    if (!autoclickerActive) {
        autoclickerActive = true;

        autoInterval = setInterval(() => {
            points++;
            pointCounter.innerText = `You touched Trump ${points} times`;
            localStorage.setItem("points", points);
        }, 1000);

        autoClickerBtn.innerText = "Stop Auto Clicking";
    } else {
        autoclickerActive = false;
        clearInterval(autoInterval);
        autoClickerBtn.innerText = "Auto clicker";
    }
});

// --- stop button helper ---
function addStopButton(row, abilityName, mainBtn) {
    if (row.querySelector(".stop-btn")) return;
    const stopBtn = document.createElement("button");
    stopBtn.className = "stop-btn";
    stopBtn.innerText = "Stop Using";
    stopBtn.style.marginLeft = "10px";

    stopBtn.addEventListener("click", () => {
        if (abilityName === "Double Click") clickPower = 1; // subtrahera korrekt
        if (abilityName === "Auto Boost" && autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
        }
        if (abilityName === "Coin Rain" && coinRainInterval) {
            clearInterval(coinRainInterval);
            coinRainInterval = null;
        }

        mainBtn.classList.remove("used");
        mainBtn.innerText = "Use";
        stopBtn.remove();

        // // ta bort localStorage så det kan användas igen
        // if (abilityName === "Double Click") localStorage.removeItem("Double_Click");
        // if (abilityName === "Auto Boost") localStorage.removeItem("Auto_Boost");
        // if (abilityName === "Coin Rain") localStorage.removeItem("Coin_Rain");
    });

    row.appendChild(stopBtn);
}

// --- ability logic ---
abilityContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("ac-ability-btn")) return;

    const btn = e.target;
    const row = btn.closest(".ac-ability-row");
    const abilityName = row.querySelector(".ac-ability-name").innerText;

    if (row.querySelector(".stop-btn")) return; 

    if (abilityName === "Double Click") {

        if (btn.innerText !== "Use") {
            points -= 100;
            btn.classList.add("used");
            btn.innerText = "Used";
            clickPower = 2;
            addStopButton(row, abilityName, btn);
            localStorage.setItem("Double_Click", "true");
    
        } else if (points > 99 && !localStorage.getItem("Double_Click")) {
            return;
    
        } else {
            btn.classList.add("used");
            btn.innerText = "Used";
            clickPower = 2;
            addStopButton(row, abilityName, btn);
            localStorage.setItem("Double_Click", "true");
        }
    }
    
    if (abilityName === "Auto Boost") {
    
        if (btn.innerText !== "Use") {
            points -= 500;
            btn.classList.add("used");
            btn.innerText = "Used";
            addStopButton(row, abilityName, btn);
    
            if (autoInterval) clearInterval(autoInterval);
            autoInterval = setInterval(() => handleClick(true), 666);
    
            localStorage.setItem("Auto_Boost", "true");
    
        } else if (points > 499 && !localStorage.getItem("Auto_Boost")) {
            return;
    
        } else {
            btn.classList.add("used");
            btn.innerText = "Used";
            addStopButton(row, abilityName, btn);
    
            if (autoInterval) clearInterval(autoInterval);
            autoInterval = setInterval(() => handleClick(true), 666);
    
            localStorage.setItem("Auto_Boost", "true");
        }
    }
    
    if (abilityName === "Coin Rain") {
    
        if (btn.innerText !== "Use") {
            points -= 1000;
            btn.classList.add("used");
            btn.innerText = "Used";
            addStopButton(row, abilityName, btn);
    
            if (coinRainInterval) clearInterval(coinRainInterval);
            coinRainInterval = setInterval(() => {
                points += 1;
                pointCounter.innerText = `You touched Trump ${points} times`;
                localStorage.setItem("points", points);
            }, 1000);
    
            localStorage.setItem("Coin_Rain", "true");
    
        } else if (points > 999 && !localStorage.getItem("Coin_Rain")) {
            return;
    
        } else {
            btn.classList.add("used");
            btn.innerText = "Used";
            addStopButton(row, abilityName, btn);
    
            if (coinRainInterval) clearInterval(coinRainInterval);
            coinRainInterval = setInterval(() => {
                points += 1;
                pointCounter.innerText = `You touched Trump ${points} times`;
                localStorage.setItem("points", points);
            }, 1000);
    
            localStorage.setItem("Coin_Rain", "true");
        }

    }

});

function initAbilities() {
    const rows = document.querySelectorAll(".ac-ability-row");
    rows.forEach(row => {
        const abilityName = row.querySelector(".ac-ability-name").innerText;
        const btn = row.querySelector(".ac-ability-btn");

        const usedDoubleClick = abilityName === "Double Click" && localStorage.getItem("Double_Click") === "true";
        const usedAutoBoost = abilityName === "Auto Boost" && localStorage.getItem("Auto_Boost") === "true";
        const usedCoinRain = abilityName === "Coin Rain" && localStorage.getItem("Coin_Rain") === "true";

        if (usedDoubleClick || usedAutoBoost || usedCoinRain) {
            btn.classList.add("used");
            btn.innerText = "Used";

            if (abilityName === "Double Click") clickPower = 2;
            else if (abilityName === "Auto Boost") autoInterval = setInterval(() => handleClick(true), 666);
            else if (abilityName === "Coin Rain") coinRainInterval = setInterval(() => {
                points += 1;
                pointCounter.innerText = `You touched Trump ${points} times`;
                localStorage.setItem("points", points);
            }, 1000);

            addStopButton(row, abilityName, btn);
        }
    });
}

window.addEventListener("load", () => {
  if (localStorage.getItem("Double_Click")) clickPower = 2;
  if (localStorage.getItem("Auto_Boost") && !autoInterval) {
    autoInterval = setInterval(() => {
      points += clickPower;
      pointCounter.innerText = `You touched Trump ${points} times`;
      localStorage.setItem("points", points);
    }, 666);
  }
  if (localStorage.getItem("Coin_Rain") && !coinRainInterval) {
    coinRainInterval = setInterval(() => {
      points += 1;
      pointCounter.innerText = `You touched Trump ${points} times`;
      localStorage.setItem("points", points);
    }, 1000);
  }

  pointCounter.innerText = `You touched Trump ${points} times`;
});

// --- initialize ---
pointCounter.innerText = `You touched Trump ${points} times`;
initAbilities();