// Note: Do NOT modify this array! Order sensitive!
export const estados = ['Pendiente', 'Rechazado', 'Aceptado', 'Crítico', 'Finalizado']

export default estados

export const isStatus = (estado) => {
  return Boolean(estados[estado])
}
