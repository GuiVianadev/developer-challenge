import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { useDeleteContact } from '@/hooks/useContacts';
import type { Contact } from '@/types/contact';
import { ContactEdit } from './contact-edit';

interface ContactTableRowProps {
  contact: Contact;
}

export function ContactTableRow({ contact }: ContactTableRowProps) {
  const deleteContactMutation = useDeleteContact();

  const handleDelete = () => {
    if (window.confirm('Tem certeza que deseja excluir este contato?')) {
      deleteContactMutation.mutate(contact.id);
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <TableRow className="align-middle">
      <TableCell className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-200 font-bold">
            {contact.foto ? (
              <img
                alt={contact.name}
                className="h-11 w-11 rounded-2xl object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-gray-600 font-bold">${getInitials(contact.name)}</span>`;
                  }
                }}
                src={contact.foto}
              />
            ) : (
              <span className="font-bold text-gray-600">
                {getInitials(contact.name)}
              </span>
            )}
          </div>
          <div className="flex flex-col">
            <p className="font-medium">{contact.name}</p>
            <span className="text-gray-500 text-sm">
              {contact.reference || 'Contato'}
            </span>
          </div>
        </div>
      </TableCell>

      <TableCell className="align-middle">{contact.telefone}</TableCell>

      <TableCell className="align-middle">{contact.email}</TableCell>

      <TableCell className="align-middle">
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="border-1 border-brand-border-primary/20 bg-transparent p-2 text-brand-border-primary text-medium text-xs">
                <Pencil className="h-1 w-1" />
                Editar
              </Button>
            </DialogTrigger>
            <ContactEdit contact={contact} />
          </Dialog>
          <Button
            className="h-7 w-7 border-1 border-brand-border-primary/20 bg-transparent p-2 text-brand-border-primary hover:bg-brand-accent-red/80"
            disabled={deleteContactMutation.isPending}
            onClick={handleDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
