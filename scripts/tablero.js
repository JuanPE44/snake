class Game {

    constructor() {
        this.tableroSize = 25;
        this.serpienteActual = ['3-4','3-3','3-2'];  
        this.direccion = 1;
        this.tablero = []; 
        this.manzana;   
        this.puntaje = 0;
    }

    iniciar() {
        document.addEventListener('keydown',(e)=> this.control(e));
        this.pintarPuntaje();
        this.rellenarTablero();
        this.manzanaAzar();
        this.pintarMejorPuntaje();
    }

    reiniciar() {
        this.despintarSerpiente();
        this.serpienteActual = ['3-4','3-3','3-2']; 
        this.direccion = 1;
        this.puntaje = 0;
        this.pintarPuntaje();
    }

    rellenarTablero() {
        let tablero = [];
        const divTablero = document.querySelector('.tablero');
        const fragmento = document.createDocumentFragment();

        for(let i=0;i<this.tableroSize;i++) {
            tablero[i] = [];
        }

        for(let i=0;i<this.tableroSize;i++) {
            for(let j=0;j<this.tableroSize;j++) {
                const C = new Cuadrado('cuadrado',i.toString()+'-'+j.toString());
                let cuadrado = C.crearCuadrado();
                tablero[i][j] = cuadrado;
                fragmento.appendChild(cuadrado);
            }
        }
        this.tablero = tablero;  
        divTablero.appendChild(fragmento);              
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

    pintarPuntaje(){
        const puntaje = document.querySelector('.score');
        puntaje.innerHTML = `Score:${this.puntaje}`;
    }

    moverSerpiente() {
        let direccion;
        let cola = this.serpienteActual.pop()  
        let idCabeza = this.obtenerIds(this.serpienteActual[0]);
        let idManzana = this.obtenerIds(this.manzana);  
        
        switch(this.direccion) {
            case 1: direccion = idCabeza[0]+'-'+(parseInt(idCabeza[1])+1);
            break;
            case 2: direccion = (parseInt(idCabeza[0])-1)+'-'+idCabeza[1];
            break;
            case 3: direccion = idCabeza[0]+'-'+(parseInt(idCabeza[1])-1);
            break;
            case 4: direccion = (parseInt(idCabeza[0])+1)+'-'+idCabeza[1];
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
            document.querySelector('.btn-reiniciar').style.display = 'flex';
            this.actualizarPuntos();
            this.pintarMejorPuntaje();
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
        if(id1 > 0 && id1 < this.tableroSize-1 && id0 > 0 && id0 < this.tableroSize-1) {            
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
        let x = Math.floor(Math.random() * (((this.tableroSize-2)+1) - 1) + 1);
        let y = Math.floor(Math.random() * (((this.tableroSize-2)+1) - 1) + 1);
        this.tablero[x][y].classList.add('manzana');
        this.manzana = x+'-'+y; 
    }

    comerManzana(id,cola) {
        this.tablero[id[0]][id[1]].classList.remove('manzana');
        this.serpienteActual.push(cola);
        this.puntaje++;
        this.pintarPuntaje();
        this.manzanaAzar(); 
    }

    actualizarPuntos() {
        let puntos = JSON.parse(localStorage.getItem('puntos'));
        puntos.push(this.puntaje);
        localStorage.setItem('puntos', JSON.stringify(puntos));
    }

    pintarMejorPuntaje() {
        let puntos = JSON.parse(localStorage.getItem('puntos'));
        let max = 0;
        puntos.forEach(p => {
            if(p>max) {
                max = p;
            }
        })
        document.querySelector('.high-score').innerHTML = `Highscore:${max}`;
    }

    control(e){ 
        switch(e.keyCode) {
            case 39: this.direccion !== 3 ? this.direccion = 1 : ''; // derecha 
            break;
            case 38: this.direccion !== 4 ? this.direccion = 2 : ''; // arriba
            break;
            case 37: this.direccion !== 1 ? this.direccion = 3 : ''; // izquierda
            break;
            case 40: this.direccion !== 2 ? this.direccion = 4 : ''; // abajo
        }
    } 
}