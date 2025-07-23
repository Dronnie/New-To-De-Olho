import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bsjaqivqdrrjznjfpaub.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzamFxaXZxZHJyanpuamZwYXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTMxMzQ3NzUsImV4cCI6MjA2ODcxMDc3NX0.lPMq4iGDeR_JvJarjMRkxqFY_FoxIMoZ1BOGe4qpdqk';

export const supabase = createClient(supabaseUrl, supabaseKey);
