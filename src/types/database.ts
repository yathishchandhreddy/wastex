/**
-- WasteX AI Database Types
-- Centralized Supabase Database schema definitions
*/

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = 'generator' | 'buyer' | 'admin';
export type ListingStatus = 'active' | 'matched' | 'reserved' | 'completed' | 'closed';
export type ValorizationPathway = 'reuse' | 'recycling' | 'recovery' | 'disposal';
export type RequirementStatus = 'active' | 'closed';
export type RequestStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          email: string | null;
          organization: string | null;
          role: UserRole;
          location: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          email?: string | null;
          organization?: string | null;
          role: UserRole;
          location?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string | null;
          organization?: string | null;
          role?: UserRole;
          location?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      waste_listings: {
        Row: {
          id: string;
          generator_id: string;
          waste_type: string | null;
          material: string | null;
          subcategory: string | null;
          quantity: number | null;
          unit: string | null;
          quality: string | null;
          location: string | null;
          image_url: string | null;
          description: string | null;
          generation_frequency: string | null;
          status: ListingStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          generator_id: string;
          waste_type?: string | null;
          material?: string | null;
          subcategory?: string | null;
          quantity?: number | null;
          unit?: string | null;
          quality?: string | null;
          location?: string | null;
          image_url?: string | null;
          description?: string | null;
          generation_frequency?: string | null;
          status?: ListingStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          generator_id?: string;
          waste_type?: string | null;
          material?: string | null;
          subcategory?: string | null;
          quantity?: number | null;
          unit?: string | null;
          quality?: string | null;
          location?: string | null;
          image_url?: string | null;
          description?: string | null;
          generation_frequency?: string | null;
          status?: ListingStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'waste_listings_generator_id_fkey';
            columns: ['generator_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      waste_analysis: {
        Row: {
          id: string;
          waste_listing_id: string;
          category: string | null;
          material: string | null;
          subcategory: string | null;
          composition: Json | null;
          recyclability: string | null;
          reuse_potential: string | null;
          recovery_potential: string | null;
          ai_confidence: number | null;
          ai_summary: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          waste_listing_id: string;
          category?: string | null;
          material?: string | null;
          subcategory?: string | null;
          composition?: Json | null;
          recyclability?: string | null;
          reuse_potential?: string | null;
          recovery_potential?: string | null;
          ai_confidence?: number | null;
          ai_summary?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          waste_listing_id?: string;
          category?: string | null;
          material?: string | null;
          subcategory?: string | null;
          composition?: Json | null;
          recyclability?: string | null;
          reuse_potential?: string | null;
          recovery_potential?: string | null;
          ai_confidence?: number | null;
          ai_summary?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'waste_analysis_waste_listing_id_fkey';
            columns: ['waste_listing_id'];
            referencedRelation: 'waste_listings';
            referencedColumns: ['id'];
          }
        ];
      };
      valorization_options: {
        Row: {
          id: string;
          waste_listing_id: string;
          pathway: ValorizationPathway;
          estimated_value: number | null;
          market_demand_score: number | null;
          environmental_benefit_score: number | null;
          feasibility_score: number | null;
          overall_score: number | null;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          waste_listing_id: string;
          pathway: ValorizationPathway;
          estimated_value?: number | null;
          market_demand_score?: number | null;
          environmental_benefit_score?: number | null;
          feasibility_score?: number | null;
          overall_score?: number | null;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          waste_listing_id?: string;
          pathway?: ValorizationPathway;
          estimated_value?: number | null;
          market_demand_score?: number | null;
          environmental_benefit_score?: number | null;
          feasibility_score?: number | null;
          overall_score?: number | null;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'valorization_options_waste_listing_id_fkey';
            columns: ['waste_listing_id'];
            referencedRelation: 'waste_listings';
            referencedColumns: ['id'];
          }
        ];
      };
      buyer_requirements: {
        Row: {
          id: string;
          buyer_id: string;
          material: string | null;
          waste_type: string | null;
          min_quantity: number | null;
          max_quantity: number | null;
          quality_requirement: string | null;
          location: string | null;
          max_price: number | null;
          frequency: string | null;
          description: string | null;
          status: RequirementStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          buyer_id: string;
          material?: string | null;
          waste_type?: string | null;
          min_quantity?: number | null;
          max_quantity?: number | null;
          quality_requirement?: string | null;
          location?: string | null;
          max_price?: number | null;
          frequency?: string | null;
          description?: string | null;
          status?: RequirementStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          buyer_id?: string;
          material?: string | null;
          waste_type?: string | null;
          min_quantity?: number | null;
          max_quantity?: number | null;
          quality_requirement?: string | null;
          location?: string | null;
          max_price?: number | null;
          frequency?: string | null;
          description?: string | null;
          status?: RequirementStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'buyer_requirements_buyer_id_fkey';
            columns: ['buyer_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
      matches: {
        Row: {
          id: string;
          waste_listing_id: string;
          buyer_requirement_id: string;
          match_score: number | null;
          material_score: number | null;
          quantity_score: number | null;
          quality_score: number | null;
          location_score: number | null;
          price_score: number | null;
          frequency_score: number | null;
          reason: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          waste_listing_id: string;
          buyer_requirement_id: string;
          match_score?: number | null;
          material_score?: number | null;
          quantity_score?: number | null;
          quality_score?: number | null;
          location_score?: number | null;
          price_score?: number | null;
          frequency_score?: number | null;
          reason?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          waste_listing_id?: string;
          buyer_requirement_id?: string;
          match_score?: number | null;
          material_score?: number | null;
          quantity_score?: number | null;
          quality_score?: number | null;
          location_score?: number | null;
          price_score?: number | null;
          frequency_score?: number | null;
          reason?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'matches_waste_listing_id_fkey';
            columns: ['waste_listing_id'];
            referencedRelation: 'waste_listings';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'matches_buyer_requirement_id_fkey';
            columns: ['buyer_requirement_id'];
            referencedRelation: 'buyer_requirements';
            referencedColumns: ['id'];
          }
        ];
      };
      requests: {
        Row: {
          id: string;
          match_id: string | null;
          sender_id: string;
          receiver_id: string;
          quantity: number | null;
          proposed_price: number | null;
          message: string | null;
          status: RequestStatus;
          created_at: string;
        };
        Insert: {
          id?: string;
          match_id?: string | null;
          sender_id: string;
          receiver_id: string;
          quantity?: number | null;
          proposed_price?: number | null;
          message?: string | null;
          status?: RequestStatus;
          created_at?: string;
        };
        Update: {
          id?: string;
          match_id?: string | null;
          sender_id?: string;
          receiver_id?: string;
          quantity?: number | null;
          proposed_price?: number | null;
          message?: string | null;
          status?: RequestStatus;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'requests_sender_id_fkey';
            columns: ['sender_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'requests_receiver_id_fkey';
            columns: ['receiver_id'];
            referencedRelation: 'profiles';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: {};
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Update'];

export type Profile = Tables<'profiles'>;
export type WasteListingRow = Tables<'waste_listings'>;
export type WasteAnalysisRow = Tables<'waste_analysis'>;
export type ValorizationOptionRow = Tables<'valorization_options'>;
export type BuyerRequirementRow = Tables<'buyer_requirements'>;
export type MatchRow = Tables<'matches'>;
export type RequestRow = Tables<'requests'>;
