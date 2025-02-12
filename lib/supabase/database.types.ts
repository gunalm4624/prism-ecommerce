export type Database = {
  public: {
    Tables: {
      orders: {
        Row: {
          id: string;
          order_id: string;
          product_name: string;
          product_image: string;
          tracking_status: string;
          tracking_number: string;
          carrier: string;
          quantity: number;
          amount: number;
          created_at: string;
          items: {
            name: string;
            quantity: number;
            price: number;
          }[];
        };
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['orders']['Row']>;
      };
    };
  };
}; 