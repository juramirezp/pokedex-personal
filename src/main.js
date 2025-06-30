import { createApp } from 'vue'
import App from './App.vue'
import './index.css'
import { createClient } from '@supabase/supabase-js'
import { createPinia } from 'pinia'

// Configuración de Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseKey);

const app = createApp(App)
app.use(createPinia())
app.mount('#app')
