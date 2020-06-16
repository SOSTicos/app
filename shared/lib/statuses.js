export const estados = [
    'Pending',
    'Rechazado',
    'Aceptado',
    'Crítico'
];

  export default estados
  
  export const isStatus = (estado) => {
    return Boolean(estados[estado])
  }
  