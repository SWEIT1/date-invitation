
const screens = document.querySelectorAll(".screen");

// =================================
// SCREEN NAVIGATION
// =================================

function showScreen(id) {
    screens.forEach(screen => {
        screen.classList.remove("active");
    });

    const nextScreen = document.getElementById(id);

    nextScreen.classList.add("active");

    // Change background and button theme
    document.body.dataset.theme = id;

    // Scroll to top when changing screens
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// =================================
// 1. INVITATION
// =================================

const yesButton = document.getElementById("yes-button");
const noButton = document.getElementById("no-button");
const buttonContainer = document.getElementById("invite-buttons");

function escapeNoButton() {
    const containerRect = buttonContainer.getBoundingClientRect();

    const maxX = Math.max(
        0,
        containerRect.width - noButton.offsetWidth
    );

    const maxY = Math.max(
        0,
        containerRect.height - noButton.offsetHeight
    );

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    noButton.style.position = "absolute";
    noButton.style.left = `${x}px`;
    noButton.style.top = `${y}px`;
}

noButton.addEventListener("pointerenter", (event) => {
    if (event.pointerType === "mouse") {
        escapeNoButton();
    }
});

noButton.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") {
        event.preventDefault();
        escapeNoButton();
    }
});

noButton.addEventListener("click", (event) => {
    event.preventDefault();
});

yesButton.addEventListener("click", () => {
    showScreen("screen-date");
});

// =================================
// 2. DATE SELECTION
// =================================

const calendar = document.getElementById("calendar");
const dateNext = document.getElementById("date-next");

const targetDate = "2026-11-29";
let selectedDate = null;

const daysInMonth = 30;

// November 1, 2026 is Sunday.
// Calendar starts on Monday.
const firstDayOffset = 6;

// Empty calendar cells
for (let i = 0; i < firstDayOffset; i++) {
    const empty = document.createElement("div");
    calendar.appendChild(empty);
}

// Create calendar days
for (let day = 1; day <= daysInMonth; day++) {
    const button = document.createElement("button");

    button.type = "button";
    button.textContent = day;

    const date = `2026-11-${String(day).padStart(2, "0")}`;

    button.addEventListener("click", () => {

        // Only November 29 is available
        if (date !== targetDate) {
            button.animate(
                [
                    { transform: "translateX(0)" },
                    { transform: "translateX(-5px)" },
                    { transform: "translateX(5px)" },
                    { transform: "translateX(-5px)" },
                    { transform: "translateX(0)" }
                ],
                {
                    duration: 300
                }
            );

            return;
        }

        selectedDate = date;

        calendar.querySelectorAll("button").forEach(btn => {
            btn.classList.remove("selected");
        });

        button.classList.add("selected");

        dateNext.disabled = false;
    });

    calendar.appendChild(button);
}

dateNext.addEventListener("click", () => {
    if (selectedDate === targetDate) {
        showScreen("screen-cinema");
    }
});

// =================================
// 3. DATE LOCATION OPTIONS
// =================================


const cinemaOptions = [
    {
        value: "cinema",
        icon: "🎬",
        title: "Кинотеатр",
        correct: true
    },
    {
        value: "park",
        icon: "🌳",
        title: "Парк",
        correct: false
    },
    {
        value: "home",
        icon: "🏠",
        title: "Дома",
        correct: false
    }
];

const foodOptions = [
    {
        value: "pizza",
        icon: "🍕",
        title: "Пицца",
        description: "Что может быть лучше горячей пиццы?",
        correct: false
    },
    {
        value: "burgers",
        icon: "🍔",
        title: "Бургеры",
        description: "Сочно, вкусно и сытно",
        correct: false
    },
    {
        value: "sushi",
        icon: "🍣",
        title: "Роллы",
        description: "Немного японской кухни",
        correct: true
    }
];

// =================================
// CARD GENERATOR
// =================================

function createOptions(containerId, options, onSelect) {
    const container = document.getElementById(containerId);

    container.innerHTML = "";

    options.forEach(option => {
        const card = document.createElement("div");

        card.className = "option-card";
        card.dataset.value = option.value;

        card.setAttribute("role", "button");
        card.setAttribute("tabindex", "0");

        card.innerHTML = `
            <div class="option-icon">${option.icon}</div>
            <h2>${option.title}</h2>
        `;

        function trySelect() {
            if (!option.correct) {
                card.animate(
                    [
                        { transform: "translateX(0)" },
                        { transform: "translateX(-7px)" },
                        { transform: "translateX(7px)" },
                        { transform: "translateX(-5px)" },
                        { transform: "translateX(0)" }
                    ],
                    { duration: 350 }
                );

                return;
            }

            container.querySelectorAll(".option-card").forEach(item => {
                item.classList.remove("selected");
                item.setAttribute("aria-pressed", "false");
            });

            card.classList.add("selected");
            card.setAttribute("aria-pressed", "true");

            onSelect(option.value);
        }

        card.addEventListener("click", trySelect);

        card.addEventListener("keydown", event => {
            if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                trySelect();
            }
        });

        container.appendChild(card);
    });
}


// =================================
// CINEMA / LOCATION SELECTION
// =================================

let selectedCinema = null;

const cinemaNext = document.getElementById("cinema-next");

createOptions("cinema-options", cinemaOptions, value => {
    selectedCinema = value;
    cinemaNext.disabled = false;
});

cinemaNext.addEventListener("click", () => {
    if (selectedCinema !== null) {
        showScreen("screen-food");
    }
});

// =================================
// FOOD SELECTION
// =================================

let selectedFood = null;

const foodNext = document.getElementById("food-next");

createOptions("food-options", foodOptions, value => {
    selectedFood = value;
    foodNext.disabled = false;
});

foodNext.addEventListener("click", () => {
    if (selectedFood !== null) {
        showScreen("screen-final");
    }
});
