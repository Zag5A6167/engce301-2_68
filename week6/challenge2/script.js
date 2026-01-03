const allParagraphs = document.querySelectorAll('#main p');


allParagraphs.forEach(p => {

    if (p.textContent.includes("Llamas and Chickens!")) {
        p.style.color = "red";
    }
});