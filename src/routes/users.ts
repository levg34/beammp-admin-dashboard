import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

export async function get() {
    const supabaseUrl = process.env.SUPABASE_URL
    if (!supabaseUrl) return { status: 500, body: {error: 'no supabase URL'} }
    const supabaseKey = process.env.SUPABASE_KEY
    if (!supabaseKey) return { status: 500, body: {error: 'no supabase key'} }
    const supabase = createClient(supabaseUrl, supabaseKey)

    const { data: users } = await supabase.from('user').select('*')
 
    if (Array.isArray(users)) {
        return {
            body: { users }
        }
    }
 
    return {
        status: 500,
        body: {error: 'An error occured'}
    }
}