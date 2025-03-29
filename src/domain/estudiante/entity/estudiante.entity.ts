export class Estudiante {
  id: string;
  nombreCompleto: string;
  numeroIdentificacion: string;

  constructor(params: {
    id?: string;
    nombreCompleto: string;
    numeroIdentificacion: string;
  }) {
    this.id = params.id || '';
    this.nombreCompleto = params.nombreCompleto;
    this.numeroIdentificacion = params.numeroIdentificacion;
  }
}