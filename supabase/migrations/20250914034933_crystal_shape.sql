/*
  # Storage Buckets Setup

  1. Storage Buckets
    - avatars - User profile pictures
    - posts - Feed post media
    - stories - Story media (auto-cleanup)
    - clips - Short-form videos
    - files - General file attachments

  2. Storage Policies
    - Public read access for all media
    - Authenticated users can upload to their own folders
    - Automatic cleanup for expired content
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('posts', 'posts', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']),
  ('stories', 'stories', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/quicktime']),
  ('clips', 'clips', true, 104857600, ARRAY['video/mp4', 'video/quicktime', 'video/webm']),
  ('files', 'files', true, 104857600, NULL)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for posts
CREATE POLICY "Post media is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'posts');

CREATE POLICY "Users can upload their own post media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'posts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own post media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'posts' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for stories
CREATE POLICY "Story media is publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'stories');

CREATE POLICY "Users can upload their own story media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'stories' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own story media"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'stories' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for clips
CREATE POLICY "Clip videos are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'clips');

CREATE POLICY "Users can upload their own clips"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'clips' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own clips"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'clips' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for files
CREATE POLICY "Files are accessible to conversation participants"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'files');

CREATE POLICY "Users can upload files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'files' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );