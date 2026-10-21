import type { Metadata } from 'next'
import { AvisoDemo, EncabezadoPagina, Seccion } from '@/componentes/Base'
import { SITIO } from '@/lib/sitio'
import estilos from '../secundarias.module.css'

export const metadata: Metadata = {
  title: 'Aviso de privacidad',
  description: 'Cómo el semillero ISIA trata los datos que envías en sus formularios.',
}

export default function PaginaPrivacidad() {
  return (
    <Seccion className={estilos.primeraSeccion}>
      <EncabezadoPagina
        indice="Privacidad"
        titulo="Aviso de privacidad"
        descripcion="Resumen de cómo se usan los datos que envías mediante los formularios del portal."
      />
      <div className="prosa">
        <AvisoDemo>
          Este resumen se basa en el texto de autorización de los formularios. El semillero y la Universidad deben
          validarlo antes de considerarlo definitivo.
        </AvisoDemo>
        <h2>Responsable</h2>
        <p>
          {SITIO.universidad}, {SITIO.sede}, a través del semillero {SITIO.sigla}. Contacto:{' '}
          <a href={SITIO.correoHref}>{SITIO.correo}</a>.
        </p>
        <h2>Datos que se reciben</h2>
        <p>
          Los que escribes en cada formulario: nombre, correo, programa o entidad, temas de interés y el mensaje o la
          descripción que quieras compartir. No incluyas contraseñas ni datos sensibles.
        </p>
        <h2>Finalidad</h2>
        <p>
          Responder tu manifestación de interés, tu pregunta, tu propuesta de colaboración o tu reto de prototipado.
          Los datos no se usan para otros fines sin tu autorización.
        </p>
        <h2>Tus derechos</h2>
        <p>
          Puedes conocer, actualizar, rectificar o pedir que se borren tus datos escribiendo a{' '}
          <a href={SITIO.correoHref}>{SITIO.correo}</a> o a{' '}
          <a href={`mailto:${SITIO.correoDatos}`}>{SITIO.correoDatos}</a>.
        </p>
        <h2>Política aplicable</h2>
        <p>
          El tratamiento se rige por la{' '}
          <a href={SITIO.politicaDatos} target="_blank" rel="noopener noreferrer">
            Política de Tratamiento de Datos Personales de la Universidad Nacional de Colombia
            <span className="solo-lectores"> (se abre en una pestaña nueva)</span>
          </a>{' '}
          (Resolución 207 de 2021) y la Ley 1581 de 2012.
        </p>
        <h2>Pendiente de confirmar</h2>
        <p>El plazo de conservación de las solicitudes aún no está definido por el semillero.</p>
      </div>
    </Seccion>
  )
}
