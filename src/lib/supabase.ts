export const SUPABASE_URL = "https://YOUR_ACTUAL_PROJECT_ID.supabase.co";
export const SUPABASE_ANON_KEY = "YOUR_ACTUAL_ANON_KEY_HERE";

export const supabase = {
  from(table: string) {
    return {
      async select(columns: string = "*") {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=${columns}`, {
            headers: {
              "apikey": SUPABASE_ANON_KEY,
              "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
            },
          });
          const data = await res.json();
          if (!res.ok) return { data: null, error: data };
          return { data, error: null };
        } catch (err: any) {
          return { data: null, error: err };
        }
      },
      async insert(rows: any[]) {
        try {
          const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "apikey": SUPABASE_ANON_KEY,
              "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
              "Prefer": "return=minimal"
            },
            body: JSON.stringify(rows),
          });
          if (!res.ok) {
            const errData = await res.json();
            return { data: null, error: errData };
          }
          return { data: null, error: null };
        } catch (err: any) {
          return { data: null, error: err };
        }
      },
      order(column: string, { ascending }: { ascending: boolean }) {
        return {
          async then(callback: any) {
            try {
              const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*&order=${column}.${ascending ? 'asc' : 'desc'}`, {
                headers: {
                  "apikey": SUPABASE_ANON_KEY,
                  "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
                },
              });
              const data = await res.json();
              if (!res.ok) return callback({ data: null, error: data });
              return callback({ data, error: null });
            } catch (err: any) {
              return callback({ data: null, error: err });
            }
          }
        };
      }
    };
  }
};