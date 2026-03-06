const Tangry = "./71H9VKgKCXL._AC_UF894,1000_QL80_.jpg"
const Tmog = "./January_2025_Official_Presidential_Portrait_of_Donald_J._Trump.jpg"
const pointCounter = document.getElementById("point-counter")
const pointShower = document.querySelector("h3")
const autoClickerBtn = document.querySelector("button")
const quotesT = document.querySelector("h4")

let autoInterval = null


let autoclicker = true
let points = localStorage.getItem("points")
console.log(localStorage.getItem("points"))

const randomPos = ["60%", "30%"]
const randomQuotes = ["Do you mind if I sit back a little? Because your breath is very bad.", "I actually don't have a bad hairline.", "Sometimes by losing a battle you find a new way to win the war.","I have a great relationship with the Mexican people." ]

const triggerAutoClicker = () => {
    console.log(autoclicker)
    if (autoclicker) {
        autoclicker = false
        autoInterval = setInterval(() => {
            console.log("hello")
            setTimeout(() => {
                document.getElementById("imgT").setAttribute("src", Tmog)
                pointShower.style.animation = ""
                quotesT.style.opacity = 0
            }, 450)
            quotesT.innerText = randomQuotes[Math.round(Math.random())*3] 
            quotesT.style.opacity = 1
            pointCounter.innerText = "You touched Trump " + points++ + " times"
            pointShower.style.animation = "showPoint linear 1s "
            pointShower.style.left = randomPos[Math.round(Math.random())] 
            document.getElementById("imgT").setAttribute("src", Tangry)
            localStorage.setItem("points", points)
        }, 1000)
        
        autoClickerBtn.innerHTML = "Stop Auto CLicking"
    } else {
        console.log("stopped")
        clearInterval(autoInterval)
        autoclicker = true
            autoClickerBtn.innerHTML = "Auto Clicker"
    }

}

autoClickerBtn.addEventListener("click", triggerAutoClicker)

if (points > 0) {
    pointCounter.innerText = "You touched Trump " + points++ + " times"
}


document.getElementById("clicker-box").addEventListener("click", () => {
    autoclicker = true
    clearInterval(autoInterval)
    autoClickerBtn.innerHTML = "Auto Clicker"
    setTimeout(() => {
        document.getElementById("imgT").setAttribute("src", Tmog)
        pointShower.style.animation = ""
        quotesT.style.opacity = 0
    }, 450)
    quotesT.innerText = randomQuotes[Math.round(Math.random())*3] 
    quotesT.style.opacity = 1
    pointCounter.innerText = "You touched Trump " + points++ + " times"
    pointShower.style.animation = "showPoint linear 1s "
    console.log(randomPos[Math.round(Math.random())])
    pointShower.style.left = randomPos[Math.round(Math.random())] 
    document.getElementById("imgT").setAttribute("src", Tangry)
    localStorage.setItem("points", points)
})



