export class Institucion {
  idInstitucion: number;
  nombreInst: string;

  constructor(params: {
    idInstitucion?: number;
    nombreInst: string;
  }) {
    this.idInstitucion = params.idInstitucion || 0;
    this.nombreInst = params.nombreInst;
  }
}