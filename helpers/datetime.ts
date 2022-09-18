export function obtenerFechaActual() {

  // Se debe mostrar solo los pedidos del dia actual
  var fecha = new Date(); //Fecha actual

  var mes: string | number = fecha.getMonth() + 1; //obteniendo mes
  var dia: string | number = fecha.getDate(); //obteniendo dia
  var anio = fecha.getFullYear(); //obteniendo año
  if (dia < 10)
    dia = '0' + dia; //agrega cero si el menor de 10
  if (mes < 10)
    mes = '0' + mes; //agrega cero si el menor de 10

  return `${anio}-${mes}-${dia}`;

}

export function obtenerHora() {

  const fecha = new Date();
  let hora = fecha.getHours();
  let minuto = fecha.getMinutes();
  let segundo = fecha.getSeconds();

  const horaCompleta = `${hora}:${minuto}:${segundo}`;

  return horaCompleta;
}

export function validarFecha(fecha: string) {


  // Validar que la fecha esté completa

  const campos = fecha.split("-");

  if (campos.length !== 3) {
    return false;
  }

  try {
    const anio = Number(campos[0]);
    const mes = Number(campos[1]);
    const dia = Number(campos[2]);

    if(isNaN(anio) || isNaN(mes) || isNaN(dia)){
      return false
    }


  } catch (error) {
    return false
  }









  // la fecha debe ser válida

  return true;

}