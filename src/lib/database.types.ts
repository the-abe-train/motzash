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
      friendships: {
        Row: {
          id: number;
          created_at: string | null;
          updated_at: string | null;
          requester_id: string | null;
          friend_id: string | null;
          accepted: boolean;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          requester_id?: string | null;
          friend_id?: string | null;
          accepted?: boolean;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          requester_id?: string | null;
          friend_id?: string | null;
          accepted?: boolean;
        };
      };
      todos: {
        Row: {
          is_complete: boolean | null;
          inserted_at: string;
          id: number;
          user_id: string;
          task: string | null;
        };
        Insert: {
          is_complete?: boolean | null;
          inserted_at?: string;
          id?: number;
          user_id: string;
          task?: string | null;
        };
        Update: {
          is_complete?: boolean | null;
          inserted_at?: string;
          id?: number;
          user_id?: string;
          task?: string | null;
        };
      };
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
          city: string | null;
          id: number;
          tags: string[] | null;
          created_at: string | null;
          text: string | null;
          lat: number | null;
          lng: number | null;
          user_id: string;
        };
        Insert: {
          city?: string | null;
          id?: number;
          tags?: string[] | null;
          created_at?: string | null;
          text?: string | null;
          lat?: number | null;
          lng?: number | null;
          user_id: string;
        };
        Update: {
          city?: string | null;
          id?: number;
          tags?: string[] | null;
          created_at?: string | null;
          text?: string | null;
          lat?: number | null;
          lng?: number | null;
          user_id?: string;
        };
      };
    };
    Functions: {};
  };
}

