//-- Servidor de la tienda
const http = require('http');
const fs = require('fs');
const url = require('url');

//-- Puerto
const PUERTO = 9000

//-- Principal y error
const MAIN = fs.readFileSync('tienda.html');
const ERROR = fs.readFileSync('error.html');

//-- Productos y carrito
const PRODUCTO1 = fs.readFileSync('harry.html','utf-8');
const PRODUCTO2 = fs.readFileSync('shawn.html','utf-8');
const PRODUCTO3 = fs.readFileSync('atl.html','utf-8');
const CARRITO = fs.readFileSync('carrito.html','utf-8');

//-- Registo json + estructura de tienda
//const FICH_JSON = "tienda.json";
//const TIENDA_JSON = fs.readFileSync(FICH_JSON);
//const TIENDA = JSON.parse(TIENDA_JSON);

//-- Formularios
const FORMULARIO = fs.readFileSync('form-pedido.html');
const FORMULARIO_ERROR = fs.readFileSync('form-pedido-error.html');
const LOGIN = fs.readFileSync('form-login.html');
const LOGIN_ERROR = fs.readFileSync('form-login-error.html');



//-- Comprobación
console.log("Servidor arrancado");

//-- Creación del servidor. Mensaje de control en terminal
const server = http.createServer((req, res) => {
  console.log("- - Petición recibida - -\n");

  //-- Recurso URL
  let myURL = url.parse(req.url, true);
  console.log("Recurso solicitado:" + myURL.pathname)

  //-- Fichero para la variable de peticion
  let filename = "";
  //-- Fichero a devolver
  //-- http://localhost:9000/
  if (myURL.pathname == "/"){ 
    //-- Principal
    filename += "/tienda.html";  
  }else{
    filename += myURL.pathname; 
  }

  //-- Coger la extensión
  type_file = filename.split(".")[1]; 
  filename = "." + filename;

  console.log("Nombre del fichero: " + filename + "\n" + "Tipo: " + type_file);

  //-- Lectura fichero
  fs.readFile(filename, function(err, data) {
    const mime_type = {
      'html' : 'text/html',
      'css'  : 'text/css',
      'png'  : 'image/png',
      'ico'  : 'image/x-icon'
    };
    let mime = mime_type[type_file];
    //-- Fichero no encontrado. Devolver mensaje de error
    if (err) {
      res.writeHead(404, {'Content-Type': mime});
      //-- filename = "error.html"; 
      //-- data = fs.readFileSync(filename);
    }else{
      //-- Si no da error: 200 OK
      res.writeHead(200, {'Content-Type': mime});
    }
    res.write(data);
    res.end();
  });

});
server.listen(PUERTO);

console.log("Servidor corriendo...")
console.log("Puerto: " + PUERTO)