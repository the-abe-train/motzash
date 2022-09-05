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
      widgets: {
        Row: {
          id: number;
          created_at: string | null;
          name: string | null;
          user_id: string | null;
          type: string | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          name?: string | null;
          user_id?: string | null;
          type?: string | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          name?: string | null;
          user_id?: string | null;
          type?: string | null;
        };
      };
      recipe_instructions: {
        Row: {
          id: number;
          updated_at: string | null;
          widget_id: number | null;
          step: number | null;
          text: string | null;
        };
        Insert: {
          id?: number;
          updated_at?: string | null;
          widget_id?: number | null;
          step?: number | null;
          text?: string | null;
        };
        Update: {
          id?: number;
          updated_at?: string | null;
          widget_id?: number | null;
          step?: number | null;
          text?: string | null;
        };
      };
      recipe_metadata: {
        Row: {
          id: number;
          udpated_at: string | null;
          widget_id: number | null;
          servings: number | null;
          prep_time: number | null;
          favourite: boolean | null;
        };
        Insert: {
          id?: number;
          udpated_at?: string | null;
          widget_id?: number | null;
          servings?: number | null;
          prep_time?: number | null;
          favourite?: boolean | null;
        };
        Update: {
          id?: number;
          udpated_at?: string | null;
          widget_id?: number | null;
          servings?: number | null;
          prep_time?: number | null;
          favourite?: boolean | null;
        };
      };
      recipe_ingredients: {
        Row: {
          id: number;
          updated_at: string | null;
          widget_id: number | null;
          amount: number | null;
          unit: string | null;
          ingredient: string | null;
        };
        Insert: {
          id?: number;
          updated_at?: string | null;
          widget_id?: number | null;
          amount?: number | null;
          unit?: string | null;
          ingredient?: string | null;
        };
        Update: {
          id?: number;
          updated_at?: string | null;
          widget_id?: number | null;
          amount?: number | null;
          unit?: string | null;
          ingredient?: string | null;
        };
      };
      todos: {
        Row: {
          id: number;
          created_at: string | null;
          widget_id: number | null;
          task: string | null;
          is_complete: boolean | null;
        };
        Insert: {
          id?: number;
          created_at?: string | null;
          widget_id?: number | null;
          task?: string | null;
          is_complete?: boolean | null;
        };
        Update: {
          id?: number;
          created_at?: string | null;
          widget_id?: number | null;
          task?: string | null;
          is_complete?: boolean | null;
        };
      };
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
          location: Json | null;
          id: number;
          created_at: string | null;
          text: string | null;
          user_id: string;
        };
        Insert: {
          city?: string | null;
          location?: Json | null;
          id?: number;
          created_at?: string | null;
          text?: string | null;
          user_id: string;
        };
        Update: {
          city?: string | null;
          location?: Json | null;
          id?: number;
          created_at?: string | null;
          text?: string | null;
          user_id?: string;
        };
      };
    };
    Functions: {};
  };
}

