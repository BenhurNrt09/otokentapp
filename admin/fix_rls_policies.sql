-- Fix RLS Policies for Advertisements and Content Management
-- This adds missing admin CRUD permissions for advertisements table

-- ============================================================================
-- ADVERTISEMENTS - Add Admin CRUD Policies
-- ============================================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Admins can insert advertisements" ON advertisements;
DROP POLICY IF EXISTS "Admins can update advertisements" ON advertisements;
DROP POLICY IF EXISTS "Admins can delete advertisements" ON advertisements;

-- Add INSERT policy for admins
CREATE POLICY "Admins can insert advertisements" 
ON advertisements 
FOR INSERT 
WITH CHECK (is_admin());

-- Add UPDATE policy for admins
CREATE POLICY "Admins can update advertisements" 
ON advertisements 
FOR UPDATE 
USING (is_admin());

-- Add DELETE policy for admins
CREATE POLICY "Admins can delete advertisements" 
ON advertisements 
FOR DELETE 
USING (is_admin());

-- ============================================================================
-- FAQs - Ensure Admin CRUD Policies Exist
-- ============================================================================

DROP POLICY IF EXISTS "Admins can insert faqs" ON faqs;
DROP POLICY IF EXISTS "Admins can update faqs" ON faqs;
DROP POLICY IF EXISTS "Admins can delete faqs" ON faqs;

CREATE POLICY "Admins can insert faqs" ON faqs FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update faqs" ON faqs FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete faqs" ON faqs FOR DELETE USING (is_admin());

-- ============================================================================
-- POLICIES - Ensure Admin CRUD Policies Exist
-- ============================================================================

DROP POLICY IF EXISTS "Admins can insert policies" ON policies;
DROP POLICY IF EXISTS "Admins can update policies" ON policies;
DROP POLICY IF EXISTS "Admins can delete policies" ON policies;

CREATE POLICY "Admins can insert policies" ON policies FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update policies" ON policies FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete policies" ON policies FOR DELETE USING (is_admin());

-- ============================================================================
-- NOTIFICATIONS - Ensure Admin CRUD Policies Exist
-- ============================================================================

DROP POLICY IF EXISTS "Admins can insert notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can update notifications" ON notifications;
DROP POLICY IF EXISTS "Admins can delete notifications" ON notifications;

CREATE POLICY "Admins can insert notifications" ON notifications FOR INSERT WITH CHECK (is_admin());
CREATE POLICY "Admins can update notifications" ON notifications FOR UPDATE USING (is_admin());
CREATE POLICY "Admins can delete notifications" ON notifications FOR DELETE USING (is_admin());
