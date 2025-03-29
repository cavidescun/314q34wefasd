export class CollectDataContact {
  id: number;
  celular: string;
  email: string;

  constructor(params: {
    id?: number;
    celular: string;
    email: string;
  }) {
    this.id = params.id || 0;
    this.celular = params.celular;
    this.email = params.email;
  }
}