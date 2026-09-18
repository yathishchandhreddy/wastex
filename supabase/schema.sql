-- ==============================================================================
-- WasteX AI - Complete Database Schema & Migration
-- Industrial Waste Valorization & Circular Secondary Feedstock Exchange Platform
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. ENUMS & CONSTANTS
-- ==============================================================================
-- Roles: 'generator', 'buyer', 'admin'
-- Listing Status: 'active', 'matched', 'reserved', 'completed', 'closed'
-- Requirement Status: 'active', 'closed'
-- Request Status: 'pending', 'accepted', 'rejected', 'completed'
-- Valorization Pathway: 'reuse', 'recycling', 'recovery', 'disposal'

-- ==============================================================================
-- 3. PROFILES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  organization TEXT,
  role TEXT NOT NULL CHECK (role IN ('generator', 'buyer', 'admin')),
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 4. WASTE LISTINGS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.waste_listings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  generator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  waste_type TEXT,
  material TEXT,
  subcategory TEXT,
  quantity NUMERIC CHECK (quantity >= 0),
  unit TEXT,
  quality TEXT,
  location TEXT,
  image_url TEXT,
  description TEXT,
  generation_frequency TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'matched', 'reserved', 'completed', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 5. WASTE ANALYSIS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.waste_analysis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waste_listing_id UUID NOT NULL REFERENCES public.waste_listings(id) ON DELETE CASCADE,
  category TEXT,
  material TEXT,
  subcategory TEXT,
  composition JSONB DEFAULT '[]'::jsonb,
  recyclability TEXT,
  reuse_potential TEXT,
  recovery_potential TEXT,
  ai_confidence NUMERIC CHECK (ai_confidence >= 0 AND ai_confidence <= 100),
  ai_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 6. VALORIZATION OPTIONS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.valorization_options (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waste_listing_id UUID NOT NULL REFERENCES public.waste_listings(id) ON DELETE CASCADE,
  pathway TEXT NOT NULL CHECK (pathway IN ('reuse', 'recycling', 'recovery', 'disposal')),
  estimated_value NUMERIC,
  market_demand_score NUMERIC CHECK (market_demand_score >= 0 AND market_demand_score <= 100),
  environmental_benefit_score NUMERIC CHECK (environmental_benefit_score >= 0 AND environmental_benefit_score <= 100),
  feasibility_score NUMERIC CHECK (feasibility_score >= 0 AND feasibility_score <= 100),
  overall_score NUMERIC CHECK (overall_score >= 0 AND overall_score <= 100),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 7. BUYER REQUIREMENTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.buyer_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  material TEXT,
  waste_type TEXT,
  min_quantity NUMERIC CHECK (min_quantity >= 0),
  max_quantity NUMERIC CHECK (max_quantity >= 0),
  quality_requirement TEXT,
  location TEXT,
  max_price NUMERIC CHECK (max_price >= 0),
  frequency TEXT,
  description TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 8. MATCHES TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waste_listing_id UUID NOT NULL REFERENCES public.waste_listings(id) ON DELETE CASCADE,
  buyer_requirement_id UUID NOT NULL REFERENCES public.buyer_requirements(id) ON DELETE CASCADE,
  match_score NUMERIC CHECK (match_score >= 0 AND match_score <= 100),
  material_score NUMERIC CHECK (material_score >= 0 AND material_score <= 100),
  quantity_score NUMERIC CHECK (quantity_score >= 0 AND quantity_score <= 100),
  quality_score NUMERIC CHECK (quality_score >= 0 AND quality_score <= 100),
  location_score NUMERIC CHECK (location_score >= 0 AND location_score <= 100),
  price_score NUMERIC CHECK (price_score >= 0 AND price_score <= 100),
  frequency_score NUMERIC CHECK (frequency_score >= 0 AND frequency_score <= 100),
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 9. REQUESTS TABLE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.matches(id) ON DELETE SET NULL,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  quantity NUMERIC CHECK (quantity >= 0),
  proposed_price NUMERIC CHECK (proposed_price >= 0),
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'completed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- 10. INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_waste_listings_generator_id ON public.waste_listings(generator_id);
CREATE INDEX IF NOT EXISTS idx_waste_listings_material ON public.waste_listings(material);
CREATE INDEX IF NOT EXISTS idx_waste_listings_status ON public.waste_listings(status);

CREATE INDEX IF NOT EXISTS idx_buyer_requirements_buyer_id ON public.buyer_requirements(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_requirements_material ON public.buyer_requirements(material);
CREATE INDEX IF NOT EXISTS idx_buyer_requirements_status ON public.buyer_requirements(status);

CREATE INDEX IF NOT EXISTS idx_matches_waste_listing_id ON public.matches(waste_listing_id);
CREATE INDEX IF NOT EXISTS idx_matches_buyer_requirement_id ON public.matches(buyer_requirement_id);

CREATE INDEX IF NOT EXISTS idx_requests_sender_id ON public.requests(sender_id);
CREATE INDEX IF NOT EXISTS idx_requests_receiver_id ON public.requests(receiver_id);
CREATE INDEX IF NOT EXISTS idx_requests_status ON public.requests(status);

-- ==============================================================================
-- 11. HELPER SECURITY FUNCTIONS
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Automatic user profile creation on Supabase Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, email, organization, role, location)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'Industrial User'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'organization', NEW.raw_user_meta_data->>'company', 'Facility Node'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'generator'),
    COALESCE(NEW.raw_user_meta_data->>'location', 'Regional Industrial Hub')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = CASE WHEN profiles.name IS NULL OR profiles.name = '' THEN EXCLUDED.name ELSE profiles.name END;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- 12. ROW LEVEL SECURITY (RLS)
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waste_analysis ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valorization_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.buyer_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.requests ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------------------------
-- PROFILES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Users can read own profile" ON public.profiles;
CREATE POLICY "Users can read own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (
    auth.uid() = id 
    OR public.is_admin()
    OR id IN (SELECT generator_id FROM public.waste_listings WHERE status = 'active')
    OR id IN (SELECT buyer_id FROM public.buyer_requirements WHERE status = 'active')
    OR id IN (SELECT sender_id FROM public.requests WHERE receiver_id = auth.uid())
    OR id IN (SELECT receiver_id FROM public.requests WHERE sender_id = auth.uid())
  );

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR public.is_admin())
  WITH CHECK (auth.uid() = id OR public.is_admin());

DROP POLICY IF EXISTS "Admin can delete profiles" ON public.profiles;
CREATE POLICY "Admin can delete profiles"
  ON public.profiles FOR DELETE
  TO authenticated
  USING (public.is_admin());

-- ------------------------------------------------------------------------------
-- WASTE LISTINGS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Generators and authorized users can view listings" ON public.waste_listings;
CREATE POLICY "Generators and authorized users can view listings"
  ON public.waste_listings FOR SELECT
  TO authenticated
  USING (
    generator_id = auth.uid()
    OR status = 'active'
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Generators can create their own listings" ON public.waste_listings;
CREATE POLICY "Generators can create their own listings"
  ON public.waste_listings FOR INSERT
  TO authenticated
  WITH CHECK (
    (generator_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('generator', 'admin')))
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Generators can update their own listings" ON public.waste_listings;
CREATE POLICY "Generators can update their own listings"
  ON public.waste_listings FOR UPDATE
  TO authenticated
  USING (generator_id = auth.uid() OR public.is_admin())
  WITH CHECK (generator_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Generators can delete their own listings" ON public.waste_listings;
CREATE POLICY "Generators can delete their own listings"
  ON public.waste_listings FOR DELETE
  TO authenticated
  USING (generator_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- WASTE ANALYSIS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Generators can view analysis for their listings" ON public.waste_analysis;
CREATE POLICY "Generators can view analysis for their listings"
  ON public.waste_analysis FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.waste_listings
      WHERE public.waste_listings.id = waste_analysis.waste_listing_id
      AND public.waste_listings.generator_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Generators or admin can manage analysis for their listings" ON public.waste_analysis;
CREATE POLICY "Generators or admin can manage analysis for their listings"
  ON public.waste_analysis FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.waste_listings
      WHERE public.waste_listings.id = waste_analysis.waste_listing_id
      AND public.waste_listings.generator_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Generators or admin can update analysis" ON public.waste_analysis;
CREATE POLICY "Generators or admin can update analysis"
  ON public.waste_analysis FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.waste_listings
      WHERE public.waste_listings.id = waste_analysis.waste_listing_id
      AND public.waste_listings.generator_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Generators or admin can delete analysis" ON public.waste_analysis;
CREATE POLICY "Generators or admin can delete analysis"
  ON public.waste_analysis FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.waste_listings
      WHERE public.waste_listings.id = waste_analysis.waste_listing_id
      AND public.waste_listings.generator_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- VALORIZATION OPTIONS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Generators can view valorization for their listings" ON public.valorization_options;
CREATE POLICY "Generators can view valorization for their listings"
  ON public.valorization_options FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.waste_listings
      WHERE public.waste_listings.id = valorization_options.waste_listing_id
      AND public.waste_listings.generator_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Generators or admin can insert valorization" ON public.valorization_options;
CREATE POLICY "Generators or admin can insert valorization"
  ON public.valorization_options FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.waste_listings
      WHERE public.waste_listings.id = valorization_options.waste_listing_id
      AND public.waste_listings.generator_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Generators or admin can update valorization" ON public.valorization_options;
CREATE POLICY "Generators or admin can update valorization"
  ON public.valorization_options FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.waste_listings
      WHERE public.waste_listings.id = valorization_options.waste_listing_id
      AND public.waste_listings.generator_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Generators or admin can delete valorization" ON public.valorization_options;
CREATE POLICY "Generators or admin can delete valorization"
  ON public.valorization_options FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.waste_listings
      WHERE public.waste_listings.id = valorization_options.waste_listing_id
      AND public.waste_listings.generator_id = auth.uid()
    )
    OR public.is_admin()
  );

-- ------------------------------------------------------------------------------
-- BUYER REQUIREMENTS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Buyers and marketplace users can view requirements" ON public.buyer_requirements;
CREATE POLICY "Buyers and marketplace users can view requirements"
  ON public.buyer_requirements FOR SELECT
  TO authenticated
  USING (
    buyer_id = auth.uid()
    OR status = 'active'
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Buyers can create requirements" ON public.buyer_requirements;
CREATE POLICY "Buyers can create requirements"
  ON public.buyer_requirements FOR INSERT
  TO authenticated
  WITH CHECK (
    (buyer_id = auth.uid() AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('buyer', 'admin')))
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Buyers can update their own requirements" ON public.buyer_requirements;
CREATE POLICY "Buyers can update their own requirements"
  ON public.buyer_requirements FOR UPDATE
  TO authenticated
  USING (buyer_id = auth.uid() OR public.is_admin())
  WITH CHECK (buyer_id = auth.uid() OR public.is_admin());

DROP POLICY IF EXISTS "Buyers can delete their own requirements" ON public.buyer_requirements;
CREATE POLICY "Buyers can delete their own requirements"
  ON public.buyer_requirements FOR DELETE
  TO authenticated
  USING (buyer_id = auth.uid() OR public.is_admin());

-- ------------------------------------------------------------------------------
-- MATCHES POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Participants can view matches" ON public.matches;
CREATE POLICY "Participants can view matches"
  ON public.matches FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.waste_listings wl
      WHERE wl.id = matches.waste_listing_id AND wl.generator_id = auth.uid()
    )
    OR EXISTS (
      SELECT 1 FROM public.buyer_requirements br
      WHERE br.id = matches.buyer_requirement_id AND br.buyer_id = auth.uid()
    )
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins can manage matches" ON public.matches;
CREATE POLICY "Admins can manage matches"
  ON public.matches FOR ALL
  TO authenticated
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- ------------------------------------------------------------------------------
-- REQUESTS POLICIES
-- ------------------------------------------------------------------------------
DROP POLICY IF EXISTS "Participants can view requests" ON public.requests;
CREATE POLICY "Participants can view requests"
  ON public.requests FOR SELECT
  TO authenticated
  USING (
    sender_id = auth.uid()
    OR receiver_id = auth.uid()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Authorized users can create requests" ON public.requests;
CREATE POLICY "Authorized users can create requests"
  ON public.requests FOR INSERT
  TO authenticated
  WITH CHECK (
    (sender_id = auth.uid() AND sender_id <> receiver_id)
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Participants can update request status" ON public.requests;
CREATE POLICY "Participants can update request status"
  ON public.requests FOR UPDATE
  TO authenticated
  USING (
    sender_id = auth.uid()
    OR receiver_id = auth.uid()
    OR public.is_admin()
  );

DROP POLICY IF EXISTS "Admins or senders can delete requests" ON public.requests;
CREATE POLICY "Admins or senders can delete requests"
  ON public.requests FOR DELETE
  TO authenticated
  USING (sender_id = auth.uid() OR public.is_admin());
