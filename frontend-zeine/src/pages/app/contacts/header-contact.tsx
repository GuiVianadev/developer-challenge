import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ContactAdd } from './contact-add';

export function HeaderContact() {
  return (
    <div className="flex justify-between">
      <h1 className="font-bold text-2xl">Lista de contatos</h1>
      <form className="flex items-center gap-2.5">
        <Input className="min-w-80" placeholder="Pesquisar" />
        <Dialog>
          <DialogTrigger asChild>
            <Button className="h-12 rounded-xl bg-brand-background-tertiary p-3 font-medium text-brand-content-body">
              <Plus className="h-4 w-4" />
              Adicionar Contato
            </Button>
          </DialogTrigger>
          <ContactAdd />
        </Dialog>
      </form>
    </div>
  );
}
