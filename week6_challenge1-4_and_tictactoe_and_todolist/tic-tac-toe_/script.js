let turn = "X";
let xScore = 0;
let oScore = 0;
const cells = document.querySelectorAll("#grid div");


cells.forEach((cell, index) => {
    cell.addEventListener("click", function() {
        if (this.textContent === "") {
            this.textContent = turn;
      
            if (turn === "X") {
                this.style.color = "red";
            } else {
                this.style.color = "blue";
            }

            checkWin(); 
            
         
            turn = (turn === "X") ? "O" : "X";
        }
    });
});


function checkWin() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    winPatterns.forEach(p => {
        if (cells[p[0]].textContent !== "" && 
            cells[p[0]].textContent === cells[p[1]].textContent && 
            cells[p[0]].textContent === cells[p[2]].textContent) {
            
            alert(cells[p[0]].textContent + " ชนะ!");
            updateScore(cells[p[0]].textContent);
            resetBoard();
        }
    });
}


function updateScore(winner) {
    if (winner === "X") {
        xScore++;
        document.getElementById("scoreX").textContent = xScore;
    } else {
        oScore++;
        document.getElementById("scoreO").textContent = oScore;
    }
}


document.getElementById("resetBtn").onclick = resetBoard;

function resetBoard() {
    cells.forEach(cell => {
        cell.textContent = "";
    });
    turn = "X";
}