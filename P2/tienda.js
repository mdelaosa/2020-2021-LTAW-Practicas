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

let productos = tienda[0]['productos'];
let usuarios = tienda[1]['usuarios'];

//-- Formularios
const FORMULARIO = fs.readFileSync('form-pedido.html');
const FORMULARIO_ERROR = fs.readFileSync('form-pedido-error.html');
const LOGIN = fs.readFileSync('form-login.html');
const LOGIN_ERROR = fs.readFileSync('login-error.html');
const LOGIN_CORRECTO = fs.readFileSync('login-correcto.html');

let contenido; 

//-- Registros en la web
let registrados = [];
console.log('Usuarios registrados:');
usuarios.forEach((element, index) => {
  registrados.push(element.usuario);
  console.log("User " + (index + 1) + '- ' + element.usuario);
});

//-- Disponibilidad
let lista =[];
let disponibles =[];
console.log("Productos Disponibles");
tienda[0]["productos"].forEach((element, index) => {
  console.log("Nombre" + (index + 1) + ": " + element.nombre + ", Precio:" + element.precio + ", Stock:" + element.stock);
  disponibles.push([element.nombre, element.precio, element.stock]);
  lista.push(element.nombre);
});

//-- COOKIES
//-- Producto 
var pro;
function productPage(pro, contenido) {
  contenido = contenido.replace('nombre', disponibles[pro][0]);
  contenido = contenido.replace('precio', disponibles[pro][1]);
  contenido = contenido.replace('stock', disponibles[pro][2]);
  return contenido;
}

//-- Usuario
function getUser(req) {
  const cookie = req.headers.cookie;
  if (cookie) {
      let pares = cookie.split(';');
      pares.forEach((element) => {
          let [nombre, valor] = element.split('=');
          if (nombre.trim() === 'usuario'){
            usuario = valor;
          }
      });
      return usuario || null;
  }
}

//-- Añadir a carrito
function addCart(req, res, producto) {
  const cookie = req.headers.cookie;
  if (cookie) {
    let pares = cookie.split(';');
    pares.forEach((element) => {
      let [nombre, valor] = element.split('=');
      if (nombre.trim() === 'carrito'){
        res.setHeader('Set-Cookie', element + '- ' + producto);
      }
    });
  }
}

//-- Carrito
function Cart(req) {
  const cookie = req.headers.cookie;
  if (cookie) {
    let pares = cookie.split(';');
    let carrito;
    let harry = '';
    let harry_stock = 0;
    let shawn = '';
    let shawn_stock = 0;
    let atl = '';
    let atl_stock = 0;

    pares.forEach((element) => {
      let [nombre, valor] = element.split('=');
      if (nombre.trim() === 'carrito'){
        productos = vale.split(':');
        productos.forEach((producto) => {
          if(producto == 'harry'){
            if (harry_stock == 0){
              harry = disponibles[0][0];
            }
            harry_stock += 1;
          } else if(producto == 'shawn'){
            if (shawn_stock == 0){
              shawn = disponibles[1][0];
            }
            shawn_stock += 1;
          } else if(producto == 'atl'){
            if (atl_stock == 0){
              atl = disponibles[2][0];
            }
            atl_stock += 1;
          }
        });
        carrito = harry + ' - ' + harry_stock + ', ' + shawn + ' - ' + shawn_stock + ', ' + atl + ' - ' + atl_stock;
      }
    });
    return carrito || null;
  }
}

//-- SERVIDOR
//-- Comprobación
console.log("Servidor arrancado");

//-- Creación del servidor. Mensaje de control en terminal
const server = http.createServer((req, res) => {
  console.log("- - Petición recibida - -\n");
  //-- Fichero para la variable de peticion
  let filename = "";
  //-- Recurso URL
  let myURL = new URL(req.url, 'http://' + req.headers['host']);
  console.log("Recurso solicitado:" + myURL.pathname)

  let nombre = myURL.searchParams.get('usuario');
  let password = myURL.searchParams.get('tarjeta');
  let direccion = myURL.searchParams.get('direccion');
  let producto = myURL.searchParams.get('producto');

  let param;

  //-- Coger la extensión
  type_file = filename.split(".")[1]; 
  filename = "." + filename;

  const mime_type = {
    'html' : 'text/html',
    'css'  : 'text/css',
    'png'  : 'image/png',
    'ico'  : 'image/x-icon'
  };
  
  let mime = mime_type[type_file];
  //-- console.log("Nombre del fichero: " + filename + "\n" + "Tipo: " + type_file);

  let user = getUser(req);

  //-- Fichero a devolver
  //-- http://localhost:9000/
  if ((myURL.pathname == '/') || (myURL.pathname == '/login')){ 
    if (user){
      contenido = MAIN; 
    } else{
      contenido = LOGIN;
    }
    //-- filename += "/tienda.html"; 
  } else if (myURL.pathname == '/procesar') {
    if (registrados.includes(nombre)){
      res.setHeader('Set-Cookie', "user =" + nombre);
      contenido = LOGIN_CORRECTO;
      console.log('- Usuario registrado -');
    } else{
      contenido = LOGIN_ERROR;
    }
  } else if (myURL.pathname == '/comprar'){
    contenido = CARRITO.replace('PRODUCTOS', productos);
  } else if (myURL.parthname == '/finalizar'){
    contenido = FORMULARIO;
  } else if (myURL.pathname == '/producto1') {
    contenido = PRODUCTO1;
    for(i=0; i<4; i++) {
      contenido = contenido.replace("Nombre", tienda[0].productos[0]['nombre']);
      contenido = contenido.replace("Precio", tienda[0].productos[0]['precio']);
      contenido = contenido.replace("Stock", tienda[0].productos[0]['stock']);
    }
  } else if (myURL.pathname == '/producto2') {
    contenido = PRODUCTO2;
    for(i=0; i<4; i++) {
      contenido = contenido.replace("Nombre", tienda[0].productos[1]['nombre']);
      contenido = contenido.replace("Precio", tienda[0].productos[1]['precio']);
      contenido = contenido.replace("Stock", tienda[0].productos[1]['stock']);
    }
  } else if (myURL.pathname == '/producto3') {
    contenido = PRODUCTO3;
    for(i=0; i<4; i++) {
      contenido = contenido.replace("Nombre", tienda[0].productos[2]['nombre']);
      contenido = contenido.replace("Precio", tienda[0].productos[2]['precio']);
      contenido = contenido.replace("Stock", tienda[0].productos[2]['stock']);
    }
  }
  
  //-- Lectura fichero
  fs.readFile(filename, function(err, data) {

    //-- Fichero no encontrado. Devolver mensaje de error
    if (err || (myURL.pathname == "/error.html")) {
      res.writeHead(404, {'Content-Type': mime});
      filename = "error.html"; 
      data = fs.readFileSync(filename);
    }else if(myURL.pathname == "/harry.html"){
      data = producto1;
    }else if(myURL.pathname == "/shawn.html"){
      data = producto2;
    }else if(myURL.pathname == "/atl.html"){
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