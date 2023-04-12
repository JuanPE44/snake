if (localStorage.getItem("puntos") === null) {
  let puntos = [];
  localStorage.setItem("puntos", JSON.stringify(puntos));
}

const btnIniciar = document.querySelector(".btn-iniciar");
const btnReiniciar = document.querySelector(".btn-reiniciar");
let requestID;
let fotogramasPorSegundo = 8;
const G = new Game();

btnIniciar.addEventListener("click", () => {
  G.iniciar();
  loop();
  btnIniciar.style.display = "none";
});

btnReiniciar.addEventListener("click", () => {
  G.reiniciar();
  loop();
  btnReiniciar.style.display = "none";
});

function loop() {
  setTimeout(function () {
    requestID = window.requestAnimationFrame(loop);
    G.moverResultado();
  }, 1000 / fotogramasPorSegundo);
}
