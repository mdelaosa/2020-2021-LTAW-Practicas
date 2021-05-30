console.log('Ejecutando cliente');

//-- Info + caja
const display = document.getElementById('display');
const caja = document.getElementById('caja');

//-- Búsqueda en caja
caja.oninput = () => {
    //-- Para peticiones AJAX
    const m = new XMLHttpRequest();
    m.onreadystatechange = () => {
        //-- Petición enviada y recibida
        if (m.readyState == 4){
            //-- Si OK
            if (m.status == 200){
                let productos = JSON.parse(m.responseText);
                console.log(productos);
                display.innerHTML = "";

                for (let i = 0; i < productos.length; i++) {
                    if (productos[i] == "Harry") {
                        display.innerHTML += '<a href="/harry">' + productos[i] + '</a>';
                    } else if (productos[i] == "Shawn") {
                        display.innerHTML += '<a href="/shawn">' + productos[i] + '</a>';
                    } else if (productos[i] == "ATL") {
                        display.innerHTML += '<a href="/atl">' + productos[i] + '</a>';
                    }
                    if (i < productos.length - 1) {
                        display.innerHTML += ', ';
                    }
                }
            }
        }else{
            //-- Si error
            console.log("Error en la petición: " + m.status + " " + m.statusText);
            display.innerHTML += '<p>ERROR</p>';
        }
    }
}

console.log(caja.value.length);

//-- Al menos 2 caracteres
if (caja.value.length >= 2) {
    m.open("GET","/productos?param1=" + caja.value, true);
    m.send();
    
} else {
    display.innerHTML="";
}