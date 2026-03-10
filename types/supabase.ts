export type InquiryStatus = "unread" | "in_progress" | "done";

export type Inquiry = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: InquiryStatus;
  assigned_to?: string;
  created_at: string;
  updated_at: string;
};

export type ConversionEventType = "booking_click" | "line_click" | "phone_click";

export type ConversionEvent = {
  id: string;
  event_type: ConversionEventType;
  page_url: string;
  created_at: string;
};

// Phase 3 - Chatbot
export type ChatSession = {
  id: string;
  page_url: string;
  user_agent: string;
  started_at: string;
  ended_at?: string;
};

export type ChatMessageRole = "user" | "assistant";

export type ChatMessage = {
  id: string;
  session_id: string;
  role: ChatMessageRole;
  content: string;
  created_at: string;
};

export type ChatbotKnowledge = {
  id: string;
  title: string;
  content: string;
  category: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type ChatbotPrompt = {
  id: string;
  name: string;
  content: string;
  is_active: boolean;
  version: number;
  updated_at: string;
};
