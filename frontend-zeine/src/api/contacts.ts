import { api } from '@/lib/axios';

export type Contact = {
  id: number;
  name: string;
  email: string;
  telefone: string;
  foto?: string;
  reference?: string;
};

export type CreateContactBody = {
  name: string;
  email: string;
  telefone: string;
  foto?: File | string;
  reference?: string;
};

export type UpdateContactBody = {
  name?: string;
  email?: string;
  telefone?: string;
  foto?: File | string;
  reference?: string;
};

export async function getContacts(): Promise<Contact[]> {
  const response = await api.get('/contacts/');
  return response.data;
}

export async function createContact(
  contact: CreateContactBody
): Promise<Contact> {
  const formData = new FormData();

  formData.append('name', contact.name);
  formData.append('email', contact.email);
  formData.append('telefone', contact.telefone);

  if (contact.reference) {
    formData.append('reference', contact.reference);
  }

  if (contact.foto && contact.foto instanceof File) {
    formData.append('foto', contact.foto);
  }

  const response = await api.post('/contacts/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function filterContacts(initial: string): Promise<Contact[]> {
  const response = await api.get(`/contacts/filter/?initial=${initial}`);
  return response.data;
}

export async function updateContact({
  id,
  ...contact
}: { id: number } & UpdateContactBody): Promise<Contact> {
  const formData = new FormData();

  if (contact.name !== undefined) {
    formData.append('name', contact.name);
  }
  if (contact.email !== undefined) {
    formData.append('email', contact.email);
  }
  if (contact.telefone !== undefined) {
    formData.append('telefone', contact.telefone);
  }
  if (contact.reference !== undefined) {
    formData.append('reference', contact.reference);
  }
  if (contact.foto instanceof File) {
    formData.append('foto', contact.foto);
  }

  const response = await api.patch(`/contacts/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
}

export async function deleteContact(id: number): Promise<void> {
  const response = await api.delete(`/contacts/${id}`);
  return response.data;
}
