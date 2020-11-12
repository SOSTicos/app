// Note: Do NOT modify this array! Order sensitive!
export const deliveryStatuses = ['Sin Asignar', 'En Camino', 'ENTREGADO', 'CANCELADO']

export default deliveryStatuses

export const isDeliveryStatus = (status) => {
  return Boolean(deliveryStatuses[status])
}
