function calcular(tarjeta) {
   const sabor = Number(tarjeta.querySelector("select.sabor").value);
   const estadoDeCoccion = Number(tarjeta.querySelector("select.estado-de-coccion").value);
   const cantidad = Number(tarjeta.querySelector("input.cantidad").value);
   let porcion = 0;
   const campoPorcion = tarjeta.querySelector("select.porcion");
   if (campoPorcion) {
      porcion = Number(campoPorcion.value);
   }
   const total = (sabor + estadoDeCoccion + porcion) * cantidad;
   return total;
}

function mostrar(tarjeta) {
    const resultado = tarjeta.querySelector("span.resultado");
    const cantidad = Number(tarjeta.querySelector("input.cantidad").value);

    if (isNaN(cantidad) || cantidad < 10) {
        resultado.textContent = "Cantidad inválida";
        return;
    }

    resultado.textContent = "$" + calcular(tarjeta).toLocaleString("es-CO");
}

document.querySelectorAll(".productos").forEach(function(tarjeta) {
    mostrar(tarjeta);
    tarjeta.addEventListener("change", function() {
        mostrar(tarjeta);
    });
});