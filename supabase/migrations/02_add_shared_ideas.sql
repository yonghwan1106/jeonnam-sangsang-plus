-- Add is_shared column to ideas table
ALTER TABLE public.ideas ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT FALSE;

-- Create index for is_shared for better query performance
CREATE INDEX IF NOT EXISTS ideas_is_shared_idx ON public.ideas(is_shared);

-- Update RLS policy to allow viewing shared ideas
-- Drop the old policy
DROP POLICY IF EXISTS "Users can view their own ideas" ON public.ideas;

-- Create new policy that allows users to view their own ideas OR shared ideas
CREATE POLICY "Users can view their own ideas or shared ideas"
  ON public.ideas FOR SELECT
  USING (auth.uid() = user_id OR is_shared = true);

-- Policy for updating ideas remains the same (users can only update their own)
-- Policy for deleting ideas remains the same (users can only delete their own)
-- Policy for inserting ideas remains the same (users can only insert their own)

-- Update existing ideas from sanoramyun8@gmail.com to be shared
-- First, we need to find the user_id for this email
DO $$
DECLARE
  target_user_id UUID;
BEGIN
  -- Get the user_id from profiles table
  SELECT id INTO target_user_id
  FROM public.profiles
  WHERE email = 'sanoramyun8@gmail.com'
  LIMIT 1;

  -- If user exists, update their ideas to be shared
  IF target_user_id IS NOT NULL THEN
    UPDATE public.ideas
    SET is_shared = true
    WHERE user_id = target_user_id;
  END IF;
END $$;
