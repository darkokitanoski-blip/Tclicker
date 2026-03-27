# README – Clicker Game

## Beskrivning
Detta är ett clicker-spel inspirerat av Cookie Clicker.

Spelaren klickar på en knapp för att samla poäng.  
Målet är att få så många poäng som möjligt och köpa uppgraderingar som gör att man tjänar poäng snabbare.

---

## Hur spelet fungerar
När spelaren klickar händer följande:

klick → funktion körs → variabeln `points` ökar → sidan uppdateras

Spelaren kan sedan använda sina poäng för att köpa olika abilities och uppgraderingar.

---

## Teknik & lösningar

### Variabler
- `points` – lagrar spelarens poäng
- `clickPower` – hur mycket varje klick ger
- `cost` – priset på uppgraderingar
- `cooldown` – håller koll på cooldowns via 

### Klickfunktion
Klickfunktionen ökar poängen baserat på `clickPower` och sparar värdet i `localStorage`.

### updateDisplay()
Denna funktion uppdaterar texten på sidan så att spelaren ser sina aktuella poäng.

### addEventListener
Jag använder `addEventListener` för att koppla klick på knappar till funktioner, t.ex:

### Uppgraderingar
När man köper upgradering så spenderar du coins och du får abilty men det finns annorludna typ av abilty, du har one buy och flera gångs buy

### Problem & lösningar
Att fixa auto clicker
`autoClickerBtn.addEventListener("click", () => {
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
`

### Reflektion
Jag har lärt mig js
