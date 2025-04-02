
export enum EstatusHomologacion {
  PENDIENTE = 'Pendiente',
  APROBADO = 'Aprobado',
  RECHAZADO = 'Rechazado',
  SIN_DOCUMENTOS = 'Sin Documentos',
  INICIADO = 'Iniciado'
}

export class Homologacion {
  id: string;
  numeroHomologacion?: number;
  estudianteId: string;
  carreraCun?: string;
  estatus: EstatusHomologacion;
  jornada?: string;
  modalidad?: string;
  ciudad?: string;
  createdAt: Date;
  updatedAt: Date;
  institucion?: string;
  carreraHom?: string;
  fechaGrado?: Date;
  nivelEstudio?: string;
  observaciones?: string;
  codPensum?: string;
  codUnidad?: string;
  periodo?: string;
  semestre?: string;

  constructor(params: {
    id?: string;
    numeroHomologacion?: number;
    estudianteId: string;
    carreraCun?: string;
    estatus?: EstatusHomologacion;
    jornada?: string;
    modalidad?: string;
    ciudad?: string;
    createdAt?: Date;
    updatedAt?: Date;
    institucion?: string;
    carreraHom?: string;
    fechaGrado?: Date;
    nivelEstudio?: string;
    observaciones?: string;
    codPensum?: string;
    codUnidad?: string;
    periodo?: string;
    semestre?: string;
  }) {
    this.id = params.id || '';
    this.numeroHomologacion = params.numeroHomologacion;
    this.estudianteId = params.estudianteId;
    this.carreraCun = params.carreraCun;
    this.estatus = params.estatus || EstatusHomologacion.SIN_DOCUMENTOS;
    this.jornada = params.jornada;
    this.modalidad = params.modalidad;
    this.ciudad = params.ciudad;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.institucion = params.institucion;
    this.carreraHom = params.carreraHom;
    this.fechaGrado = params.fechaGrado;
    this.nivelEstudio = params.nivelEstudio;
    this.observaciones = params.observaciones;
    this.codPensum = params.codPensum;
    this.codUnidad = params.codUnidad;
    this.periodo = params.periodo;
    this.semestre = params.semestre;
  }
}