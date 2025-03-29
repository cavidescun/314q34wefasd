export class Contact {
  id: number;
  celular: string;
  numFijo?: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  estudianteId: string;

  constructor(params: {
    id?: number;
    celular: string;
    numFijo?: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
    estudianteId: string;
  }) {
    this.id = params.id || 0;
    this.celular = params.celular;
    this.numFijo = params.numFijo;
    this.email = params.email;
    this.createdAt = params.createdAt || new Date();
    this.updatedAt = params.updatedAt || new Date();
    this.estudianteId = params.estudianteId;
  }
}