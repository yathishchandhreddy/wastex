/**
 * WasteX AI - Recycled Products & Pathways Types
 * Standard types for Recycling Companies, Recycling Processes,
 * Recycled Products, and People Marketplace Orders.
 */

export interface RecyclingCompany {
  id: string;
  name: string;
  category: string;
  location: string;
  distance_km: number;
  specialization: string[];
  accepted_materials: string[];
  min_intake: number;
  max_intake: number;
  unit: string;
  processing_type: string;
  rating: number;
  reviews_count: number;
  is_verified: boolean;
  compliance_cert: string;
  estimated_processing_days: number;
  offered_intake_price: number;
  currency: string;
  resulting_product_name: string;
  resulting_product_image: string;
  description: string;
  contact_person?: string;
  phone?: string;
  email?: string;
}

export type RecyclingStepStatus = 'completed' | 'in_progress' | 'pending';

export interface RecyclingProcessStep {
  step_number: number;
  step_name: 'Waste Received' | 'Sorting' | 'Processing' | 'Quality Check' | 'Recycled Material/Product';
  status: RecyclingStepStatus;
  title: string;
  description: string;
  technical_note?: string;
  updated_at?: string;
}

export interface RecyclingProcessRecord {
  id: string;
  waste_listing_id?: string;
  waste_material_name: string;
  waste_quantity: number;
  unit: string;
  recycling_company: RecyclingCompany;
  current_step_index: number;
  steps: RecyclingProcessStep[];
  output_product_name: string;
  output_product_image: string;
  output_estimated_yield: number;
  output_unit_price: number;
  status: 'intake' | 'processing' | 'completed' | 'published_to_marketplace';
  created_at: string;
  completed_at?: string;
}

export interface RecycledProduct {
  id: string;
  name: string;
  category: string;
  source_waste_material: string;
  recycled_process_id?: string;
  recycling_company_name: string;
  image_url: string;
  price: number;
  unit: string;
  currency: string;
  quantity_available: number;
  minimum_order_qty: number;
  location: string;
  condition_grade: string;
  is_verified_recycled: boolean;
  carbon_abatement_pct: number;
  virgin_material_displacement_ratio: string;
  description: string;
  technical_specs: { [key: string]: string };
  seller_name: string;
  seller_organization: string;
  created_at: string;
  in_stock: boolean;
}

export interface RecycledProductOrder {
  id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  category: string;
  seller_name: string;
  seller_organization: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  shipping_address: string;
  order_quantity: number;
  unit: string;
  unit_price: number;
  total_price: number;
  currency: string;
  payment_method: string;
  order_status: 'Confirmed' | 'Processing' | 'Dispatched' | 'Delivered';
  created_at: string;
  estimated_delivery?: string;
  tracking_number?: string;
  notes?: string;
}
