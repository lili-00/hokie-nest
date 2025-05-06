export interface Database {
  public: {
    Tables: {
      properties: {
        Row: {
          id: string;
          title: string;
          description: string;
          address: string;
          price: number;
          bedrooms: number;
          bathrooms: number;
          square_feet: number;
          location: string;
          landlord_id: string | null;
          status: 'available' | 'rented' | 'maintenance' | null;
          property_type: 'studio' | 'apartment';
          amenities: string[] | null;
          highlights: string[] | null;
          images: string[] | null;
          is_furnished: boolean | null;
          transportation: any | null;
          landlord_name: string;
          landlord_email: string;
          landlord_phone: string | null;
          reviews_count: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          address: string;
          price: number;
          bedrooms: number;
          bathrooms: number;
          square_feet: number;
          location: string;
          landlord_id?: string | null;
          status?: 'available' | 'rented' | 'maintenance' | null;
          property_type?: 'studio' | 'apartment';
          amenities?: string[] | null;
          highlights?: string[] | null;
          images?: string[] | null;
          is_furnished?: boolean | null;
          transportation?: any | null;
          landlord_name: string;
          landlord_email: string;
          landlord_phone?: string | null;
          reviews_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          address?: string;
          price?: number;
          bedrooms?: number;
          bathrooms?: number;
          square_feet?: number;
          location?: string;
          landlord_id?: string | null;
          status?: 'available' | 'rented' | 'maintenance' | null;
          property_type?: 'studio' | 'apartment';
          amenities?: string[] | null;
          highlights?: string[] | null;
          images?: string[] | null;
          is_furnished?: boolean | null;
          transportation?: any | null;
          landlord_name?: string;
          landlord_email?: string;
          landlord_phone?: string | null;
          reviews_count?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      reviews: {
        Row: {
          id: string;
          property_id: string | null;
          user_id: string | null;
          rating: number | null;
          comment: string;
          reviewer_name: string;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          property_id?: string | null;
          user_id?: string | null;
          rating?: number | null;
          comment: string;
          reviewer_name: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          property_id?: string | null;
          user_id?: string | null;
          rating?: number | null;
          comment?: string;
          reviewer_name?: string;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      profiles: {
        Row: {
          id: string;
          role: string;
          full_name: string;
          phone: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id: string;
          role: string;
          full_name: string;
          phone?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          role?: string;
          full_name?: string;
          phone?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
}