import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ContactAdd } from './contact-add';

interface HeaderContactProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
}

export function HeaderContact({
  searchTerm,
  onSearchChange,
}: HeaderContactProps) {
  return (
    <div className="flex justify-between">
      <h1 className="font-bold text-2xl">Lista de contatos</h1>
      <form
        className="flex items-center gap-2.5"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-gray-400" />
          <Input
            className="min-w-80 pl-10"
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Pesquisar"
            value={searchTerm}
          />
        </div>
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
