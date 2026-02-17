export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      auth_users_audit: {
        Row: {
          changed_at: string
          changed_by: string | null
          id: number
          new_data: Json | null
          old_data: Json | null
          operation: string
          user_id: string | null
        }
        Insert: {
          changed_at?: string
          changed_by?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          operation: string
          user_id?: string | null
        }
        Update: {
          changed_at?: string
          changed_by?: string | null
          id?: number
          new_data?: Json | null
          old_data?: Json | null
          operation?: string
          user_id?: string | null
        }
        Relationships: []
      }
      debug_auth_uid: {
        Row: {
          auth_uid: string | null
          captured_at: string
          client_ip: string | null
          id: number
          note: string | null
          object_table: string
          operation: string
        }
        Insert: {
          auth_uid?: string | null
          captured_at?: string
          client_ip?: string | null
          id?: number
          note?: string | null
          object_table: string
          operation: string
        }
        Update: {
          auth_uid?: string | null
          captured_at?: string
          client_ip?: string | null
          id?: number
          note?: string | null
          object_table?: string
          operation?: string
        }
        Relationships: []
      }
      "kelas X": {
        Row: {
          "Nama Lengkap": string
          NIS: string
        }
        Insert: {
          "Nama Lengkap"?: string
          NIS?: string
        }
        Update: {
          "Nama Lengkap"?: string
          NIS?: string
        }
        Relationships: []
      }
      "kelas XI": {
        Row: {
          "Nama Lengkap": string
          NIS: string
        }
        Insert: {
          "Nama Lengkap": string
          NIS: string
        }
        Update: {
          "Nama Lengkap"?: string
          NIS?: string
        }
        Relationships: []
      }
      "kelas XII": {
        Row: {
          "Nama Lengkap": string
          NIS: string
        }
        Insert: {
          "Nama Lengkap": string
          NIS: string
        }
        Update: {
          "Nama Lengkap"?: string
          NIS?: string
        }
        Relationships: []
      }
      market_items: {
        Row: {
          category: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          is_active: boolean
          is_from_portfolio: boolean
          price: number
          seller_id: string
          stock: number
          title: string
        }
        Insert: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_from_portfolio?: boolean
          price?: number
          seller_id: string
          stock?: number
          title: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean
          is_from_portfolio?: boolean
          price?: number
          seller_id?: string
          stock?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "market_items_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      mood_logs: {
        Row: {
          created_at: string
          id: string
          mood: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mood: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mood?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mood_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          is_read: boolean
          message: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          title: string
          type?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_initials: string
          balance: number
          created_at: string
          id: string
          name: string
          teacher_id: string | null
        }
        Insert: {
          avatar_initials?: string
          balance?: number
          created_at?: string
          id: string
          name?: string
          teacher_id?: string | null
        }
        Update: {
          avatar_initials?: string
          balance?: number
          created_at?: string
          id?: string
          name?: string
          teacher_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_teacher_id_fkey"
            columns: ["teacher_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quest_submissions: {
        Row: {
          approved_at: string | null
          approved_by: string | null
          coins_reward: number
          id: string
          quest_title: string
          status: string
          student_id: string
          submitted_at: string
          xp_reward: number
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          coins_reward?: number
          id?: string
          quest_title: string
          status?: string
          student_id: string
          submitted_at?: string
          xp_reward?: number
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          coins_reward?: number
          id?: string
          quest_title?: string
          status?: string
          student_id?: string
          submitted_at?: string
          xp_reward?: number
        }
        Relationships: [
          {
            foreignKeyName: "quest_submissions_approved_by_fkey"
            columns: ["approved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quest_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          buyer_id: string
          created_at: string
          id: string
          item_id: string | null
          seller_id: string
          status: string
          type: string
        }
        Insert: {
          amount: number
          buyer_id: string
          created_at?: string
          id?: string
          item_id?: string | null
          seller_id: string
          status?: string
          type?: string
        }
        Update: {
          amount?: number
          buyer_id?: string
          created_at?: string
          id?: string
          item_id?: string | null
          seller_id?: string
          status?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "market_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "transactions_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      class_wellness_summary: {
        Row: {
          avg_mood_score: number | null
          day: string | null
          entries: number | null
          max_mood_score: number | null
          min_mood_score: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      buy_item: {
        Args: { _buyer_id: string; _item_id: string; _quantity?: number }
        Returns: {
          new_balance: number
          remaining_stock: number
          transaction_id: string
        }[]
      }
      debug_capture_auth_uid: {
        Args: { p_note?: string; p_operation: string; p_table: string }
        Returns: boolean
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      mood_score: { Args: { m: string }; Returns: number }
      set_profile_balance: {
        Args: { p_new_balance: number; p_user_id: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "student" | "teacher" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "teacher", "admin"],
    },
  },
} as const
