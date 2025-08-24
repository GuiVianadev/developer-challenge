import { DialogTitle } from '@radix-ui/react-dialog';
import { User } from 'lucide-react';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import type { CreateContactBody } from '@/api/contacts';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateContact } from '@/hooks/useContacts';

export function ContactAdd() {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createContactMutation = useCreateContact();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<Omit<CreateContactBody, 'foto'>>();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo 5MB.');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas imagens.');
        return;
      }

      const url = URL.createObjectURL(file);
      setPreview(url);
      setSelectedFile(file);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const removePhoto = () => {
    setPreview(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const onSubmit = (data: Omit<CreateContactBody, 'foto'>) => {
    console.log('DEBUG: Selected file:', selectedFile); // Debug log

    const contactData: CreateContactBody = {
      ...data,
      foto: selectedFile || undefined,
    };

    console.log('DEBUG: Contact data being sent:', contactData); // Debug log

    createContactMutation.mutate(contactData, {
      onSuccess: (response) => {
        console.log('DEBUG: Contact created:', response); // Debug log
        reset();
        setPreview(null);
        setSelectedFile(null);
      },
      onError: (error) => {
        console.error('DEBUG: Error creating contact:', error);
      },
    });
  };

  return (
    <DialogContent>
      <DialogHeader className="border-brand-border-primary/10 border-b pb-3">
        <DialogTitle className="font-bold text-xl">
          Adicionar contato
        </DialogTitle>
      </DialogHeader>

      <div className="flex flex-col items-center justify-center">
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

          <div className="mt-3 flex gap-2">
            <Button
              onClick={triggerFileSelect}
              size="sm"
              type="button"
              variant="outline"
            >
              {preview ? 'Alterar foto' : 'Adicionar foto'}
            </Button>
            {preview && (
              <Button
                onClick={removePhoto}
                size="sm"
                type="button"
                variant="outline"
              >
                Remover
              </Button>
            )}
          </div>
        </div>

        <form
          className="flex w-80 flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              className="w-80 bg-transparent"
              id="name"
              placeholder="Nome do contato"
              type="text"
              {...register('name', {
                required: 'Nome é obrigatório',
                minLength: {
                  value: 3,
                  message: 'Nome deve ter pelo menos 3 caracteres',
                },
              })}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              className="w-80 bg-transparent"
              id="telefone"
              placeholder="Número de telefone"
              type="text"
              {...register('telefone', {
                required: 'Telefone é obrigatório',
                minLength: {
                  value: 11,
                  message: 'Telefone deve ter pelo menos 11 dígitos',
                },
              })}
            />
            {errors.telefone && (
              <p className="text-red-500 text-sm">{errors.telefone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              className="w-80 bg-transparent"
              id="email"
              placeholder="Email do contato"
              type="email"
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Email inválido',
                },
              })}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="reference">Referência</Label>
            <Input
              className="w-80 bg-transparent"
              id="reference"
              placeholder="Ex: Trabalho, Família, etc."
              type="text"
              {...register('reference')}
            />
          </div>

          <div className="flex gap-2 self-end">
            <DialogClose asChild>
              <Button
                className="mt-6 h-11 w-fit bg-brand-background-tertiary p-3 font-bold text-brand-content-body"
                type="button"
              >
                Cancelar
              </Button>
            </DialogClose>
            <Button
              className="mt-6 h-11 w-fit bg-brand-accent-brand p-3 font-bold"
              disabled={createContactMutation.isPending}
              type="submit"
            >
              {createContactMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
