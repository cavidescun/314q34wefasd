import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, PrimaryColumn } from 'typeorm';
import { ContactTypeORM } from 'src/domain/contact/persistence/typeorm/contact.entity';
import { HomologacionTypeORM } from 'src/domain/homologaciones/persistence/typeorm/homologaciones.entity';

@Entity('estudiante')
export class EstudianteTypeORM {
  @PrimaryColumn('uuid', { name: 'id_estudiante' })
  id: string;

  @Column({ name: 'nombre_completo', length: 150 })
  nombreCompleto: string;

  @Column({ name: 'numero_identificacion', length: 20, unique: true })
  numeroIdentificacion: string;

  @OneToMany(() => ContactTypeORM, contact => contact.estudiante)
  contacts: ContactTypeORM[];

  @OneToMany(() => HomologacionTypeORM, homologacion => homologacion.estudiante)
  homologaciones: HomologacionTypeORM[];
}

