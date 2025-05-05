import { CHANNELS } from "#constants/channels.js";

export interface IManyChatInstagramPayload {
  input: string;
  channel: typeof CHANNELS.INSTAGRAM;
  clinic_id: string;
  full_name?: string;
  contact_data: {
    key: string;
    id: string;
    page_id: string;
    user_refs: any[];
    status: string;
    first_name?: string;
    last_name?: string;
    name?: string;
    gender: string | number | null;
    profile_pic: string;
    locale: null | string;
    language: string | null;
    timezone?: string;
    live_chat_url: string;
    last_input_text: string;
    optin_phone: boolean;
    phone: null | string;
    optin_email: boolean;
    email: null | string;
    subscribed: Date | string;
    last_interaction: Date | string | null;
    ig_last_interaction: Date | string | null;
    last_seen: Date | string | null;
    ig_last_seen: Date | string | null;
    is_followup_enabled: boolean;
    ig_username: string;
    ig_id: {
      $numberDouble: any;
    };
    whatsapp_phone: string | null;
    optin_whatsapp: boolean;
    phone_country_code: string | null;
    last_growth_tool: string | null;
    custom_fields: {
      Text: string | null;
    };
  };
}
