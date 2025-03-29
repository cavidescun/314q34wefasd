import { CollectDataContact } from '../entity/collect_data_contact.entity';

export interface CollectDataContactRepository {
  findById(id: number): Promise<CollectDataContact | null>;
  findByCelular(celular: string): Promise<CollectDataContact | null>;
  findByEmail(email: string): Promise<CollectDataContact | null>;
  create(collectDataContact: CollectDataContact): Promise<CollectDataContact>;
  update(id: number, collectDataContact: Partial<CollectDataContact>): Promise<CollectDataContact>;
  delete(id: number): Promise<boolean>;
  findAll(): Promise<CollectDataContact[]>;
}