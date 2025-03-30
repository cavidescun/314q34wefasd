import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('sena')
export class SenaTypeORM {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ name: 'nit_institucion', length: 100, nullable: true })
  nit_institucion: string;

  @Column({ name: 'institucion_externa', length: 100, nullable: true })
  institucion_externa: string;

  @Column({ name: 'snies', length: 100, nullable: true })
  snies: string;

  @Column({ name: 'nivel_ies', length: 100, nullable: true })
  nivel_ies: string;

  @Column({ name: 'programa_ies', length: 100, nullable: true })
  programa_ies: string;

  @Column({ name: 'id_seccional', length: 100, nullable: true })
  id_seccional: string;

  @Column({ name: 'nom_seccional', length: 100, nullable: true })
  nom_seccional: string;

  @Column({ name: 'id_sede', length: 100, nullable: true })
  id_sede: string;

  @Column({ name: 'nom_sede', length: 100, nullable: true })
  nom_sede: string;

  @Column({ name: 'cod_unidad', length: 100, nullable: true })
  cod_unidad: string;

  @Column({ name: 'cod_pensum', length: 100, nullable: true })
  cod_pensum: string;

  @Column({ name: 'nom_unidad', length: 100, nullable: true })
  nom_unidad: string;

  @Column({ name: 'fec_ini_vigencia', length: 100, nullable: true })
  fec_ini_vigencia: string;

  @Column({ name: 'fec_fin_vigencia', length: 100, nullable: true })
  fec_fin_vigencia: string;

  @Column({ name: 'nom_tabla_met', length: 100, nullable: true })
  nom_tabla_met: string;

  @Column({ name: 'nom_tabla_niv', length: 100, nullable: true })
  nom_tabla_niv: string;

  @Column({ name: 'id_dependencia', length: 100, nullable: true })
  id_dependencia: string;

  @Column({ name: 'nom_dependencia', length: 100, nullable: true })
  nom_dependencia: string;

  @Column({ name: 'sem_nivel', length: 100, nullable: true })
  sem_nivel: string;

  @Column({ name: 'estado', length: 100, nullable: true })
  estado: string;
}