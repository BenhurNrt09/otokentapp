-- Function to allow admins to send messages as 'OtoKent Support'
CREATE OR REPLACE FUNCTION public.send_support_message(
    p_receiver_id UUID,
    p_content TEXT,
    p_media_url TEXT DEFAULT NULL,
    p_message_type TEXT DEFAULT 'support'
)
RETURNS UUID AS $$
DECLARE
    v_message_id UUID;
    v_support_id UUID := '00000000-0000-0000-0000-000000000001';
BEGIN
    -- Check if the executor is an admin
    -- We use is_admin() function which checks auth.uid() against users table
    IF NOT public.is_admin() THEN
        RAISE EXCEPTION 'Yetkisiz işlem: Sadece yöneticiler destek mesajı gönderebilir.';
    END IF;

    -- Insert message with fixed Support Sender ID
    INSERT INTO public.messages (
        sender_id,
        receiver_id,
        content,
        media_url,
        message_type,
        is_read
    ) VALUES (
        v_support_id,
        p_receiver_id,
        p_content,
        p_media_url,
        p_message_type,
        false
    )
    RETURNING id INTO v_message_id;

    RETURN v_message_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
