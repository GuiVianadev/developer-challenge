import { DialogTitle } from '@radix-ui/react-dialog';
import { User } from 'lucide-react';
import { useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogHeader } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ContactEdit() {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <DialogContent>
      <DialogHeader className="border-brand-border-primary/10 border-b pb-3">
        <DialogTitle className="font-bold text-xl">Editar contato</DialogTitle>
      </DialogHeader>

      <div className="flex flex-col items-center justify-center">
        {/* Upload de Foto */}
        <div className="relative mb-3 flex flex-col items-center">
          <div
            className="flex h-24 w-24 cursor-pointer items-center justify-center rounded-full border border-gray-400 border-dashed bg-gray-100 hover:bg-gray-200"
            onClick={triggerFileSelect}
          >
            {preview ? (
              <img
                alt="Preview"
                className="h-24 w-24 rounded-full object-cover"
                src={preview}
              />
            ) : (
              <User className="h-10 w-10 text-gray-500" />
            )}
          </div>

          <input
            accept="image/*"
            className="hidden"
            id="avatar"
            onChange={handleFileChange}
            ref={fileInputRef}
            type="file"
          />

          {/* Botão para ativar o input */}
          <Button
            className="mt-3"
            onClick={triggerFileSelect}
            size="sm"
            type="button"
            variant="outline"
          >
            {preview ? 'Alterar foto' : 'Adicionar foto'}
          </Button>
        </div>

        {/* Formulário */}
        <form className="flex w-80 flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              className="w-80 bg-transparent"
              id="name"
              placeholder="Nome do contato"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              className="w-80 bg-transparent"
              id="phone"
              placeholder="Número de telefone"
              type="text"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              className="w-80 bg-transparent"
              id="email"
              placeholder="Email do contato"
              type="email"
            />
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2 self-end">
            <Button
              className="mt-6 h-11 w-fit bg-brand-background-tertiary p-3 font-bold text-brand-content-body"
              type="button"
            >
              Cancelar
            </Button>
            <Button
              className="mt-6 h-11 w-fit bg-brand-accent-brand p-3 font-bold"
              type="submit"
            >
              Salvar
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
