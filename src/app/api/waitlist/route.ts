import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { WaitlistEmail } from './email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // 1. Notify you (the admin)
    const adminNotification = resend.emails.send({
      from: 'PostGlee <onboarding@resend.dev>', // Note: Once you verify your domain, change this to something like 'PostGlee <hello@postglee.com>'
      to: 'winninggodspower@gmail.com',
      subject: 'New Waitlist Signup',
      html: `<p>You have a new waitlist signup: <strong>${email}</strong>!</p>`
    });

    // 2. Add the user to your Resend Contacts (and optionally a Segment)
    const segmentId = process.env.RESEND_SEGMENT_ID;
    
    // Create the contact (this adds them to your global Contacts list)
    let contactPromise = resend.contacts.create({
      email: email,
      unsubscribed: false,
    }).then(() => {
      // If you provided a Segment ID in .env, add the contact to that specific segment
      if (segmentId) {
        return resend.contacts.segments.add({
          email: email,
          segmentId: segmentId,
        });
      }
    });

    // 3. Send confirmation to the user
    const userConfirmation = resend.emails.send({
      from: 'PostGlee <onboarding@resend.dev>', // Must be from your verified domain (e.g., PostGlee <hello@postglee.com>) to send to arbitrary emails
      to: email,
      subject: 'Welcome to the PostGlee Waitlist! 🎉',
      react: WaitlistEmail(),
    });

    // Run all requests in parallel
    const [adminData, _, userData] = await Promise.all([adminNotification, contactPromise, userConfirmation]);

    return NextResponse.json({ success: true, adminData, userData });
  } catch (error) {
    console.error('Waitlist error:', error);
    return NextResponse.json({ error: 'Failed to join waitlist' }, { status: 500 });
  }
}
