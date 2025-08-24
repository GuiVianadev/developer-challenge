import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createContact,
  deleteContact,
  filterContacts,
  getContacts,
  updateContact,
} from '@/api/contacts';

export const useContacts = () => {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });
};

export const useFilterContacts = (initial: string) => {
  return useQuery({
    queryKey: ['contacts', 'filter', initial],
    queryFn: () => filterContacts(initial),
    enabled: !!initial,
  });
};

export const useCreateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

export const useUpdateContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};

export const useDeleteContact = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contacts'] });
    },
  });
};
