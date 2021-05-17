//-- Servidor de la tienda
const http = require('http');
const fs = require('fs');

//-- Puerto
const PUERTO = 8000

//-- Comprobación
console.log("Servidor arrancado");

//-- Creación del servidor. Mensaje de control en terminal
const server = http.createServer((req, res) => {
  console.log("- - Petición recibida - -\n");

  //-- Recurso URL
  const myURL = new URL(req.URL, 'http://' + req.headers['host']);

  //-- Recurso URL
  //let myURL = url.parse(req.url, true);
  console.log("Recurso solicitado:" + req.url)
  //console.log("Recurso recibido:" + myURL.pathname)

  //-- Fichero para la variable de peticióon
  let filename = "";
  //-- Fichero a devolver
  //-- http://localhost:8000/
  if (myURL.pathname == "/") 
    //-- Principal
    filename += "/tienda.html";  
  else{
    filename = myURL.pathname; 
  }

  //-- Coger la extensión
  type_file = filename.split(".")[1]; 
  filename = "." + filename; //-- Lectura del fichero desde "." incluido

  console.log("Nombre del fichero: " + filename + "\n" + "Tipo: " + type_file);

  //-- Lectura fichero
  fs.readFile(filename, function(err, data) {
    let mime = "text/html"
    //-- Fichero no encontrado. Devolver mensaje de error
    if ((err) || fich == "./error.html") {
      res.writeHead(404, {'Content-Type': mime});
      res.write("Not Found");
      res.end();
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