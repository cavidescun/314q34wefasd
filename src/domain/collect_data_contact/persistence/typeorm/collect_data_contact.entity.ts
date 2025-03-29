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

@Entity('collect_data_contact')
export class CollectDataContactTypeORM {
  @PrimaryGeneratedColumn({ name: 'directorio_tel' })
  id: number;

  @Column({ length: 20 })
  celular: string;

  @Column({ length: 100 })
  email: string;
}
