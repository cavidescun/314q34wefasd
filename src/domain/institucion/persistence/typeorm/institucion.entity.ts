import {
  Entity,
  PrimaryGeneratedColumn,
  Column
} from 'typeorm';

@Entity('instituciones')
export class InstitucionTypeORM {
  @PrimaryGeneratedColumn({ name: 'idinstitucion' })
  idInstitucion: number;

  @Column({ name: 'nombre_inst', length: 200 })
  nombreInst: string;
}