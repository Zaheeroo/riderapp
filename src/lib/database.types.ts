export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      customers: {
        Row: {
          id: number
          user_id: string
          name: string
          email: string
          phone: string
          address: string | null
          rating: number | null
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          email: string
          phone: string
          address?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          email?: string
          phone?: string
          address?: string | null
          rating?: number | null
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      drivers: {
        Row: {
          id: number
          user_id: string
          name: string
          email: string
          phone: string
          license_number: string
          vehicle_type: string
          vehicle_model: string
          vehicle_year: number
          rating: number | null
          status: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          user_id: string
          name: string
          email: string
          phone: string
          license_number: string
          vehicle_type: string
          vehicle_model: string
          vehicle_year: number
          rating?: number | null
          status?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          user_id?: string
          name?: string
          email?: string
          phone?: string
          license_number?: string
          vehicle_type?: string
          vehicle_model?: string
          vehicle_year?: number
          rating?: number | null
          status?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      rides: {
        Row: {
          id: number
          customer_id: number
          driver_id: number | null
          pickup_location: string
          dropoff_location: string
          pickup_date: string
          pickup_time: string
          status: string
          trip_type: string
          vehicle_type: string
          passengers: number
          price: string
          payment_status: string
          special_requirements: string | null
          admin_notes: string | null
          created_by: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: number
          customer_id: number
          driver_id?: number | null
          pickup_location: string
          dropoff_location: string
          pickup_date: string
          pickup_time: string
          status?: string
          trip_type: string
          vehicle_type: string
          passengers: number
          price: string
          payment_status?: string
          special_requirements?: string | null
          admin_notes?: string | null
          created_by: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: number
          customer_id?: number
          driver_id?: number | null
          pickup_location?: string
          dropoff_location?: string
          pickup_date?: string
          pickup_time?: string
          status?: string
          trip_type?: string
          vehicle_type?: string
          passengers?: number
          price?: string
          payment_status?: string
          special_requirements?: string | null
          admin_notes?: string | null
          created_by?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rides_customer_id_fkey"
            columns: ["customer_id"]
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          id: string
          email: string
          role: string
          created_at: string
          updated_at: string | null
        }
        Insert: {
          id?: string
          email: string
          role?: string
          created_at?: string
          updated_at?: string | null
        }
        Update: {
          id?: string
          email?: string
          role?: string
          created_at?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 