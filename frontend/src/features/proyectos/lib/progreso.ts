/** Porcentaje de tareas completadas, redondeado. Un proyecto sin tareas está al 0 %. */
export function calcularProgreso(completadas: number, total: number): number {
  if (total <= 0) return 0
  return Math.round((completadas / total) * 100)
}
