/**
 * PACDesk - Datos semilla y configuracion especializada para
 * Consultas de Ingenieria de Protecciones, Automatizacion, Control y Comunicaciones (PAC)
 */

const DEFAULT_TICKETS = [
  {
    id: "PAC-2026-001",
    titulo: "Saturacion de TC en rele diferencial de barra 87B ante cortocircuito trifasico de 40 kA",
    proyecto: "S/E Charrua 500/220 kV",
    disciplina: "Protecciones",
    prioridad: "Critica",
    estado: "en_revision",
    documentoRef: "MEM-AJU-87B-CH220-REV2",
    solicitante: "Ing. Cristian Riquelme (Jefe Pruebas de Terreno PAC)",
    especialista: "Ing. Alejandro Soto (Senior Protecciones Electricas)",
    fechaCreacion: "2026-09-25",
    fechaLimite: "2026-09-28",
    impactoObra: "Critico: Detiene inyeccion secundaria y comisionamiento de paño H1",
    afectaCostoPlazo: true,
    descripcion: "Durante las pruebas de inyeccion en el rele diferencial de barra SEL-487B del paño de 220 kV, se constató que la corriente de falla maxima (40 kA) calculada en la memoria causa saturacion de los TC relacion 2000/5A clase 10P20 en menos de 2.8 ms. Se requiere autorizacion para activar el algoritmo de deteccion rapida de saturacion o ajustar la pendiente Slope 2 del plano alfa.",
    propuestaTerreno: "Ajustar pendiente Slope 2 de 0.60 a 0.75 y habilitar bloqueo transitorio por saturacion de acuerdo a recomendacion del fabricante.",
    historial: [
      {
        id: "h1",
        autor: "Ing. Cristian Riquelme",
        fecha: "2026-09-25 09:30",
        tipo: "creacion",
        texto: "RFI PAC emitida con urgencia. Se suspenden pruebas de comisionamiento hasta definicion de ajustes."
      },
      {
        id: "h2",
        autor: "Ing. Alejandro Soto",
        fecha: "2026-09-25 15:10",
        tipo: "comentario",
        texto: "Se corrio simulacion en CAPE / DIgSILENT. Los TC aguas arriba toleran el ajuste propuesto con margen de seguridad del 15%. Se prepara memoria tecnica de cambio de ajuste (MTC)."
      }
    ]
  },
  {
    id: "PAC-2026-002",
    titulo: "Conflicto de AppID y colision de mensajes GOOSE entre bahias en red IEC 61850",
    proyecto: "S/E Don Jaime 220 kV",
    disciplina: "Comunicaciones_OT",
    prioridad: "Critica",
    estado: "en_revision",
    documentoRef: "SCD-IEC61850-DJ220-V3.2",
    solicitante: "Marcela Vera (Especialista Puesta en Marcha Redes OT)",
    especialista: "Ing. David Muñoz (Lider Redes & Ciberseguridad OT)",
    fechaCreacion: "2026-09-26",
    fechaLimite: "2026-09-29",
    impactoObra: "Critico: Impide verificacion de esquema de enclavamiento por red de estacion",
    afectaCostoPlazo: true,
    descripcion: "En la red de estacion (switches Ruggedcom bajo topologia PRP), se detectó que el IED de acoplamiento y el IED del paño J1 tienen configurado el mismo AppID (0x0001) para el dataset de GOOSE de interdisparo y enclavamiento, provocando rechazo de tramas en los receptores.",
    propuestaTerreno: "Reasignar AppID 0x0002 para el IED de bahia J1 y reexportar archivos .CID desde el configurador del sistema IET600.",
    historial: [
      {
        id: "h3",
        autor: "Marcela Vera",
        fecha: "2026-09-26 10:15",
        tipo: "creacion",
        texto: "Deteccion de colision en analizador de paquetes Wireshark durante pruebas de enclavamiento."
      },
      {
        id: "h4",
        autor: "Ing. David Muñoz",
        fecha: "2026-09-26 14:00",
        tipo: "comentario",
        texto: "Se reviso el archivo SCD maestro. Se confirma la duplicidad. Se enviara archivo .SCD rev 3.3 corregido en las proximas 2 horas."
      }
    ]
  },
  {
    id: "PAC-2026-003",
    titulo: "Criterio de enclavamiento fisico vs logico en BCU para seccionador de tierra 89E",
    proyecto: "S/E Don Jaime 220 kV",
    disciplina: "Control_Automatizacion",
    prioridad: "Media",
    estado: "esperando_info",
    documentoRef: "DWG-FUNC-ENC-J1-REV-B",
    solicitante: "Felipe Oyarzun (Supervisor Montaje y Cableado PAC)",
    especialista: "Ing. Carolina Basso (Especialista Control & Bahias)",
    fechaCreacion: "2026-09-27",
    fechaLimite: "2026-10-03",
    impactoObra: "Sin impacto en ruta critica de alambrado",
    afectaCostoPlazo: false,
    descripcion: "Se requiere confirmar si el enclavamiento entre el seccionador de puesta a tierra 89E y el disyuntor 52 se debe alambrar de manera cableada directa (hardwired en serie con bobina de mando) o si es admisible resolverlo unicamente mediante la logica programada en el controlador de bahia (BCU REC670).",
    propuestaTerreno: "Mantener enclavamiento electrico cableado directo por seguridad operativa de personal en patio de 220 kV.",
    historial: [
      {
        id: "h5",
        autor: "Felipe Oyarzun",
        fecha: "2026-09-27 11:20",
        tipo: "creacion",
        texto: "Consulta enviada para cerrar detalles de borneras en gabinete de control de patio."
      }
    ]
  },
  {
    id: "PAC-2026-004",
    titulo: "Mapeo de comandos SBO (Select Before Operate) en pasarela DNP3 hacia el CEN",
    proyecto: "BESS Atacama Storage 50 MW",
    disciplina: "SCADA_Telecontrol",
    prioridad: "Alta",
    estado: "en_revision",
    documentoRef: "IO-LIST-SCADA-CEN-REV4",
    solicitante: "Esteban Navia (Integrador SCADA & Telecontrol)",
    especialista: "Ing. Rodrigo Silva (Especialista Telecontrol)",
    fechaCreacion: "2026-09-26",
    fechaLimite: "2026-09-30",
    impactoObra: "Afecta hito de pruebas de integracion con el Coordinador Electrico Nacional",
    afectaCostoPlazo: false,
    descripcion: "El Coordinador Electrico Nacional (CEN) exige que las ordenes de apertura y cierre de disyuntores de conexion del banco de baterias tengan un timeout de confirmacion SBO de 3000 ms en lugar de los 1000 ms configurados por defecto en la pasarela de subestacion.",
    propuestaTerreno: "Modificar parametro Select-Timeout a 3000 ms en el archivo de configuracion DNP3 slave.",
    historial: [
      {
        id: "h6",
        autor: "Esteban Navia",
        fecha: "2026-09-26 16:45",
        tipo: "creacion",
        texto: "Observacion levantada durante protocolo preliminar con despacho del CEN."
      }
    ]
  },
  {
    id: "PAC-2026-005",
    titulo: "Caida de tension en circuito de disparo 125 Vcc para bobinas Trip Coil 1 y 2",
    proyecto: "Central Hidroelectrica Los Condores",
    disciplina: "Ingenieria_Alambrado",
    prioridad: "Media",
    estado: "resuelto",
    documentoRef: "SCH-CAB-PROT-CH-012",
    solicitante: "Gonzalo Parra (Jefe Electrico de Montaje)",
    especialista: "Ing. Patricia Fuentes (Ingeniera de Alambrado PAC)",
    fechaCreacion: "2026-09-21",
    fechaLimite: "2026-09-27",
    impactoObra: "Resuelto satisfactoriamente sin costos adicionales",
    afectaCostoPlazo: false,
    descripcion: "Para una tirada de 195 metros de cable de control desde los gabinetes de rele hasta el patio de 220 kV, se solicito verificar si la seccion de 2.5 mm2 garantiza la tension minima de disparo de las bobinas (80% de 125 Vcc) considerando una corriente peak de 4.5 A por bobina.",
    propuestaTerreno: "Tender cable de control apantallado de 4 mm2 en lugar de 2.5 mm2.",
    historial: [
      {
        id: "h7",
        autor: "Gonzalo Parra",
        fecha: "2026-09-21 08:30",
        tipo: "creacion",
        texto: "Consulta sobre dimensionamiento de cable de disparo."
      },
      {
        id: "h8",
        autor: "Ing. Patricia Fuentes",
        fecha: "2026-09-22 17:15",
        tipo: "resolucion",
        texto: "DICTAMEN TECNICO: El calculo arroja una caida de tension de 7.8 V con 2.5 mm2 (tension en bornes de bobina = 117.2 Vcc > 100 Vcc minimo requerido por norma IEC 62271-100). No obstante, por confiabilidad se aprueba estandarizar a 4 mm2 para bobinas TC1 y TC2 sin objecion."
      }
    ]
  },
  {
    id: "PAC-2026-006",
    titulo: "Asignacion de hilos de fibra optica OPGW para canal C37.94 de teleproteccion 87L",
    proyecto: "Linea de Transmision 2x220 kV",
    disciplina: "Comunicaciones_OT",
    prioridad: "Baja",
    estado: "cerrado",
    documentoRef: "DWG-TEL-FO-LT220-001",
    solicitante: "Ignacio Soto (ITO Telecomunicaciones)",
    especialista: "Ing. David Muñoz (Lider Redes & Ciberseguridad OT)",
    fechaCreacion: "2026-09-18",
    fechaLimite: "2026-09-24",
    impactoObra: "Cerrado sin observaciones",
    afectaCostoPlazo: false,
    descripcion: "Definir los tubos y pelos de fibra optica monomodo del cable de guardia OPGW reservados exclusivamente para el canal de proteccion diferencial de linea 87L principal 1 y 2.",
    propuestaTerreno: "Asignar tubillo azul hilos 1 y 2 para Proteccion 1 (C37.94) y tubillo verde hilos 1 y 2 para Proteccion 2.",
    historial: [
      {
        id: "h9",
        autor: "Ignacio Soto",
        fecha: "2026-09-18 12:00",
        tipo: "creacion",
        texto: "Se requiere formalizacion para empalme en mufa de remate."
      },
      {
        id: "h10",
        autor: "Ing. David Muñoz",
        fecha: "2026-09-19 11:30",
        tipo: "resolucion",
        texto: "DICTAMEN: Aprobada la asignacion segun propuesta. Se actualiza plano de asignacion de fibras rev C."
      }
    ]
  },
  {
    id: "PAC-2026-007",
    titulo: "Sincronizacion horaria PTP (IEEE 1588) en perfil Power Utility Profile para IEDs de barra",
    proyecto: "S/E Charrua 500/220 kV",
    disciplina: "Comunicaciones_OT",
    prioridad: "Media",
    estado: "nuevo",
    documentoRef: "SPEC-PAC-SYNC-PTP-01",
    solicitante: "Rodrigo Alarcon (Ingeniero de Comisionamiento PAC)",
    especialista: "Por Asignar",
    fechaCreacion: "2026-09-28",
    fechaLimite: "2026-10-04",
    impactoObra: "Sin impacto en la ruta critica inmediata",
    afectaCostoPlazo: false,
    descripcion: "Se consulta si el reloj maestro GPS (Grandmaster Clock) debe operar en modo End-to-End o Peer-to-Peer para cumplir con el estandar IEC/IEEE 61850-9-3 (Power Utility Profile) en los switches de subestacion.",
    propuestaTerreno: "Configurar modo Peer-to-Peer (P2P) con delay request de 1 segundo segun estandar IEEE C37.238.",
    historial: [
      {
        id: "h11",
        autor: "Rodrigo Alarcon",
        fecha: "2026-09-28 09:10",
        tipo: "creacion",
        texto: "Ticket registrado en espera de asignacion a especialista de redes OT."
      }
    ]
  }
];

const DISCIPLINAS = [
  { id: "Protecciones", nombre: "Protecciones Eléctricas", color: "blue", icon: "shield-alert" },
  { id: "Control_Automatizacion", nombre: "Control & Automatización", color: "emerald", icon: "cpu" },
  { id: "Comunicaciones_OT", nombre: "Comunicaciones OT & IEC 61850", color: "cyan", icon: "network" },
  { id: "SCADA_Telecontrol", nombre: "SCADA & Telecontrol (CEN)", color: "amber", icon: "activity" },
  { id: "Ingenieria_Alambrado", nombre: "Alambrado & Serv. Auxiliares", color: "indigo", icon: "git-merge" }
];

const PROYECTOS = [
  "S/E Charrua 500/220 kV",
  "S/E Don Jaime 220 kV",
  "Central Hidroelectrica Los Condores",
  "BESS Atacama Storage 50 MW",
  "Linea de Transmision 2x220 kV"
];

const ESTADOS = [
  { id: "nuevo", nombre: "Nuevas / Por Asignar", badgeColor: "bg-slate-100 text-slate-700 border-slate-300", headerColor: "border-slate-400 bg-slate-50" },
  { id: "en_revision", nombre: "En Revisión Técnica", badgeColor: "bg-blue-100 text-blue-800 border-blue-300", headerColor: "border-blue-500 bg-blue-50/70" },
  { id: "esperando_info", nombre: "Esperando Info / Terceros", badgeColor: "bg-amber-100 text-amber-800 border-amber-300", headerColor: "border-amber-500 bg-amber-50/70" },
  { id: "resuelto", nombre: "Dictamen Emitido / Resuelto", badgeColor: "bg-emerald-100 text-emerald-800 border-emerald-300", headerColor: "border-emerald-500 bg-emerald-50/70" },
  { id: "cerrado", nombre: "Cerrado", badgeColor: "bg-gray-100 text-gray-600 border-gray-300", headerColor: "border-gray-400 bg-gray-50" }
];

const PRIORIDADES = {
  Baja: { label: "Baja", badge: "bg-slate-100 text-slate-600 border-slate-200" },
  Media: { label: "Media", badge: "bg-blue-100 text-blue-700 border-blue-200" },
  Alta: { label: "Alta", badge: "bg-orange-100 text-orange-700 border-orange-200" },
  Critica: { label: "Crítica / Bloqueante", badge: "bg-red-100 text-red-700 border-red-300 font-semibold" }
};
