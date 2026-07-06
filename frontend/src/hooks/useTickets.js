import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useTickets(filters = {}) {
  return useQuery({
    queryKey: ["tickets", filters],
    queryFn: () => api.getTickets(filters),
    placeholderData: (previousData) => previousData, // keep previous data while fetching new data
  });
}

export function useTicketStats() {
  return useQuery({
    queryKey: ["ticket_stats"],
    queryFn: () => api.getStats(),
  });
}

export function useTicket(id) {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => api.getTicket(id),
    enabled: !!id,
  });
}

export function useSimilarTickets(id, options = {}) {
  return useQuery({
    queryKey: ["similar_tickets", id],
    queryFn: () => api.findSimilarTickets(id),
    enabled: !!id && !!options.enabled,
  });
}

export function useUpdateTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.updateTicket(id, data),
    onSuccess: (data, variables) => {
      // Invalidate ticket list, specific ticket, and stats
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["ticket_stats"] });
    },
  });
}

export function useAddMessage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, messageData }) => api.addMessage(id, messageData),
    onSuccess: (data, variables) => {
      // Invalidate the specific ticket to load new messages and updated sentiment
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useAddNote() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, content }) => api.addNote(id, content),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", variables.id] });
    },
  });
}

// AI Hook mutations
export function useGenerateSummary() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.generateSummary(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useGenerateReply() {
  return useMutation({
    mutationFn: (id) => api.generateSuggestedReply(id),
  });
}

export function useCategorizeTicket() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.categorizeTicket(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}

export function useCheckEscalation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => api.checkEscalation(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: ["ticket", id] });
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
      queryClient.invalidateQueries({ queryKey: ["ticket_stats"] });
    },
  });
}
