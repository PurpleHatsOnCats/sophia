// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { getDatabase, ref, set, push, onValue } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-database.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAMcR0HacUdU09gfCB73DOZn-irQZebFZw",
    authDomain: "sophia-9971a.firebaseapp.com",
    projectId: "sophia-9971a",
    storageBucket: "sophia-9971a.firebasestorage.app",
    messagingSenderId: "956577458356",
    appId: "1:956577458356:web:c24328c49634f9f6c98fe1",
    measurementId: "G-MSRQB5XB57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase();


function saveAll({ story, cool, img, signature }) {
    const dataListLoc = ref(db, "answers/" + signature);
    return set(dataListLoc, {
        story: story,
        cool: cool,
        img: img
    });
}

export { saveAll }