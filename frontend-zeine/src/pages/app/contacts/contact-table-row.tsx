import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { TableCell, TableRow } from '@/components/ui/table';
import { ContactEdit } from './contact-edit';

export function ContactTableRow() {
  return (
    <TableRow className="align-middle">
      <TableCell className="p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-200 font-bold">
            G
          </div>
          <div className="flex flex-col">
            <p className="font-medium">Guilherme</p>
            <span className="text-gray-500 text-sm">Trabalho</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="align-middle">61994390390</TableCell>

      <TableCell className="align-middle">gui@gmail.com</TableCell>

      <TableCell className="align-middle">
        <div className="flex items-center gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="border-1 border-brand-border-primary/20 bg-transparent p-2 text-brand-border-primary text-medium text-xs">
                <Pencil className="h-1 w-1" />
                Editar
              </Button>
            </DialogTrigger>
            <ContactEdit />
          </Dialog>
          <Button className="h-7 w-7 border-1 border-brand-border-primary/20 bg-transparent p-2 text-brand-border-primary hover:bg-brand-accent-red/80">
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
