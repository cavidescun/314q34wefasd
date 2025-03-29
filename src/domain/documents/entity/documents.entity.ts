export class Documents {
  id: number;
  urlDocBachiller?: string;
  urlDocIdentificacion?: string;
  urlDocTituloHomologar?: string;
  urlSabanaNotas?: string;
  urlCartaHomologacion?: string;
  urlContenidosProgramaticos?: string;
  createdAt: Date;
  updatedAt: Date;
  homologacionId: string;

  constructor(params: {
    id?: number;
    urlDocBachiller?: string;
    urlDocIdentificacion?: string;
    urlDocTituloHomologar?: string;
    urlSabanaNotas?: string;
    urlCartaHomologacion?: string;
    urlContenidosProgramaticos?: string;
    createdAt?: Date;
    updatedAt?: Date;
    homologacionId: string;
  }) {
    this.id = params.id || 0;
    this.urlDocBachiller = params.urlDocBachiller;
    this.urlDocIdentificacion = params.urlDocIdentificacion;
    this.urlDocTituloHomologar = params.urlDocTituloHomologar;
    this.urlSabanaNotas = params.urlSabanaNotas;
    this.urlCartaHomologacion = params.urlCartaHomologacion;
    this.urlContenidosProgramaticos = params.urlContenidosProgramaticos;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.homologacionId = params.homologacionId;
  }
}
