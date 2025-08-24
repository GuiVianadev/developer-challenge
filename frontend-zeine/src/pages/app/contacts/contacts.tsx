import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ContactTableRow } from './contact-table-row';
import { HeaderContact } from './header-contact';

export function Contacts() {
  return (
    <div className="h-157 w-277 rounded-4xl bg-brand-background-secondary p-10">
      <HeaderContact />

      <div className="flex h-120 gap-6">
        <div className="scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-transparent flex h-[470px] w-14.5 flex-col items-center overflow-y-auto rounded-3xl bg-brand-accent-brand p-4 text-black">
          {Array.from({ length: 26 }, (_, i) => (
            <h1 key={i}>{String.fromCharCode(65 + i)}</h1>
          ))}
        </div>

        <div className="w-full rounded-2x p-4">
          <div className="mb-3 h-9 w-full border-brand-border-primary/10 border-b pb-2.5">
            C
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
            <TableBody>
              <ContactTableRow />
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
