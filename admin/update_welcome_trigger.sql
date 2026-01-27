-- Update handle_new_user to send welcome message
-- This requires the Support User (00000000-0000-0000-0000-000000000001) to exist.

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- 1. Create public user
  INSERT INTO public.users (id, email, name, surname, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'surname', ''),
    'user'
  );

  -- 2. Send Welcome Message from Support
  INSERT INTO public.messages (sender_id, receiver_id, content, message_type, is_read)
  VALUES (
    '00000000-0000-0000-0000-000000000001', -- Support User ID
    NEW.id,                               -- Receiver: New User
    'OtoKent''e Hoşgeldiniz!

Türkiye''nin en güvenilir araç alım satım platformundasınız.

Buradan ilan verebilir, beğendiğiniz araçları favorilere ekleyebilir ve satıcılarla güvenli bir şekilde iletişime geçebilirsiniz.

Herhangi bir sorunuz, öneriniz veya yardıma ihtiyacınız olursa bu sohbet üzerinden bize 7/24 ulaşabilirsiniz.

Keyifli alışverişler dileriz!',
    'support',
    false
  );

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
