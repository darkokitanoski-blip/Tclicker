// --- constants ---
const Tangry = "./71H9VKgKCXL._AC_UF894,1000_QL80_.jpg";
const Tmog = "./January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg";
const pointCounter = document.getElementById("point-counter");
const pointShower = document.querySelector("h3");
const autoClickerBtn = document.querySelector("button");
const quotesT = document.querySelector("h4");
const abilityContainer = document.getElementById("ac-ability-panel");

// --- game state ---
let points = Number(localStorage.getItem("points")) || 0;
let clickPower = 1;
let autoInterval = null;
let coinRainInterval = null;
let autoclicker = true;

const randomPos = ["60%", "30%"];
const randomQuotes = [
    "Do you mind if I sit back a little? Because your breath is very bad.",
    "I actually don't have a bad hairline.",
    "Sometimes by losing a battle you find a new way to win the war.",
    "I have a great relationship with the Mexican people."
];

// --- click handler ---
function handleClick() {
    setTimeout(() => {
        document.getElementById("imgT").src = Tmog;
        quotesT.style.opacity = 0;
    }, 450);

    quotesT.innerText = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
    quotesT.style.opacity = 1;

    points += clickPower;
    pointCounter.innerText = `You touched Trump ${points} times`;

    document.getElementById("imgT").src = Tangry;
    localStorage.setItem("points", points);
}

// --- click on Trump ---
document.getElementById("clicker-box").addEventListener("click", () => {
    autoclicker = true;
    clearInterval(autoInterval);
    autoClickerBtn.innerHTML = "Auto clicker";
    handleClick();
});

// --- auto clicker ---
autoClickerBtn.addEventListener("click", () => {
    if (autoclicker) {
        autoclicker = false;
        autoInterval = setInterval(() => {
            points += 1
        }, 1000);
        autoClickerBtn.innerHTML = "Stop Auto Clicking";
    } else {
        autoclicker = true;
        clearInterval(autoInterval);
        autoClickerBtn.innerHTML = "Auto clicker";
    }
});


function addStopButton(row, abilityName) {
    if (row.querySelector(".stop-btn")) return;

    const stopBtn = document.createElement("button");
    stopBtn.className = "stop-btn";
    stopBtn.style.marginLeft = "10px";
    stopBtn.innerText = "Stop Using";

    stopBtn.addEventListener("click", () => {
        if (abilityName === "Double Click") clickPower /= 2;
        else if (abilityName === "Auto Boost" && autoInterval) clearInterval(autoInterval);
        else if (abilityName === "Coin Rain" && coinRainInterval) clearInterval(coinRainInterval);

        stopBtn.remove();
        const mainBtn = row.querySelector(".ac-ability-btn");
        mainBtn.innerText = "Use";
        mainBtn.classList.remove("used");
    });

    row.appendChild(stopBtn);
}

// --- ability click logic ---
abilityContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("ac-ability-btn")) return;
  
    const btn = e.target;
    const row = btn.closest(".ac-ability-row"); // row of the clicked button
    const abilityName = row.querySelector(".ac-ability-name").innerText;
  
    // prevent duplicate stop buttons
    if (row.querySelector(".stop-btn")) return;
  
    // mark as used
    btn.classList.add("used");
    btn.innerText = "Used";
  
    // activate ability
    if (abilityName === "Double Click" && !localStorage.getItem("Double_Click")) {
      clickPower *= 2;
      setTimeout(() => clickPower /= 2, 10000);
      localStorage.setItem("Double_Click", "true");
    }
    if (abilityName === "Auto Boost" && !localStorage.getItem("Auto_Boost")) {
      if (autoInterval) clearInterval(autoInterval);
      autoInterval = setInterval(() => {
        points += clickPower;
        pointCounter.innerText = `You touched Trump ${points} times`;
        localStorage.setItem("points", points);
      }, 666);
      localStorage.setItem("Auto_Boost", "true");
    }
    if (abilityName === "Coin Rain" && !localStorage.getItem("Coin_Rain")) {
      if (coinRainInterval) clearInterval(coinRainInterval);
      coinRainInterval = setInterval(() => {
        points += 1;
        pointCounter.innerText = `You touched Trump ${points} times`;
        localStorage.setItem("points", points);
      }, 1000);
      localStorage.setItem("Coin_Rain", "true");
    }
  
    // --- add Stop Using button dynamically per row ---
    const stopBtn = document.createElement("button");
    stopBtn.className = "stop-btn";
    stopBtn.innerText = "Stop Using";
    stopBtn.style.marginLeft = "10px";
  
    stopBtn.addEventListener("click", () => {
      // deactivate ability
      if (abilityName === "Double Click") clickPower /= 2;
      if (abilityName === "Auto Boost" && autoInterval) clearInterval(autoInterval);
      if (abilityName === "Coin Rain" && coinRainInterval) clearInterval(coinRainInterval);
  
      // restore original Use button
      btn.classList.remove("used");
      btn.innerText = "Use";
  
      // remove this Stop button
      stopBtn.remove();
    });
  
    row.appendChild(stopBtn); // append directly to the same row
  });

// --- initialize previously bought abilities ---
function initAbilities() {
    const rows = document.querySelectorAll(".ac-ability-row");
    rows.forEach(row => {
        const abilityName = row.querySelector(".ac-ability-name").innerText;
        const btn = row.querySelector(".ac-ability-btn");

        if ((abilityName === "Double Click" && localStorage.getItem("Double_Click") === "true") ||
            (abilityName === "Auto Boost" && localStorage.getItem("Auto_Boost") === "true") ||
            (abilityName === "Coin Rain" && localStorage.getItem("Coin_Rain") === "true")) {

            btn.innerText = "Used";
            btn.classList.add("used");

            if (abilityName === "Double Click") clickPower *= 2;
            else if (abilityName === "Auto Boost") {
                if (autoInterval) clearInterval(autoInterval);
                autoInterval = setInterval(() => {
                    points += clickPower;
                    pointCounter.innerText = `You touched Trump ${points} times`;
                    localStorage.setItem("points", points);
                }, 666);
            } else if (abilityName === "Coin Rain") {
                if (coinRainInterval) clearInterval(coinRainInterval);
                coinRainInterval = setInterval(() => {
                    points += 1;
                    pointCounter.innerText = `You touched Trump ${points} times`;
                    localStorage.setItem("points", points);
                }, 1000);
            }

            addStopButton(row, abilityName);
        }
    });
}

// --- initial display ---
pointCounter.innerText = `You touched Trump ${points} times`;
initAbilities();