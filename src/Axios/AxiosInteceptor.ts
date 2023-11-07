
import axios from 'axios';
// Define el interceptor
axios.interceptors.request.use((config) => {
  // obtiene los datos del local storage
  const cadena = localStorage.getItem('token');
  const storedGlobal = (cadena !== null) ? cadena : null;

  // agrega el header de autorización si hay datos almacenados en el local storage
  if (storedGlobal) {
    config.headers.Authorization = `Bearer ${storedGlobal}`;
  }
  console.log('interceptado')
  return config;
});



// Ejemplo de uso de axios con el interceptor configurado
//axios.get('https://api.ejemplo.com/recurso')
// .then((response) => {
// Procesa la respuesta
// console.log(response.data);
// })
// .catch((error) => {
// Maneja los errores
//console.error(error);
// });
