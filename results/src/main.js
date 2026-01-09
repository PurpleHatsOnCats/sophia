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
                <div class=card-image>
                    <figure class=image is-4by3>
                        <img src=${answer.img} alt=\"Favorite picture"/>
                    </figure>
                </div>`
        }
        format += "<div class=card-content>";
        format += `<h3 class="title is-3 has-text-centered">${answer.signature}</h3>`
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
    console.log(results.children);
    for(let i = 0; i < results.children.length; i++){
        console.log( results.children[i]);
        results.children[i].addEventListener("click",()=>{
            if(slide){
                setCurrentCard(i);
                
            }
            console.log("set card to: " + i);
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
const setSlide = (bool)=>{
    slide = bool;
    if(bool){
        results.classList.remove("grid");
        results.classList.add("carousel-cards");
        carousel.classList.add("carousel");
        setCurrentCard(0);
    }
    else{
        results.classList.add("grid");
        results.classList.remove("carousel-cards");
        carousel.classList.remove("carousel");

        let cards = results.children;
        for(let i = 0; i < cards.length; i++){
            cards[i].style.transform = ""
        }
    }
}

const setCurrentCard = (current) => {
    let cards = results.children;
    if(cards.length == 0 || !slide){
        return;
    }
    for(let i = 0; i < cards.length; i++){
        cards[i].style.transform = `translate(${
            -(cards[i].clientWidth*(current+0.5) + parseInt(window.getComputedStyle(cards[i]).marginLeft) * (2*current+1))}px,0) 
            scale(${1-Math.pow(Math.abs(current-i),2)/6})`;
    }
}


setupUI();
setSlide(true);
updateDisplay();