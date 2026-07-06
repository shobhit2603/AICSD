const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  if (config.body && typeof config.body !== "string") {
    config.body = JSON.stringify(config.body);
  }

  const response = await fetch(url, config);
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }

  return data;
}

export const api = {
  // Tickets
  getTickets: async (filters = {}) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.append(key, value);
      }
    });

    const queryString = params.toString() ? `?${params.toString()}` : "";
    return request(`/tickets${queryString}`);
  },

  getStats: async () => {
    return request("/tickets/stats");
  },

  getTicket: async (id) => {
    return request(`/tickets/${id}`);
  },

  updateTicket: async (id, data) => {
    return request(`/tickets/${id}`, {
      method: "PATCH",
      body: data,
    });
  },

  addNote: async (id, content) => {
    return request(`/tickets/${id}/notes`, {
      method: "POST",
      body: { content },
    });
  },

  addMessage: async (id, messageData) => {
    return request(`/tickets/${id}/messages`, {
      method: "POST",
      body: messageData,
    });
  },

  // AI Operations
  generateSummary: async (id) => {
    return request(`/tickets/${id}/ai/summary`, {
      method: "POST",
    });
  },

  generateSuggestedReply: async (id) => {
    return request(`/tickets/${id}/ai/reply`, {
      method: "POST",
    });
  },

  categorizeTicket: async (id) => {
    return request(`/tickets/${id}/ai/categorize`, {
      method: "POST",
    });
  },

  findSimilarTickets: async (id) => {
    return request(`/tickets/${id}/ai/similar`, {
      method: "POST",
    });
  },

  checkEscalation: async (id) => {
    return request(`/tickets/${id}/ai/escalation`, {
      method: "POST",
    });
  },
};
