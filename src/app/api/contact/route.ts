// src/app/api/contact/route.ts
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY!);

export async function POST(request: Request) {
  try {
    // Parse the request body
    const { name, message } = await request.json();

    // Validate required fields
    if (!name || !message) {
      return NextResponse.json(
        { error: 'Name and message are required' },
        { status: 400 }
      );
    }

    // Store in Supabase
    const { data, error } = await supabase
      .from('portfolio_contact')
      .insert([{ name, message, created_at: new Date().toISOString() }]);

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to store contact submission' },
        { status: 500 }
      );
    }

    // Send an email notification
    await resend.emails.send({
      from: 'Portfolio Contact <business@dkbuilds.co>',
      to: 'declankramper@gmail.com',
      subject: `New portfolio contact from ${name}`,
      text: `
Name: ${name}
Message: ${message}
Submitted at: ${new Date().toLocaleString()}
      `,
    });

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