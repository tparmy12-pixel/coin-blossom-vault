
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS country text,
  ADD COLUMN IF NOT EXISTS state text,
  ADD COLUMN IF NOT EXISTS district text,
  ADD COLUMN IF NOT EXISTS pin_code text,
  ADD COLUMN IF NOT EXISTS referral_code text,
  ADD COLUMN IF NOT EXISTS referred_by uuid REFERENCES public.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS limit_amount numeric NOT NULL DEFAULT 5000;

CREATE UNIQUE INDEX IF NOT EXISTS users_referral_code_unique ON public.users(referral_code) WHERE referral_code IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  referee_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  reward_amount numeric NOT NULL DEFAULT 1000,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (referee_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.referrals TO anon, authenticated;
GRANT ALL ON public.referrals TO service_role;
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read referrals" ON public.referrals FOR SELECT USING (true);
CREATE POLICY "Anyone can insert referrals" ON public.referrals FOR INSERT WITH CHECK (true);

CREATE TABLE IF NOT EXISTS public.login_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT ON public.login_logs TO anon, authenticated;
GRANT ALL ON public.login_logs TO service_role;
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read login logs" ON public.login_logs FOR SELECT USING (true);
CREATE POLICY "Anyone can insert login logs" ON public.login_logs FOR INSERT WITH CHECK (true);
