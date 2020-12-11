const confirmButton = document.querySelector("button");
const modal = document.querySelector("uc-modal");

confirmButton.addEventListener("click", () => {
    //modal.setAttribute('opened', '');
    modal.open();
});

modal.addEventListener('confirm', () => {
    console.log("confirm");
});

modal.addEventListener('cancel', () => {
    console.log("cancel");
});
