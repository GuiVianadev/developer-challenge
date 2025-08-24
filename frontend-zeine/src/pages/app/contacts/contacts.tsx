import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useContacts, useFilterContacts } from '@/hooks/useContacts';
import { ContactTableRow } from './contact-table-row';
import { HeaderContact } from './header-contact';

export function Contacts() {
  const [selectedLetter, setSelectedLetter] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const { data: allContacts, isLoading: isLoadingAll } = useContacts();
  const { data: filteredContacts, isLoading: isLoadingFiltered } =
    useFilterContacts(selectedLetter);

  const baseContacts = selectedLetter ? filteredContacts : allContacts;
  const isLoading = selectedLetter ? isLoadingFiltered : isLoadingAll;

  const contacts = useMemo(() => {
    if (!baseContacts) return [];

    if (!searchTerm.trim()) return baseContacts;

    return baseContacts.filter(
      (contact) =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [baseContacts, searchTerm]);

  const handleLetterClick = (letter: string) => {
    setSelectedLetter(selectedLetter === letter ? '' : letter);
    setSearchTerm('');
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    if (value.trim()) {
      setSelectedLetter('');
    }
  };

  // Função para renderizar o conteúdo da tabela
  const renderTableContent = () => {
    if (isLoading) {
      return (
        <TableRow>
          <TableCell className="py-8 text-center" colSpan={4}>
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
              Carregando contatos...
            </div>
          </TableCell>
        </TableRow>
      );
    }

    if (contacts.length === 0) {
      return (
        <TableRow>
          <TableCell className="py-8 text-center text-gray-500" colSpan={4}>
            {searchTerm
              ? 'Nenhum contato encontrado'
              : 'Nenhum contato cadastrado'}
          </TableCell>
        </TableRow>
      );
    }

    return contacts.map((contact) => (
      <ContactTableRow contact={contact} key={contact.id} />
    ));
  };

  return (
    <div className="h-157 w-277 rounded-4xl bg-brand-background-secondary p-10">
      <HeaderContact
        onSearchChange={handleSearchChange}
        searchTerm={searchTerm}
      />

      <div className="flex h-120 gap-6">
        <div className="scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent flex h-[470px] w-14.5 flex-col items-center overflow-y-auto rounded-3xl bg-brand-accent-brand p-4 text-black">
          {Array.from({ length: 26 }, (_, i) => {
            const letter = String.fromCharCode(65 + i);
            const isSelected = selectedLetter === letter;

            return (
              <button
                className={`cursor-pointer hover:font-bold ${
                  isSelected ? 'font-bold text-2xl' : ''
                }`}
                key={i}
                onClick={() => handleLetterClick(letter)}
                type="button"
              >
                {letter}
              </button>
            );
          })}
        </div>

        <div className="w-full rounded-2x p-4">
          <div className="mb-3 h-9 w-full border-brand-border-primary/10 border-b pb-2.5">
            {searchTerm
              ? `Buscando: "${searchTerm}"`
              : selectedLetter || 'Todos os contatos'}
            <span className="ml-2 text-gray-500 text-sm">
              ({contacts?.length || 0} contatos)
            </span>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3 font-bold text-brand-content-muted">
                  NOME
                </TableHead>
                <TableHead className="w-1/4 font-bold text-brand-content-muted">
                  TELEFONE
                </TableHead>
                <TableHead className="w-1/4 font-bold text-brand-content-muted">
                  EMAIL
                </TableHead>
                <TableHead className="w-1/6" />
              </TableRow>
            </TableHeader>
            <TableBody>{renderTableContent()}</TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
