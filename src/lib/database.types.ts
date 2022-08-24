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
          requester_id: string;
          friend_id: string;
          accepted: boolean;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          requester_id: string;
          friend_id: string;
          accepted?: boolean;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          updated_at?: string | null;
          requester_id?: string;
          friend_id?: string;
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
          email: string | null;
          created_at: string;
          id: string;
          updated_at: string | null;
          username: string | null;
        };
        Insert: {
          email?: string | null;
          created_at: string;
          id: string;
          updated_at?: string | null;
          username?: string | null;
        };
        Update: {
          email?: string | null;
          created_at?: string;
          id?: string;
          updated_at?: string | null;
          username?: string | null;
        };
      };
      statuses: {
        Row: {
          city: string | null;
          location: Coords | null;
          id: number;
          tags: string[] | null;
          created_at: string | null;
          text: string | null;
          user_id: string;
        };
        Insert: {
          city?: string | null;
          location?: Coords | null;
          id?: number;
          tags?: string[] | null;
          created_at?: string | null;
          text?: string | null;
          user_id: string;
        };
        Update: {
          city?: string | null;
          location?: Coords | null;
          id?: number;
          tags?: string[] | null;
          created_at?: string | null;
          text?: string | null;
          user_id?: string;
        };
      };
    };
    Functions: {};
  };
}
