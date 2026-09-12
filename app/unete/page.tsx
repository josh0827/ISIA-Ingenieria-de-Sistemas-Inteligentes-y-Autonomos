// SECCIÓN: Únete al grupo               RESPONSABLE: por asignar
//
// QUÉ HAY QUE MONTAR
// La página que convierte a un estudiante interesado en un integrante: qué
// perfiles se buscan, qué implica entrar y cómo dar el paso.
//
// DECISIÓN PENDIENTE: EL FORMULARIO
// El sitio es estático y se publica desde GitHub, así que NO hay servidor donde
// recibir envíos. Tres salidas, de menos a más trabajo:
//   a) enlace mailto: al correo del grupo (cero infraestructura, funciona hoy)
//   b) un formulario de Google enlazado o incrustado
//   c) un formulario propio con una API externa, que ya obliga a gestionar claves
// Para arrancar, (a) o (b) sobran.

import type { Metadata } from 'next'
import { Seccion, TituloSeccion } from '@/componentes/Base'
import Pendiente from '@/componentes/Pendiente'
import estilos from '../listados.module.css'

export const metadata: Metadata = {
  title: 'Únete al grupo',
  description: 'Cómo vincularse al grupo de investigación ISIA como estudiante de pregrado.',
}

export default function PaginaUnete() {
  return (
    <Seccion className={estilos.primeraSeccion}>
      <TituloSeccion
        indice="Únete"
        titulo="Investiga con nosotros"
        descripcion="No hace falta experiencia previa en investigación. Hace falta constancia y curiosidad."
      />
      <Pendiente
        descripcion="Esta página debe explicar qué implica entrar al grupo, qué perfiles se buscan y cómo postularse."
        pasos={[
          'Explicar el compromiso real: sesiones quincenales, trabajo sostenido durante el semestre.',
          'Detallar qué se ofrece: acompañamiento, acceso al laboratorio, opción de proyecto de grado.',
          'Listar los perfiles que busca cada línea activa.',
          'Elegir la vía de contacto (mailto o formulario de Google) y dejarla bien visible.',
          'Añadir las fechas de la convocatoria si las hay.',
        ]}
      />
    </Seccion>
  )
}
