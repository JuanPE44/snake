
class Game {

    constructor() {
        this.serpienteActual = ['1-3','1-2','1-1'];  
        this.direccion = 1;
        this.tablero = []; 
        this.manzana;   
    }

    iniciar() {
        document.addEventListener('keydown',(e)=> this.control(e));
        this.rellenarTablero();
        this.manzanaAzar();
    }

    rellenarTablero() {
        let tablero = [];
        const divTablero = document.querySelector('.tablero');

        for(let i=0;i<30;i++) {
            tablero[i] = [];
        }

        for(let i=0;i<30;i++) {
            for(let j=0;j<30;j++) {
                const C = new Cuadrado('cuadrado',i.toString()+'-'+j.toString());
                let cuadrado = C.crearCuadrado();
                tablero[i][j] = cuadrado;
                divTablero.appendChild(cuadrado);
            }
        }
        this.tablero = tablero;                
    }

    despintarSerpiente() {
        this.serpienteActual.forEach(id => {
            let ids = this.obtenerIds(id);
            this.tablero[ids[0]][ids[1]].classList.remove('serpiente');
            this.tablero[ids[0]][ids[1]].classList.remove('cabeza');
        }); 
    }


    pintarSerpiente() {  
        let primero = true;      
        this.serpienteActual.forEach(id => {
            let ids = this.obtenerIds(id);
            if(primero) {
                this.tablero[ids[0]][ids[1]].classList.add('cabeza');
                primero = false;
            } else {
                this.tablero[ids[0]][ids[1]].classList.add('serpiente');
            }             
        }); 
    }

    moverSerpiente() {
        let direccion;
        let cola = this.serpienteActual.pop()  
        let idCabeza = this.obtenerIds(this.serpienteActual[0]);
        let idManzana = this.obtenerIds(this.manzana);        
        
        switch(this.direccion) {
            case 
                1: direccion = idCabeza[0]+'-'+(parseInt(idCabeza[1])+1);
            break;
            case 
                2: direccion = (parseInt(idCabeza[0])-1)+'-'+idCabeza[1];
            break;
            case 
                3: direccion = idCabeza[0]+'-'+(parseInt(idCabeza[1])-1);
            break;
            case 
                4: direccion = (parseInt(idCabeza[0])+1)+'-'+idCabeza[1];
            break;
        }

        this.serpienteActual.unshift(direccion); 
        if(idCabeza[0] === idManzana[0] && idCabeza[1] === idManzana[1]) {
            this.comerManzana(idManzana,cola);
        }
    }


    moverResultado() {
        if(this.comprobarGolpe()) {
            if(requestID) {
                window.cancelAnimationFrame(requestID);
            }
        } else { 
            this.despintarSerpiente();
            this.moverSerpiente();
            this.pintarSerpiente();
        }
    }

    comprobarGolpe() {
        let idCabeza = this.obtenerIds(this.serpienteActual[0]);

        if(this.chocarPared(idCabeza) || this.chocarSerpiente(idCabeza)) {
            return true;
        } else {
            return false;
        }
    }   
    
    chocarSerpiente(idCabeza) {
        let pasoPrimero = false;
        let serpiente = this.serpienteActual;
        let chocar = false;

        serpiente.forEach(e=>{            
            if(pasoPrimero) {
                let idSerpiente = this.obtenerIds(e);
                if(idCabeza[0] === idSerpiente[0] && idCabeza[1] === idSerpiente[1]) {
                    chocar = true;
                }
            }
            pasoPrimero = true;
        })
        return chocar;
    }

    chocarPared(idCabeza) {
        let id0 = parseInt(idCabeza[0]);
        let id1 = parseInt(idCabeza[1]);
        if(id1 >= 0 && id1 <= 29 && id0 >= 0 && id0 <= 29) {            
            return false;
        } else {
            return true;
        }
    }

    obtenerIds(id) {
        let ids = id.split('-');
        return ids;
    }

    manzanaAzar() {
        let x = Math.floor((Math.random() * (29 - 0 + 1)) + 0);
        let y = Math.floor((Math.random() * (29 - 0 + 1)) + 0);
        this.tablero[x][y].classList.add('manzana');
        this.manzana = x+'-'+y; 
    }

    comerManzana(id,cola) {
        this.tablero[id[0]][id[1]].classList.remove('manzana');
        this.serpienteActual.push(cola);
        this.manzanaAzar(); 
    }

    control(e){ 
        console.log(e.keyCode)
        if (e.keyCode === 39){
            this.direccion = 1 // derecha 
        } else if (e.keyCode === 38){ 
            this.direccion = 2 // arriba
        }else if (e.keyCode === 37){ 
            this.direccion = 3 // izquierda
        }else if (e.keyCode === 40){
            this.direccion = 4 // abajo
        } 
    } 

}

class Cuadrado {
    constructor(clase,id,) {
        this.clase = clase;
        this.id = id;
        this.elemento;
    }

    crearCuadrado() {
        const cuadrado = document.createElement('div');
        cuadrado.classList.add(this.clase);
        cuadrado.id = this.id;
        this.elemento = cuadrado;
        return cuadrado;
    }
}

var fotogramasPorSegundo = 5;
const btnIniciar = document.querySelector('.btn-iniciar');
let requestID;
const G = new Game();

btnIniciar.addEventListener('click', ()=> {
    G.iniciar()
    loop()
    btnIniciar.style.display = 'none';
    
});



function loop() {
    setTimeout(function() {
        requestID = window.requestAnimationFrame(loop);
        G.moverResultado();
    }, 1000 / fotogramasPorSegundo);
}