import * as firebase from './firebase.js'

const story = document.querySelector("#text-story");
const cool = document.querySelector("#text-cool");
const imgSelect = document.querySelector("#img");
const imgPreview = document.querySelector('#imagePreview');
const signature = document.querySelector('#text-signature');
const btn = document.querySelector("#btn-send");
const warning = document.querySelector("#warning");
const success = document.querySelector("#success");

let imgData;

imgSelect.addEventListener('change', function (event) {
    imgPreview.innerHTML = '';
    const files = event.target.files;
    if (files.length > 0) {
        const file = files[0];

        // Ensure the selected file is an image
        if (file.type.startsWith('image/')) {
            document.querySelector('.file-name').innerHTML = file.name;
            // Use FileReader to read the file content
            const reader = new FileReader();

            reader.onload = function (e) {
                // Create an image element
                const img = document.createElement('img');
                // Set the image source to the result of the FileReader (the image data URL)
                img.src = e.target.result;
                imgData = e.target.result;
                // Optional: Add a class for styling
                img.classList.add('preview-image');
                // Append the image to the preview container
                imgPreview.appendChild(img);
            };

            // Read the file as a Data URL (base64 encoded string)
            reader.readAsDataURL(file);
        }
    }
});

const checkSignature = () => {
    if (signature.value != "") {
        btn.disabled = false
        warning.innerHTML = "";
    }
    else {
        btn.disabled = true;
        warning.innerHTML = "Add your name before submitting!"
    }
}

const clearSuccess = () => {
    success.innerHTML = "";
}
const setUpUI = () => {
    signature.addEventListener("input", checkSignature);
    checkSignature();

    signature.addEventListener("input", clearSuccess);
    story.addEventListener("input", clearSuccess);
    cool.addEventListener("input", clearSuccess);
    img.addEventListener("input", clearSuccess);

    btn.addEventListener("click", async () => {
        await firebase.saveAll({
            story: story.value,
            cool: cool.value,
            img: imgData,
            signature: signature.value
        });
        success.innerHTML = "Successfully submitted!";
    });
}


setUpUI();