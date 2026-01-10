import * as firebase from './firebase.js';

const updateDisplay = async () => {
    let data = await firebase.loadResults();
    let keys = Object.keys(data);

    // Build cards
    results.innerHTML = keys.map((key) => {
        if (!data[key].signature) {
            return;
        }
        let answer = data[key];
        let format = "<div class=\"card m-4 cell\">";

        if (answer.img) {
            format += `
                <div class=\"card-image is-flex-grow-1\">
                    <figure class=\"image\">
                        <img src=${answer.img} alt=\"Favorite picture"/>
                    </figure>
                </div>`
        }
        format += "<div class=\"card-content\">";
        format += `<h3 class=\"title is-3 has-text-centered\">${answer.signature}</h3>`
        if (answer.met) {
            format += formatParagraph("When did you meet?", answer.met);
        }
        if (answer.story) {
            format += formatParagraph("What is your favorite story?", answer.story);
        }
        if (answer.cool) {
            format += formatParagraph("What is the coolest thing about her?", answer.cool);
        }
        format += "</div></div>"

        return format;
    }).join("");

    // Add click events for slide
    for (let i = 0; i < results.children.length; i++) {
        results.children[i].addEventListener("click", () => {
            if (slide && currentCard != i && enableClick) {
                setCurrentCard(i);
            }
        });
    }
    setCurrentCard(0);
}

const formatParagraph = (title, text) => {
    return `<div class="block"><h4 class="subtitle has-text-white">${title}</h4>${text}</div>`;
}


let btnSlide = document.querySelector("#btn-slide");
let btnGrid = document.querySelector("#btn-grid");
let results = document.querySelector("#results");
let carousel = document.querySelector("#carousel");
const setupUI = () => {
    document.querySelector("#btn-load").addEventListener("click", () => {
        updateDisplay();
    });
    btnSlide.addEventListener("click", () => {
        if (!btnSlide.classList.contains("is-selected")) {
            btnSlide.classList.add("is-selected");
            btnSlide.classList.add("is-info");
            btnGrid.classList.remove("is-selected");
            btnGrid.classList.remove("is-info");
            setSlide(true);
        }
    });
    btnGrid.addEventListener("click", () => {
        if (!btnGrid.classList.contains("is-selected")) {
            btnGrid.classList.add("is-selected");
            btnGrid.classList.add("is-info");
            btnSlide.classList.remove("is-selected");
            btnSlide.classList.remove("is-info");
            setSlide(false);
        }
    });
};

let slide = false;
const setSlide = (bool) => {
    slide = bool;
    if (bool) {
        results.classList.remove("grid");
        results.classList.add("carousel-cards");
        carousel.classList.add("carousel");
        setCurrentCard(0);
    }
    else {
        results.classList.add("grid");
        results.classList.remove("carousel-cards");
        carousel.classList.remove("carousel");

        let cards = results.children;
        for (let i = 0; i < cards.length; i++) {
            cards[i].style.transform = ""
        }
    }
}

let currentCard;
const setCurrentCard = (current) => {
    let cards = results.children;
    currentCard = current;
    if (cards.length == 0 || !slide) {
        return;
    }
    for (let i = 0; i < cards.length; i++) {
        cards[i].style.transform = `translate(${-(cards[i].clientWidth * (current + 0.5) + parseInt(window.getComputedStyle(cards[i]).marginLeft) * (2 * current + 1))}px,0) 
            scale(${1 - Math.pow(Math.abs(current - i), 2) / 6})`;
    }
}

window.addEventListener('resize', () => {
    if (slide) {
        setCurrentCard(currentCard);
    }
});

document.querySelector("#carousel").addEventListener("mousedown", lock);
document.querySelector("#carousel").addEventListener("touchstart", lock);

document.querySelector("#carousel").addEventListener("mousemove", drag);
document.querySelector("#carousel").addEventListener("touchmove", drag);

document.querySelector("#carousel").addEventListener("mouseup", move);
document.querySelector("#carousel").addEventListener("touchend", move);

window.addEventListener("click", () => { enableClick = true; });

function unify(e) { return e.changedTouches ? e.changedTouches[0] : e };
let x0, y0 = null;
function lock(e) { x0 = unify(e).clientX; y0 = unify(e).clientY};
let enableClick = true;
const dragMin = 64;
function drag(e) {
    if (x0 || x0 === 0) {
        let dx = unify(e).clientX - x0;
        if (Math.abs(dx) > dragMin) {
            enableClick = false;
        }
    }
}

function move(e) {
    if (x0 || x0 === 0) {
        let dx = unify(e).clientX - x0, s = Math.sign(dx), dy = unify(e).clientY - y0;
        console.log(dx);
        if ((currentCard > 0 || s < 0) && (currentCard < results.children.length - 1 || s > 0) && 
            (Math.abs(dx) > dragMin && Math.abs(dy) < Math.abs(dx))) {
            setCurrentCard(currentCard - s);
        }
        x0 = null
    }
};

setupUI();
setSlide(true);
updateDisplay();