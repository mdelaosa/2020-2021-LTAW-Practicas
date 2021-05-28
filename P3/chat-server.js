const http = require('http');
const express = require('express');
const socket = require('socket.io');
const colors = require('colors');

const PUERTO = 9000;

const commandos = "Los comandos disponibles son: /help, /list, /hello y /date";
const welcome = "Has llegado al servidor perfecto para marujear";
const bye = "¡Adiós!";
const hello = "¡Holi! Esperamos que tengas información que contar";
const usuario = "Alguien nuevo quiere cotillear";

//-- Server
const app = express();
const server = http.Server(app);
const io = socket(server);

let connect_count = 0;

//-- Entrada web
app.get('/', (req, res) => {
  res.send('Acabas de entrar en la ciudad que no duerme pero está disponible <p><a href="/index.html">aquí</a></p>');
});

app.use('/', express.static(__dirname +'/'));

//-- Directorio público 
app.use(express.static('public'));

//-- Websockets
io.on('connection', (socket) => {
  
  //-- Nuevo usuario  
  console.log('-- ¡ALERTA! NUEVA MARUJA --'.pink);
  connect_count += 1;
  socket.send(welcome);
  socket.broadcast.emit('message', usuario);

  //-- Desconexión
  socket.on('disconnect', function(){
    console.log('-- FIN CONEXIÓN --'.pink);
    socket.broadcast.emit('message', bye);
    connect_count -= 1;
  });  

  //-- Mensaje a todos los usuarios
  socket.on("message", (msg)=> {
    console.log("Mensaje: " + msg.yellow);

    const date = new Date(Date.now());

    if (msg.startsWith('/')) {
      console.log("Comandos".blue);
      switch(msg){
        case '/help':
          console.log("Lista de comandos".blue);
          msg = commandos;
          socket.send(msg);
          break;
        case '/list':
          console.log("Lista de usuarios".blue);
          msg = connect_count;
          socket.send("Hay un total de " + msg + " marujas en la ciudad.");
          break;
        case '/hello':
          console.log("Holi".blue);
          msg = hello;
          socket.send(msg);
          break;
        case '/date':
          console.log("Fecha".blue);
          msg = date;
          socket.send(msg);
          break;
        default:
          console.log("Not Found".blue);
          msg = "404 Not Found. Comando no reconocido, prueba de nuevo. Los comandos están en /help";
          socket.send(msg);
          break;
      }
    } else {
      io.send(msg);
    }; 
  });
});

//-- Lanzar el server
server.listen(PUERTO);
console.log("Escuchando en puerto: " + PUERTO);