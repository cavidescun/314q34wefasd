export class Sena {
  id: number;
  nit_institucion: string;
  institucion_externa: string;
  snies: string;
  nivel_ies: string;
  programa_ies: string;
  id_seccional: string;
  nom_seccional: string;
  id_sede: string;
  nom_sede: string;
  cod_unidad: string;
  cod_pensum: string;
  nom_unidad: string;
  fec_ini_vigencia: string;
  fec_fin_vigencia: string;
  nom_tabla_met: string;
  nom_tabla_niv: string;
  id_dependencia: string;
  nom_dependencia: string;
  sem_nivel: string;
  estado: string;

  constructor(params: {
    id?: number;
    nit_institucion: string;
    institucion_externa: string;
    snies: string;
    nivel_ies: string;
    programa_ies: string;
    id_seccional: string;
    nom_seccional: string;
    id_sede: string;
    nom_sede: string;
    cod_unidad: string;
    cod_pensum: string;
    nom_unidad: string;
    fec_ini_vigencia: string;
    fec_fin_vigencia: string;
    nom_tabla_met: string;
    nom_tabla_niv: string;
    id_dependencia: string;
    nom_dependencia: string;
    sem_nivel: string;
    estado: string;
  }) {
    this.id = params.id || 0;
    this.nit_institucion = params.nit_institucion;
    this.institucion_externa = params.institucion_externa;
    this.snies = params.snies;
    this.nivel_ies = params.nivel_ies;
    this.programa_ies = params.programa_ies;
    this.id_seccional = params.id_seccional;
    this.nom_seccional = params.nom_seccional;
    this.id_sede = params.id_sede;
    this.nom_sede = params.nom_sede;
    this.cod_unidad = params.cod_unidad;
    this.cod_pensum = params.cod_pensum;
    this.nom_unidad = params.nom_unidad;
    this.fec_ini_vigencia = params.fec_ini_vigencia;
    this.fec_fin_vigencia = params.fec_fin_vigencia;
    this.nom_tabla_met = params.nom_tabla_met;
    this.nom_tabla_niv = params.nom_tabla_niv;
    this.id_dependencia = params.id_dependencia;
    this.nom_dependencia = params.nom_dependencia;
    this.sem_nivel = params.sem_nivel;
    this.estado = params.estado;
  }
}