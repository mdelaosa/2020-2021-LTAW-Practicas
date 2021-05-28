//-- Cuadrados chat
const display = document.getElementById("display");
const mensaje = document.getElementById("mensaje");
const enviar = document.getElementById("enviar");

//-- Conexión con el server
const socket = io();

let escribiendo = false;

//-- Mensaje recibido
socket.on("message", (msg) =>{
    display.innerHTML += '<p>' + '> ' + msg + '</p>';
});

mensaje.oninput = () => {
    if (!escribiendo){
        socket.send("Otra maruja está escribiendo información...");
        escribiendo = true; 
    }
}

//-- Envío de mensaje al pulsar enviar
enviar.onclick = () => {
    if (mensaje.value){
        socket.send(mensaje.value);
        console.log("Mensaje enviado");
    }
    //-- Borrar mensaje
    mensaje.value = "";
}

