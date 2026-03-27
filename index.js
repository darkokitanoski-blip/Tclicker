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

const leaderboardList = document.getElementById("leaderboard-list");

// static random players
const fakePlayers = [
    { name: "Player123", points: 150 },
    { name: "ClickMaster", points: 320 },
    { name: "NoLife99", points: 780 },
    { name: "Grandma", points: 90 },
    { name: "ElonFan", points: 500 }
];

// player object
function getPlayer() {
    return { name: "YOU", points: points };
}

function updateLeaderboard() {
    const allPlayers = [...fakePlayers, getPlayer()];

    allPlayers.sort((a, b) => b.points - a.points);

    leaderboardList.innerHTML = "";

    allPlayers.forEach((player, index) => {
        const li = document.createElement("li");

        li.innerText = `#${index + 1} ${player.name} : ${player.points}`;
        if (player.name === "YOU") {
            li.style.fontWeight = "bold";
            li.style.color = "gold";
        }

        leaderboardList.appendChild(li);
    });
}

// klick event
function handleClick(isAuto = false) {
    if (!isAuto) {
        // random quotes från trump varje gång man trycker 
        quotesT.innerText = randomQuotes[Math.floor(Math.random() * randomQuotes.length)];
        quotesT.style.opacity = 1;

        setTimeout(() => {
            document.getElementById("imgT").src = Tmog;
            quotesT.style.opacity = 0;
        }, 450);

        document.getElementById("imgT").src = Tangry;
    }
    points += clickPower;
    setTimeout(() => {
        document.getElementById("imgT").src = Tmog;
        quotesT.style.opacity = 0;
    }, 450);

    document.getElementById("imgT").src = Tangry;
    pointCounter.innerText = `You touched Trump ${points} times`;
    localStorage.setItem("points", points);
    updateLeaderboard();
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

// auto klicker
autoClickerBtn.addEventListener("click", () => {
    if (!autoclickerActive) {
        autoclickerActive = true;

        autoInterval = setInterval(() => {
            clickPower = 1
            points++;
            pointCounter.innerText = `You touched Trump ${points} times`;
            localStorage.setItem("points", points);
            updateLeaderboard();
        }, 1000);

        autoClickerBtn.innerText = "Stop Auto Clicking";
    } else {
        autoclickerActive = false;
        clearInterval(autoInterval);
        autoClickerBtn.innerText = "Auto clicker";
    }
});

function addStopButton(row, abilityName, mainBtn) {
    if (row.querySelector(".stop-btn")) return;
    //  skapa ett stop knapp
    const stopBtn = document.createElement("button");
    stopBtn.className = "stop-btn";
    stopBtn.innerText = "Stop Using";
    stopBtn.style.marginLeft = "10px";

    // när man tryker på stop 
    stopBtn.addEventListener("click", () => {
        if (abilityName === "Double Click") clickPower = 1;
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

// Köpa ability 
abilityContainer.addEventListener("click", (e) => {
    if (!e.target.classList.contains("ac-ability-btn")) return;

    const btn = e.target;
    const row = btn.closest(".ac-ability-row");
    const abilityName = row.querySelector(".ac-ability-name").innerText;

    if (row.querySelector(".stop-btn")) return;

    if (abilityName === "Double Click") {
        const cost = 100;
        const owned = localStorage.getItem("Double_Click");

        if (!owned) {
            if (points < cost) {
                alert("You do not have enough points to buy this ability!")
                return;
            } // har inte tillräckligt points

            points -= cost; // 
            localStorage.setItem("Double_Click", "true");
        }


        btn.classList.add("used");
        btn.innerText = "Used";
        clickPower = 2;
        addStopButton(row, abilityName, btn);
    }


    if (abilityName === "Auto Boost") {
        const cost = 500;
        const owned = localStorage.getItem("Auto_Boost");

        if (!owned) {
            if (points < cost) {
                alert("You do not have enough points to buy this ability!")
                return;
            }

            points -= cost;
            localStorage.setItem("Auto_Boost", "true");
        }

        btn.classList.add("used");
        btn.innerText = "Used";
        addStopButton(row, abilityName, btn);

        if (autoInterval) clearInterval(autoInterval);
        autoInterval = setInterval(() => handleClick(true), 666);
    }


    // man får extra points
    if (abilityName === "Coin Rain") {
        const cost = 1000;
        const owned = localStorage.getItem("Coin_Rain");

        if (!owned) {
            if (points < cost) {
                alert("You do not have enough points to buy this ability!")
                return;
            }

            points -= cost;
            localStorage.setItem("Coin_Rain", "true");
        }

        btn.classList.add("used");
        btn.innerText = "Used";
        addStopButton(row, abilityName, btn);

        if (coinRainInterval) clearInterval(coinRainInterval);
        coinRainInterval = setInterval(() => {
            points += 1;
            pointCounter.innerText = `You touched Trump ${points} times`;
            localStorage.setItem("points", points);
        }, 1000);
    }


    if (abilityName === "Gambling") {
        const cost = 700;
        const cooldownTime = 30000; // 30 sekunder

        const now = Date.now();

        const lastUsed = Number(localStorage.getItem("bigPotCooldown")) || 0;

        // cooldown check
        if (now - lastUsed < cooldownTime) {
            btn.innerText = "Cooldown still active";
            return;
        }

        if (points < cost) {
            alert("You do not have enough points to buy this ability!");
            return;
        }

        
        if (Math.floor(Math.random() * 100000) === 0) {
            points += 10000;
        } else {
            points -= 500;
        }

        localStorage.setItem("bigPotCooldown", now);

        btn.innerText = "Cooldown: 30 seconds";
        let timeLeft = 30;

        const countdown = setInterval(() => {
            btn.innerText = `Cooldown: ${timeLeft}s`;
            timeLeft--;

            if (timeLeft < 0) {
                clearInterval(countdown);
            }
        }, 1000);
        pointCounter.innerText = `You touched Trump ${points} times`;
        localStorage.setItem("points", points);


        setTimeout(() => {
            btn.innerText = "Big pot";
        }, cooldownTime);
    }

    if (abilityName === "Click Frenzy") {
        const cost = 7500;
        if (points < cost) {
            alert("You do not have enough points to buy this ability!")
            return;
        }

        const owned = localStorage.getItem("Click_Frenzy");

        let oldClickerPower = clickPower

        setTimeout(() => {
            btn.innerText = "7500";
            clickPower = oldClickerPower
            btn.style.backgroundColor = "#4caf50";
        }, 5000)
        clickPower = 500
        if (btn.innerText !== 'using') {
            points -= cost;
        }
        btn.innerText = "using";
        let timeLeft = 5;

        // timer visual
        const countdown = setInterval(() => {
            btn.innerText = `using ${timeLeft}s`;
            timeLeft--;

            if (timeLeft === 0) {
                clearInterval(countdown);
                btn.innerText = "7500";
            }
        }, 1000);
        btn.style.backgroundColor = "red";

    }


});
// använding av abilities 

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
                updateLeaderboard();
            }, 1000);

            addStopButton(row, abilityName, btn);
        }
    });
}

// alla localstorage variabler ska koma up
window.addEventListener("load", () => {
    updateLeaderboard();
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

pointCounter.innerText = `You touched Trump ${points} times`;
initAbilities();