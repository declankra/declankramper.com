// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

let cachedSupabase: ReturnType<typeof createClient<any>> | null = null;
let cachedResend: Resend | null = null;

function getSupabaseClient() {
  if (cachedSupabase) return cachedSupabase;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    return null;
  }

  cachedSupabase = createClient(supabaseUrl, supabaseServiceKey);
  return cachedSupabase;
}

function getResendClient() {
  if (cachedResend) return cachedResend;

  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    return null;
  }

  cachedResend = new Resend(resendApiKey);
  return cachedResend;
}

function validatePayload(payload: unknown): { name: string; message: string } | null {
  if (!payload || typeof payload !== 'object') return null;

  const parsedPayload = payload as Record<string, unknown>;
  const nameValue = parsedPayload.name;
  const messageValue = parsedPayload.message;

  const name = typeof nameValue === 'string' ? nameValue.trim() : '';
  const message = typeof messageValue === 'string' ? messageValue.trim() : '';

  if (!name || !message) return null;
  if (name.length > 120 || message.length > 5000) return null;

  return { name, message };
}

export async function POST(request: Request) {
  const supabase = getSupabaseClient();
  const resend = getResendClient();

  if (!supabase || !resend) {
    return NextResponse.json(
      { error: 'Contact service is not configured' },
      { status: 500 }
    );
  }

  const rawPayload = await request.json().catch(() => null);
  const validatedPayload = validatePayload(rawPayload);

  if (!validatedPayload) {
    return NextResponse.json(
      { error: 'Name and message are required' },
      { status: 400 }
    );
  }

  const { name, message } = validatedPayload;

  try {
    const { error } = await supabase
      .from('portfolio_contact')
      .insert([{ name, message, created_at: new Date().toISOString() }]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to store contact submission' },
        { status: 500 }
      );
    }

    try {
      await resend.emails.send({
        from: 'Portfolio Contact <business@dkbuilds.co>',
        to: 'declankramper@gmail.com',
        subject: `New portfolio contact from ${name}`,
        text: `Name: ${name}\nMessage: ${message}\nSubmitted at: ${new Date().toISOString()}`,
      });
    } catch (emailError) {
      // Do not fail the request if the email provider is unavailable.
      console.error('Resend error:', emailError);
    }

    return NextResponse.json(
      { success: true, message: 'Contact form submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
