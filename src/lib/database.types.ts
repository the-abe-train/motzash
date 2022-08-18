export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          updated_at: string | null;
          username: string | null;
          handle: string | null;
        };
        Insert: {
          id: string;
          updated_at?: string | null;
          username?: string | null;
          handle?: string | null;
        };
        Update: {
          id?: string;
          updated_at?: string | null;
          username?: string | null;
          handle?: string | null;
        };
      };
      statuses: {
        Row: {
          user_id: string;
          lat: number | null;
          lng: number | null;
          tags: string[] | null;
          city: string | null;
          created_at: string | null;
          text: string | null;
          id: number;
        };
        Insert: {
          user_id: string;
          lat?: number | null;
          lng?: number | null;
          tags?: string[] | null;
          city?: string | null;
          created_at?: string | null;
          text?: string | null;
          id?: number;
        };
        Update: {
          user_id?: string;
          lat?: number | null;
          lng?: number | null;
          tags?: string[] | null;
          city?: string | null;
          created_at?: string | null;
          text?: string | null;
          id?: number;
        };
      };
      todos: {
        Row: {
          user_id: string;
          task: string | null;
          is_complete: boolean | null;
          inserted_at: string;
          id: number;
        };
        Insert: {
          user_id: string;
          task?: string | null;
          is_complete?: boolean | null;
          inserted_at?: string;
          id?: number;
        };
        Update: {
          user_id?: string;
          task?: string | null;
          is_complete?: boolean | null;
          inserted_at?: string;
          id?: number;
        };
      };
    };
    Functions: {};
  };
}

