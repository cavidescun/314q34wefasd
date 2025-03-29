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

import { HomologacionTypeORM } from 'src/domain/homologaciones/persistence/typeorm/homologaciones.entity';

@Entity('documents')
export class DocumentsTypeORM {
  @PrimaryGeneratedColumn({ name: 'id_documents' })
  id: number;

  @Column({ name: 'url_doc_bachiller', type: 'text', nullable: true })
  urlDocBachiller: string | null;

  @Column({ name: 'url_doc_identificacion', type: 'text', nullable: true })
  urlDocIdentificacion: string | null;

  @Column({ name: 'url_doc_titulo_homologar', type: 'text', nullable: true })
  urlDocTituloHomologar: string | null;

  @Column({ name: 'url_sabana_notas', type: 'text', nullable: true })
  urlSabanaNotas: string | null;

  @Column({ name: 'url_carta_homologacion', type: 'text', nullable: true })
  urlCartaHomologacion: string | null;

  @Column({
    name: 'url_contenidos_programaticos',
    type: 'text',
    nullable: true,
  })
  urlContenidosProgramaticos: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'homologacion_id_homologacion' })
  homologacionId: string;

  @ManyToOne(
    () => HomologacionTypeORM,
    (homologacion) => homologacion.documents,
  )
  @JoinColumn({ name: 'homologacion_id_homologacion' })
  homologacion: HomologacionTypeORM;
}
