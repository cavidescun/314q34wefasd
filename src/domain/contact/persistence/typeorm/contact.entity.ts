import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  PrimaryColumn,
} from 'typeorm';

import { EstudianteTypeORM } from 'src/domain/estudiante/persistence/typeorm/estudiante.entity';

@Entity('contact')
export class ContactTypeORM {
  @PrimaryColumn('int', { name: 'id_contact' })
  id: number;

  @Column({ length: 45 })
  celular: string;

  @Column({ name: 'num_fijo', length: 45, nullable: true, type: 'varchar' })
  numFijo: string | null;

  @Column({ length: 45 })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @PrimaryColumn('uuid', { name: 'estudiante_id_estudiante' })
  estudianteId: string;

  @ManyToOne(() => EstudianteTypeORM, (estudiante) => estudiante.contacts)
  @JoinColumn({ name: 'estudiante_id_estudiante' })
  estudiante: EstudianteTypeORM;
}
