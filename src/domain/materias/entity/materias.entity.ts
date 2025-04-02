
export class MateriaPensum {
  codUnidad: string;
  codPensum: string;
  codMateria: string;
  numNivel: string;
  nomMateria: string;
  uniTeorica: string;

  constructor(params: {
    codUnidad?: string;
    codPensum?: string;
    codMateria?: string;
    numNivel?: string;
    nomMateria?: string;
    uniTeorica?: string;
  }) {
    this.codUnidad = params.codUnidad || '';
    this.codPensum = params.codPensum || '';
    this.codMateria = params.codMateria || '';
    this.numNivel = params.numNivel || '';
    this.nomMateria = params.nomMateria || '';
    this.uniTeorica = params.uniTeorica || '';
  }
}