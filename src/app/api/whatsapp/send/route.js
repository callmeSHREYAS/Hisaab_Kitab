// src/app/api/whatsapp/send/route.js
// -------------------------------------------------------
// Sends a WhatsApp payment reminder via Twilio API.
// The frontend sends: customerId, templateId, language
// This route fetches customer data, fills the template, and sends it.
// -------------------------------------------------------

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Customer from '@/models/Customer'
import User from '@/models/User'
import { TEMPLATES, fillTemplate } from '@/lib/whatsappTemplates'
import twilio from 'twilio'

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { customerId, templateId, language } = await request.json()

    await connectDB()

    // Fetch customer and verify they belong to this user
    const customer = await Customer.findOne({
      _id: customerId,
      userId: session.user.id,
    })

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 })
    }

    // Fetch business owner's name
    const owner = await User.findById(session.user.id)

    // Find the selected template
    const langTemplates = TEMPLATES[language] || TEMPLATES['en']
    const template = langTemplates.find((t) => t.id === templateId) || langTemplates[0]

    // Replace placeholders in the template
    const message = fillTemplate(template.message, {
      name: customer.name,
      amount: customer.pendingAmount,
      business: owner.businessName || session.user.name + "'s Business",
    })

    // --- Send via Twilio ---
    // NOTE: In Twilio sandbox, you must format numbers as "whatsapp:+91XXXXXXXXXX"
    // The customer's number must have joined your sandbox first (they send "join <keyword>")

    const twilioClient = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    )

    const twilioMessage = await twilioClient.messages.create({
      from: process.env.TWILIO_WHATSAPP_NUMBER,       // Your Twilio WhatsApp number
      to: `whatsapp:${customer.phone}`,                // Customer's WhatsApp
      body: message,
    })

    console.log('WhatsApp sent! SID:', twilioMessage.sid)

    return NextResponse.json({
      success: true,
      messageSid: twilioMessage.sid,
      preview: message, // Return the message so frontend can show a preview
    })
  } catch (error) {
    console.error('WhatsApp send error:', error)

    // Twilio-specific errors have a code field
    if (error.code === 21211) {
      return NextResponse.json({ error: 'Invalid phone number format' }, { status: 400 })
    }

    return NextResponse.json(
      { error: error.message || 'Failed to send WhatsApp message' },
      { status: 500 }
    )
  }
}
