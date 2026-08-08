import { createClient } from "@supabase/supabase-js";


const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);


export async function getOrCreateContact(
  phone,
  name = null
) {

  const { data: existing, error: findError } =
    await supabase
      .from("contacts")
      .select("*")
      .eq("phone", phone)
      .maybeSingle();


  if (findError) {
    throw findError;
  }


  if (existing) {
    return existing;
  }


  const { data, error } =
    await supabase
      .from("contacts")
      .insert({
        phone,
        name,
        channel: "whatsapp"
      })
      .select()
      .single();


  if (error) {
    throw error;
  }


  return data;
}


export async function saveMessage(
  contactId,
  direction,
  content
) {

  const { data, error } =
    await supabase
      .from("messages")
      .insert({
        contact_id: contactId,
        direction,
        content
      })
      .select()
      .single();


  if (error) {
    throw error;
  }


  return data;
}


export async function getConversation(
  contactId,
  limit = 10
) {

  const { data, error } =
    await supabase
      .from("messages")
      .select("direction, content, created_at")
      .eq("contact_id", contactId)
      .order("created_at", {
        ascending: false
      })
      .limit(limit);


  if (error) {
    throw error;
  }


  return data.reverse();
}