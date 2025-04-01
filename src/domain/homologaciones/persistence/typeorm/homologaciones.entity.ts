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
import { DocumentsTypeORM } from 'src/domain/documents/persistence/typeorm/documents.entity';


@Entity('homologacion')
export class HomologacionTypeORM {
  @PrimaryColumn('uuid', { name: 'id_homologacion' })
  id: string;

  @Column({ name: 'estudiante_id_estudiante' })
  estudianteId: string;

  @Column({ name: 'carrera_cun', length: 150, nullable: true, type: 'varchar' })
  carreraCun: string | null;

  @Column({ type: 'text', default: 'Sin Documentos' })
  estatus: string;

  @Column({ length: 45, nullable: true, type: 'varchar' })
  jornada: string | null;

  @Column({ length: 45, nullable: true, type: 'varchar' })
  modalidad: string | null;

  @Column({ length: 45, nullable: true, type: 'varchar' })
  ciudad: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ length: 100, nullable: true, type: 'varchar' })
  institucion: string | null;

  @Column({ name: 'carrera_hom', length: 100, nullable: true, type: 'varchar' })
  carreraHom: string | null;

  @Column({ name: 'fecha_grado', type: 'date', nullable: true })
  fechaGrado: Date | null;

  @Column({ name: 'nivel_estudio', length: 45, nullable: true, type: 'varchar' })
  nivelEstudio: string | null;
  
  @Column({ name: 'observaciones', type: 'text', nullable: true })
  observaciones: string | null;

  @ManyToOne(() => EstudianteTypeORM, estudiante => estudiante.homologaciones)
  @JoinColumn({ name: 'estudiante_id_estudiante' })
  estudiante: EstudianteTypeORM;

  @OneToMany(() => DocumentsTypeORM, documents => documents.homologacion)
  documents: DocumentsTypeORM[];
}