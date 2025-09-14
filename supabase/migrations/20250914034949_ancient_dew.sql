/*
  # Realtime Setup

  1. Enable Realtime
    - Enable realtime on all relevant tables
    - Configure realtime policies for live updates

  2. Functions
    - Story cleanup function for expired stories
    - Notification creation functions
*/

-- Enable realtime on tables that need live updates
ALTER PUBLICATION supabase_realtime ADD TABLE profiles;
ALTER PUBLICATION supabase_realtime ADD TABLE posts;
ALTER PUBLICATION supabase_realtime ADD TABLE post_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE post_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE stories;
ALTER PUBLICATION supabase_realtime ADD TABLE clips;
ALTER PUBLICATION supabase_realtime ADD TABLE clip_likes;
ALTER PUBLICATION supabase_realtime ADD TABLE room_chats;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Function to clean up expired stories
CREATE OR REPLACE FUNCTION public.cleanup_expired_stories()
RETURNS void AS $$
BEGIN
  -- Delete expired stories from database
  DELETE FROM stories WHERE expires_at <= now();
  
  -- Note: In production, you'd also want to delete the associated storage files
  -- This would require a more complex function that queries the storage API
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
  target_user_id uuid,
  notification_type text,
  notification_title text,
  notification_message text,
  notification_data jsonb DEFAULT '{}'
)
RETURNS uuid AS $$
DECLARE
  notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (target_user_id, notification_type, notification_title, notification_message, notification_data)
  RETURNING id INTO notification_id;
  
  RETURN notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to handle post likes and create notifications
CREATE OR REPLACE FUNCTION public.handle_post_like()
RETURNS trigger AS $$
DECLARE
  post_owner_id uuid;
  post_caption text;
BEGIN
  -- Get post owner and caption
  SELECT user_id, caption INTO post_owner_id, post_caption
  FROM posts WHERE id = NEW.post_id;
  
  -- Don't notify if user likes their own post
  IF post_owner_id != NEW.user_id THEN
    -- Create notification for post owner
    PERFORM public.create_notification(
      post_owner_id,
      'like',
      'New Like',
      'Someone liked your post',
      jsonb_build_object(
        'post_id', NEW.post_id,
        'liker_id', NEW.user_id,
        'post_caption', post_caption
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for post likes
CREATE TRIGGER on_post_like_created
  AFTER INSERT ON post_likes
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_like();

-- Function to handle post comments and create notifications
CREATE OR REPLACE FUNCTION public.handle_post_comment()
RETURNS trigger AS $$
DECLARE
  post_owner_id uuid;
  post_caption text;
BEGIN
  -- Get post owner and caption
  SELECT user_id, caption INTO post_owner_id, post_caption
  FROM posts WHERE id = NEW.post_id;
  
  -- Don't notify if user comments on their own post
  IF post_owner_id != NEW.user_id THEN
    -- Create notification for post owner
    PERFORM public.create_notification(
      post_owner_id,
      'comment',
      'New Comment',
      'Someone commented on your post',
      jsonb_build_object(
        'post_id', NEW.post_id,
        'commenter_id', NEW.user_id,
        'comment_content', NEW.content,
        'post_caption', post_caption
      )
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for post comments
CREATE TRIGGER on_post_comment_created
  AFTER INSERT ON post_comments
  FOR EACH ROW EXECUTE FUNCTION public.handle_post_comment();