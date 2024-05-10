class Persona{
    id;
    nombre;
    apellido;
    fechaNacimiento;

    constructor(id,nombre,apellido,fechaNacimiento){
        this.id=id;
        this.setNombre(nombre);
        this.setApellido(apellido);
        this.setFechaNacimiento(fechaNacimiento);
    }

    setNombre(nombre){
        if(typeof nombre === "string" && nombre !== ""){
            this.nombre = nombre;
        }
        else{
            throw new Error("Error. No estas agregando un nombre correcto")
        }
    }

    setApellido(apellido){
        if(typeof apellido === "string" && apellido !== ""){
            this.apellido = apellido;
        }
        else{
            throw new Error("Error. No estas agregando un apellido correcto")
        }
    }

    setFechaNacimiento(fechaNacimiento) {
        let fechaNacimientoSet = fechaNacimiento;
        if (!Number.isInteger(fechaNacimientoSet)) {
            fechaNacimientoSet = parseInt(fechaNacimientoSet);
        }
        if (!isNaN(fechaNacimientoSet) && typeof fechaNacimientoSet === 'number' && fechaNacimientoSet >= 10000000 && fechaNacimientoSet <= 99991231) {
            this.fechaNacimiento = fechaNacimientoSet;
        } else {
            throw new Error("Error: La fecha de nacimiento debe ser un número entero con formato AAAAMMDD.");
        }
    }
    
    
    

    toString() {
    let string = "Id: " + this.id.toString() + "\n";
    string += "Nombre: " + this.nombre + "\n";
    string += "Apellido: " + this.apellido + "\n";
    string += "Fecha de nacimiento: " + this.fechaNacimiento.toString();
    return string;
    }

}

class Ciudadano extends Persona{
    dni

    constructor(id, nombre, apellido, fechaNacimiento, dni) {
        super(id, nombre, apellido, fechaNacimiento);
        this.setDni(dni);

    }

    setDni(dni){
        let dniSet = dni;
        if(!Number.isInteger(dniSet)){
            dniSet = parseInt(dniSet);
        }

        if(!isNaN(dniSet) && dniSet > 0){
            this.dni = dni;
        }else{
            throw new Error("Error. El numero es menor a 0, no puedes");
        }
    }

    toString() {
        let mensaje = super.toString();
        mensaje += "\nDni: " + this.dni.toString() + "\n";
        return mensaje;
    }
    
}

class Extranjero extends Persona{
    paisOrigen

    constructor(id, nombre, apellido, fechaNacimiento, paisOrigen) {
        super(id, nombre, apellido, fechaNacimiento);
        this.setPaisOrigen(paisOrigen);
    }

    setPaisOrigen(paisOrigen){
        if(typeof paisOrigen === "string" && paisOrigen !== ""){
            this.paisOrigen = paisOrigen;
        }
        else{
            throw new Error("Error. No estas agregando un pais correcto")
        }
        
    }
    toString() {
        let mensaje = super.toString();
        mensaje += "\nPais de origen: " + this.paisOrigen + "\n";
        return mensaje;
    }
    
}


let dataJSON = '[{"id":1,"apellido":"Serrano","nombre":"Horacio","fechaNacimiento":19840103,"dni":45876942},{"id":2,"apellido":"Casas","nombre":"Julian","fechaNacimiento":19990723,"dni":98536214},{"id":3,"apellido":"Galeano","nombre":"Julieta","fechaNacimiento":20081103,"dni":74859612},{"id":4,"apellido":"Molina","nombre":"Juana","fechaNacimiento":19681201,"paisOrigen":"Paraguay"},{"id":5,"apellido":"Barrichello","nombre":"Rubens","fechaNacimiento":19720523,"paisOrigen":"Brazil"},{"id":666,"apellido":"Hkkinen","nombre":"Mika","fechaNacimiento":19680928,"paisOrigen":"Finlandia"}]';

let data_parsed = JSON.parse(dataJSON);

let personas = []; 

let nuevaPersona;

let claves = ["id", "apellido", "nombre", "fechaNacimiento", "dni","paisOrigen"];

let personasMap = new Map();


for (let dato of data_parsed)
{
    if (dato.dni)
    {
        nuevaPersona = new Ciudadano(dato.id, dato.nombre, dato.apellido, dato.fechaNacimiento, dato.dni);   
    }
    else if (dato.paisOrigen)
    {
        nuevaPersona = new Extranjero(dato.id, dato.nombre, dato.apellido, dato.fechaNacimiento, dato.paisOrigen);
    }
    personas.push(nuevaPersona);
    

    personasMap.set(dato.id, nuevaPersona);
}




function vaciar(elemento)
{
    while (elemento.firstChild) {
        elemento.removeChild(elemento.firstChild);
    }
}

function MostrarPersonas(personas) {
    row_index = 1;

    const tabla_personas_body = document.getElementById("t-user-body");
    vaciar(tabla_personas_body);
    let text_col;
    let col;
    let txt_col_node;
    let row;
    for (let persona of personas) {
        row = document.createElement("tr");

        for (let clave of claves) {
            if(persona[clave] !== undefined)
            {
                text_col = persona[clave];
            }else{
                text_col = "-"
            }
            txt_col_node = document.createTextNode(text_col);
            col = document.createElement("td");
            col.appendChild(txt_col_node);
            row.appendChild(col);
        }
        
        row.addEventListener("dblclick", () => { MostrarModificarEliminar(persona) });
        tabla_personas_body.appendChild(row);
        row_index += 1;
    }
}

function FiltrarPersonas(tipo, personas)
{
    if (tipo == "todos"){
        personas_filtrados = personas;
    }
    else if (tipo == "ciudadano")
    {
        personas_filtrados = personas.filter((persona) => persona instanceof Ciudadano);
    }
    else if (tipo == "extranjero")
    {
        personas_filtrados = personas.filter((persona) => persona instanceof Extranjero);
    }
    return personas_filtrados;
}

function CalcularPromedio(personas, clave) {
    let promedio;
    let suma_fechas = personas.reduce((acumulador, persona) => acumulador + parseInt(persona[clave].toString().substring(0, 4)), 0);
    const cantidad_personas = personas.length;
    if (cantidad_personas > 0)
        promedio = suma_fechas / cantidad_personas;
    else
        promedio = 0;
    return promedio;
}

function MostrarAgregar() {
    const formulario_datos = document.getElementById("form-datos");
    const formulario_agregar = document.getElementById("form-agregar");

    formulario_datos.hidden = true;
    formulario_agregar.hidden = false;

    const btn_modificar = document.getElementById("btn-modificar");
    const btn_eliminar = document.getElementById("btn-eliminar");
    const btn_agregar = document.getElementById("btn-agregar");

    const div_id = document.getElementById("div-id");
    const select_tipo = document.getElementById("select-tipo");

    document.getElementById("txt-id").value = "";
    document.getElementById("txt-nombre").value = "";
    document.getElementById("txt-apellido").value = "";
    document.getElementById("txt-fechaNacimiento").value = "";
    document.getElementById("txt-dni").value = "";
    document.getElementById("txt-paisOrigen").value = "";

    select_tipo.disabled = false;
    btn_agregar.hidden = false;
    div_id.hidden = true;
    btn_modificar.hidden = true;
    btn_eliminar.hidden = true;

    SetTipo(select_tipo.value);
}


function Agregar()
{
    try
    {
        let nuevoPersona;
        const nombre = document.getElementById("txt-nombre").value;
        const apellido = document.getElementById("txt-apellido").value;
        const fechaNacimiento = document.getElementById("txt-fechaNacimiento").value;
        const dni = document.getElementById("txt-dni").value
        const paisOrigen = document.getElementById("txt-paisOrigen").value
        const tipo = document.getElementById("select-tipo").value;
        let id = ObtenerProximoId(personas);

        if (tipo == "ciudadano")
        {
            nuevoPersona = new Ciudadano(id, nombre, apellido, fechaNacimiento, dni);
        }
        else
        {
            nuevoPersona = new Extranjero(id, nombre, apellido, fechaNacimiento, paisOrigen);
        }
        personas.push(nuevoPersona);
        ActualizarTabla();
        MostrarDatos();
        mensaje = "La persona se ha agregado correctamente";
    }
    catch(error)
    {
        mensaje = "Error: " + error.message;
    }

    alert(mensaje);
}

function Modificar(persona)
{
    try
    {
        const nombre = document.getElementById("txt-nombre").value;
        const apellido = document.getElementById("txt-apellido").value;
        const fechaNacimiento = document.getElementById("txt-fechaNacimiento").value;
        const dni = document.getElementById("txt-dni").value
        const paisOrigen = document.getElementById("txt-paisOrigen").value

        nombrePersona = persona.nombre;
        persona.setNombre(nombre);
        persona.setApellido(apellido);
        persona.setFechaNacimiento(fechaNacimiento);
        if (persona instanceof Ciudadano)
        {
            persona.setDni(dni)

        }
        else if(persona instanceof Extranjero)
        {
            persona.setPaisOrigen(paisOrigen)
            
        }

        ActualizarTabla();
        MostrarDatos();
        mensaje = "La persona se ha modificado correctamente";
    }
    catch(error)
    {
        mensaje = "Error: " + error.message;
    }

    alert(mensaje);
}


function Eliminar(persona)
{
    mensaje = "Se ha eliminado la persona de nombre: " + persona.nombre;
    personas = personas.filter(objeto => objeto !== persona);
    ActualizarTabla();
    MostrarDatos();

    alert(mensaje);
}

function EliminarTodosLosEventos(elemento) {
    const copiaElemento = elemento.cloneNode(true);
    elemento.parentNode.replaceChild(copiaElemento, elemento);
    return copiaElemento;
}

function MostrarModificarEliminar(persona) {
    const formulario_datos = document.getElementById("form-datos");
    const formulario_agregar = document.getElementById("form-agregar");
    formulario_datos.hidden = true;
    formulario_agregar.hidden = false;

    const txt_id = document.getElementById("txt-id");
    const txt_nombre = document.getElementById("txt-nombre");
    const txt_apellido = document.getElementById("txt-apellido");
    const txt_fechaNacimiento = document.getElementById("txt-fechaNacimiento");
    const txt_dni = document.getElementById("txt-dni");
    const txt_paisOrigen = document.getElementById("txt-paisOrigen");
    const select_tipo = document.getElementById("select-tipo");

    txt_id.value = persona.id;
    txt_nombre.value = persona.nombre;
    txt_apellido.value = persona.apellido;
    txt_fechaNacimiento.value = persona.fechaNacimiento;
    let tipo;
    if (persona instanceof Ciudadano) {
        tipo = "ciudadano";
        txt_dni.value = persona.dni;
        txt_paisOrigen.value = ""; 
    } else if (persona instanceof Extranjero) {
        tipo = "extranjero";
        txt_paisOrigen.value = persona.paisOrigen; 
        txt_dni.value = ""; 
    }
    select_tipo.value = tipo;
    select_tipo.disabled = true;
    SetTipo(tipo);

    let btn_modificar = document.getElementById("btn-modificar");
    let btn_eliminar = document.getElementById("btn-eliminar");
    const btn_agregar = document.getElementById("btn-agregar");

    btn_modificar = EliminarTodosLosEventos(btn_modificar);
    btn_eliminar = EliminarTodosLosEventos(btn_eliminar);

    const div_id = document.getElementById("div-id");

    div_id.hidden = false;
    btn_modificar.hidden = false;
    btn_eliminar.hidden = false;

    btn_agregar.hidden = true;

    btn_modificar.addEventListener("click", (e) => {
        e.preventDefault();
        Modificar(persona);
    });

    btn_eliminar.addEventListener("click", (e) => {
        e.preventDefault();
        Eliminar(persona);
    });
}


function MostrarDatos()
{
    const formulario_datos = document.getElementById("form-datos");
    const formulario_agregar = document.getElementById("form-agregar");
    formulario_datos.hidden = false;
    formulario_agregar.hidden = true;
}

function ObtenerProximoId(personasMap) {
    let maxId = 0;
    for (let id of personasMap.keys()) {
        if (id > maxId) {
            maxId = id;
        }
    }
    return maxId + 1;
}

function ActualizarTabla()
{
    const select_filtro = document.getElementById("select-filtro");
    let personas_filtrados = FiltrarPersonas(select_filtro.value,personas);
    MostrarPersonas(personas_filtrados, personas);
}

// Función para mostrar una columna específica por índice
function MostrarColumna(indiceColumna) {
    const tabla = document.getElementById("table-datos");
    const filas = tabla.getElementsByTagName("tr");
    
    for (let i = 0; i < filas.length; i++) {
    const celdas = filas[i].querySelectorAll("td, th");
    if (celdas.length > indiceColumna) {
        celdas[indiceColumna].style.display = "";
    }
    }
}


function OcultarColumna(indiceColumna) {
    const tabla = document.getElementById("table-datos");
    const filas = tabla.getElementsByTagName("tr");
    
    for (let i = 0; i < filas.length; i++) {
    const celdas = filas[i].querySelectorAll("td, th");
    if (celdas.length > indiceColumna) {
        celdas[indiceColumna].style.display = "none";
    }
    }
}

function SetTipo(tipo)
{
    const input_dni = document.getElementById("div-dni");
    const input_paisOrigen = document.getElementById("div-paisOrigen");
    if (tipo == "ciudadano")
    {
        
        input_dni.hidden = false;
        input_paisOrigen.hidden = true;
    }
    else
    {
        input_dni.hidden = true;
        input_paisOrigen.hidden = false;
    }
}


window.addEventListener("load", () => {
ActualizarTabla();
});

const select_filtro = document.getElementById("select-filtro");
select_filtro.addEventListener("change", (e)=>{
    ActualizarTabla();
});

const btn_calcular = document.getElementById("btn_calcular");
btn_calcular.addEventListener("click", (e) => {
    e.preventDefault();
    const txt_promedio = document.getElementById("txtPromedio");
    const tipo_filtro = document.getElementById("select-filtro").value;
    const personas_filtrados = FiltrarPersonas(tipo_filtro, personas);
    txt_promedio.value = CalcularPromedio(personas_filtrados, "fechaNacimiento").toFixed(2);
});

const btn_mostrar_agregar = document.getElementById("btn-mostrar-agregar");
btn_mostrar_agregar.addEventListener("click", (e) => {
    e.preventDefault();
    MostrarAgregar();
});

const formulario_datos = document.getElementById("form-datos");

const btn_cancelar = document.getElementById("btn-cancelar");
btn_cancelar.addEventListener("click", (e) => {
    e.preventDefault();
    MostrarDatos();
});

const btn_agregar = document.getElementById("btn-agregar");
btn_agregar.addEventListener("click", (e) => {
    e.preventDefault();
    Agregar();
});


let t_head;
for (let clave of claves)
{
    t_head = document.getElementById("t-head-" + clave);
    t_head.addEventListener("click", () => {
        personas.sort((a, b) => a[clave] - b[clave]);
        ActualizarTabla();
    });
}


for (let i = 0; i < claves.length; i++)
{
    let clave = claves[i];
    let checkbox = document.getElementById(clave + "Check");
    checkbox.checked = true;
    checkbox.addEventListener("change", function() {
        if (this.checked) {
            MostrarColumna(i);
        } else {
            OcultarColumna(i);
        }
    });
}


const select_tipo = document.getElementById("select-tipo");
select_tipo.addEventListener("change", (e)=>{SetTipo(select_tipo.value)});