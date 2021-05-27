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
const FICH_JSON = "tienda.json";
const TIENDA_JSON = fs.readFileSync(FICH_JSON);
const tienda = JSON.parse(TIENDA_JSON);

let usuarios = tienda[0]['usuarios'];
let productos = tienda[1]['productos'];

//-- Formularios
const FORMULARIO = fs.readFileSync('form-pedido.html');
const FORMULARIO_ERROR = fs.readFileSync('form-pedido-error.html');
const LOGIN = fs.readFileSync('form-login.html');
const LOGIN_ERROR = fs.readFileSync('form-login-error.html');

//-- Coger la extensión
type_file = filename.split(".")[1]; 
filename = "." + filename;

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

  const mime_type = {
    'html' : 'text/html',
    'css'  : 'text/css',
    'png'  : 'image/png',
    'ico'  : 'image/x-icon'
  };
  
  let mime = mime_type[type_file];
  console.log("Nombre del fichero: " + filename + "\n" + "Tipo: " + type_file);
  
  //--PRODUCTOS
  let producto1 = PRODUCTO1;
  producto1 = producto1.replace("Nombre", tienda[1].productos[0]['nombre']);
  producto1 = producto1.replace("Descripción", tienda[1].productos[0]['descripcion']);
  producto1 = producto1.replace("Precio", tienda[1].productos[0]['precio']);
  producto1 = producto1.replace("Stock", tienda[1].productos[0]['stock']);
  
  let producto2 = PRODUCTO2;
  producto2 = producto2.replace("Nombre", tienda[1].productos[1]['nombre']);
  producto2 = producto2.replace("Descripción", tienda[1].productos[1]['descripcion']);
  producto2 = producto2.replace("Precio", tienda[1].productos[1]['precio']);
  producto2 = producto2.replace("Stock", tienda[1].productos[1]['stock']);
  
  let producto3 = PRODUCTO3;
  producto3 = producto3.replace("Nombre", tienda[1].productos[2]['nombre']);
  producto3 = producto3.replace("Descripción", tienda[1].productos[2]['descripcion']);
  producto3 = producto3.replace("Precio", tienda[1].productos[2]['precio']);
  producto3 = producto3.replace("Stock", tienda[1].productos[2]['stock']);

  //-- Lectura fichero
  fs.readFile(filename, function(err, data) {

    //-- Fichero no encontrado. Devolver mensaje de error
    if (err || (filename = "error.html")) {
      res.writeHead(404, {'Content-Type': mime});
      filename = "error.html"; 
      data = fs.readFileSync(filename);
    }else if(filename = "harry.html"){
      data = producto1;
    }else if(filename = "shawn.html"){
      data = producto2;
    }else if(filename = "atl.html"){
      data = producto3;
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