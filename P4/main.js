const http = require('http');
const express = require('express');
const socket = require('socket.io');
const colors = require('colors');
const electron = require('electron');
const ip = require('ip');

const PUERTO = 9000;

const commandos = 'Los comandos disponibles son: /help, /list, /hello y /date';
const welcome = '-- TODA LA INFORMACIÓN ESCRITA EN ESTE CHAT SERÁ CONFIDENCIAL -- <br>  > Has llegado al servidor perfecto para mamarrachear';
const bye = '¡Adiós!';
const hello = '¡Holi! Esperamos que tengas información que contar';
const usuario = 'Alguien nuevo quiere cotillear';

//-- Server
const app = express();
const server = http.Server(app);
const io = socket(server);

let connect_count = 0;

//-- Para acceder a la ventana principañ
let win = null;

//-- Entrada web
app.get('/', (req, res) => {
    res.send(__dirname + '/public/chat.html');
    console.log('Accediento a' + __dirname + '/public/chat.html');
});

app.use('/', express.static(__dirname +'/'));

//-- Directorio público 
app.use(express.static('public'));

//-- Websockets
io.on('connection', (socket) => {
  
    //-- Nuevo usuario  
    console.log('-- ¡ALERTA! NUEVA MARUJA --'.pink);
    connect_count += 1;
    win.webContents.send('users', connect_count);
    socket.send(welcome);
    io.send(usuario);
    //-- socket.broadcast.emit('message', usuario);

    //-- Desconexión
    socket.on('disconnect', function(){
      console.log('-- FIN CONEXIÓN --'.pink);
      //-- socket.broadcast.emit('message', bye);
      connect_count -= 1;
      win.webContents.send('message', bye);
    });  

  //-- Mensaje a todos los usuarios
  socket.on("message", (msg)=> {
    console.log('Mensaje: ' + msg.yellow);

    const date = new Date(Date.now());

    win.webContents.send('message', msg); 
    
    if (msg.startsWith('/')) {
      console.log('Comandos'.blue);
      switch(msg){
        case '/help':
          console.log('Lista de comandos'.blue);
          socket.send(commandos);
          break;
        case '/list':
          console.log('Lista de usuarios'.blue);
          socket.send('Hay un total de ' + connect_count + ' marujas en la ciudad.');
          break;
        case '/hello':
          console.log('Holi'.blue);
          socket.send(hello);
          break;
        case '/date':
          console.log('Fecha'.blue);
          socket.send(date);
          break;
        default:
          console.log('Not Found'.blue);
          socket.send('404 Not Found. Comando no reconocido, prueba de nuevo. Los comandos están en /help');
          break;
      }
    } else {
      io.send(msg);
    }; 
  });
});

//-- Lanzar el server
server.listen(PUERTO);
console.log('Escuchando en puerto: ' + PUERTO);

//-- ELECTRON
electron.app.on('ready', () => {
  console.log("Evento Ready!");

  //-- Crear la ventana principal de nuestra aplicación
  win = new electron.BrowserWindow({
      width: 800,   //-- Anchura 
      height: 800,  //-- Altura

      //-- ACCESO AL SISTEMA
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false
      }
  });
    //-- Quitar menú por defecto
    win.setMenuBarVisibility(false)

    //-- Cargar interfaz gráfica en HTML
    let interfaz = "index.html"
    win.loadFile(interfaz);

    win.on('ready-to-show', () => {
      win.webContents.send('ip', 'http://' + ip.address() + ':' + PUERTO);
    });
  });

  //-- Esperar a recibir los mensajes de botón apretado (Test) del proceso de 
//-- renderizado. Al recibirlos se escribe una cadena en la consola
electron.ipcMain.handle('test', (event, msg) => {
  console.log("-> Mensaje: " + msg);
  //-- Enviar mensaje de prueba
  io.send(msg);
  win.webContents.send('msg', msg);

});
