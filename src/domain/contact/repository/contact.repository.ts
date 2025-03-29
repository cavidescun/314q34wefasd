import { Contact } from '../entity/contact.entity';

export interface ContactRepository {
  findById(id: number, estudianteId: string): Promise<Contact | null>;
  findByEstudianteId(estudianteId: string): Promise<Contact | null>;
  create(contact: Contact): Promise<Contact>;
  update(id: number, estudianteId: string, contact: Partial<Contact>): Promise<Contact>;
  delete(id: number, estudianteId: string): Promise<boolean>;
}