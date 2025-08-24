import { DialogTitle } from '@radix-ui/react-dialog';
import { User } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  DialogClose,
  DialogContent,
  DialogHeader,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateContact } from '@/hooks/useContacts';
import type { Contact, UpdateContactBody } from '@/types/contact';

interface ContactEditProps {
  contact: Contact;
}

export function ContactEdit({ contact }: ContactEditProps) {
  const [preview, setPreview] = useState<string | null>(contact.foto || null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const updateContactMutation = useUpdateContact();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<UpdateContactBody>({
    defaultValues: {
      name: contact.name,
      email: contact.email,
      telefone: contact.telefone,
      reference: contact.reference,
      foto: contact.foto,
    },
  });

  // Reset form quando o contato mudar
  useEffect(() => {
    reset({
      name: contact.name,
      email: contact.email,
      telefone: contact.telefone,
      reference: contact.reference,
      foto: contact.foto,
    });
    setPreview(contact.foto || null);
  }, [contact, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreview(url);
      setValue('foto', url);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const onSubmit = async (data: UpdateContactBody) => {
    try {
      await updateContactMutation.mutateAsync({
        id: contact.id,
        ...data,
      });
      // O dialog vai fechar automaticamente
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
    }
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
        <form
          className="flex w-80 flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              className="w-80 bg-transparent"
              id="name"
              placeholder="Nome do contato"
              type="text"
              {...register('name', {
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
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              className="w-80 bg-transparent"
              id="telefone"
              placeholder="Número de telefone"
              type="text"
              {...register('telefone', {
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
            <Label htmlFor="email">Email</Label>
            <Input
              className="w-80 bg-transparent"
              id="email"
              placeholder="Email do contato"
              type="email"
              {...register('email', {
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

          {/* Botões de ação */}
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
              disabled={updateContactMutation.isPending}
              type="submit"
            >
              {updateContactMutation.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
