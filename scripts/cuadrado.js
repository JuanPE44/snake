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
