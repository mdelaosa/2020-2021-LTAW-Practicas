const electron = require('electron');

console.log("Hola desde el proceso de la web...");

//-- Obtener elementos de la interfaz
const btn_test = document.getElementById("btn_test");
const display = document.getElementById("display");
const info1 = document.getElementById("info1");
const info2 = document.getElementById("info2");
const info3 = document.getElementById("info3");
const info4 = document.getElementById("info4");
const info5 = document.getElementById("info5");
const connect_count = document.getElementById("connect_count");

//-- Acceder a la API de node para obtener la info
//-- Sólo es posible si nos han dado permisos desde
//-- el proceso princpal
info1.textContent = process.versions.node;
info2.textContent = process.versions.electron;
info3.textContent = process.versions.chrome;
info4.textContent = process.cwd();
connect_count.innerHTML = 0;

electron.ipcRenderer.on('ip', (event, msg) => {
    console.log("Recibido: " + msg);
    info5.textContent = msg;
});

btn_test.onclick = () => {
    display.innerHTML += "TEST: Probando, 1, 2, 3... <br>";
    console.log("Botón apretado!");
    //-- Enviar mensaje al proceso principal
    electron.ipcRenderer.invoke('test', "Probando, 1, 2, 3...");
}

//-- Mensaje recibido del proceso MAIN
electron.ipcRenderer.on('print', (event, msg) => {
    console.log("Recibido: " + msg);
    display.textContent = msg;
    display.innerHTML += msg + "<br>";
});

electron.ipcRenderer.on('connect_count', (event, msg) => {
    console.log("Recibido: " + msg);
    connect_count.textContent = msg;
});