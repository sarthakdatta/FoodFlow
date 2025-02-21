import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event: Stripe.Event;

  // Verify Stripe event is legit
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature || "",
      webhookSecret
    );
  } catch (err: any) {
    console.error(`Webhook signature verification failed. ${err.message}`);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutSessionCompleted(session);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        await handleInvoicePaymentFailed(invoice);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }
  } catch (e: any) {
    console.error(`Stripe webhook error: ${e.message} | EVENT TYPE: ${event.type}`);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

const handleCheckoutSessionCompleted = async (
  session: Stripe.Checkout.Session
) => {
  const userId = session.metadata?.clerkUserId;
  console.log("Handling checkout.session.completed for user:", userId);

  if (!userId) {
    console.error("No userId found in session metadata.");
    return;
  }

  const subscriptionId = session.subscription as string;
  console.log("Subscription ID:", subscriptionId);

  if (!subscriptionId) {
    console.error("No subscription ID found in session.");
    return;
  }

  try {
    console.log("Updating profile for user:", userId);
    const updatedProfile = await prisma.profile.update({
      where: { userId },
      data: {
        stripeSubscriptionId: subscriptionId,
        subscriptionActive: true, // Activate subscription
        subscriptionTier: session.metadata?.planType || null,
      },
    });
    console.log("Updated profile:", updatedProfile);
    console.log(`Subscription activated for user: ${userId}`);
  } catch (error: any) {
    console.error("Prisma Update Error:", error.message);
    console.error("Error details:", error);
    throw new Error("Failed to update profile with subscription details.");
  }
};

// Handler for failed invoice payments
const handleInvoicePaymentFailed = async (invoice: Stripe.Invoice) => {
  const subscriptionId = invoice.subscription as string;
  console.log("Handling invoice.payment_failed for subscription:", subscriptionId);

  if (!subscriptionId) {
    console.error("No subscription ID found in invoice.");
    return;
  }

  try {
    // Find the user's profile using the subscription ID
    const profile = await prisma.profile.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true },
    });

    if (!profile?.userId) {
      console.error("No profile found for this subscription ID.");
      return;
    }

    // Update the user's profile to deactivate the subscription
    await prisma.profile.update({
      where: { userId: profile.userId },
      data: {
        subscriptionActive: false, // Deactivate subscription
      },
    });
    console.log(`Subscription payment failed for user: ${profile.userId}`);
  } catch (error: any) {
    console.error("Prisma Query or Update Error:", error.message);
    throw new Error("Failed to handle payment failure.");
  }
};

// Handler for subscription deletions (e.g., cancellations)
const handleSubscriptionDeleted = async (subscription: Stripe.Subscription) => {
  const subscriptionId = subscription.id;
  console.log("Handling customer.subscription.deleted for subscription:", subscriptionId);

  try {
    // Find the user's profile using the subscription ID
    const profile = await prisma.profile.findUnique({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true },
    });

    if (!profile?.userId) {
      console.error("No profile found for this subscription ID.");
      return;
    }

    // Update the user's profile to deactivate the subscription
    await prisma.profile.update({
      where: { userId: profile.userId },
      data: {
        subscriptionActive: false, // Deactivate subscription
        stripeSubscriptionId: null, // Clear the subscription ID
      },
    });
    console.log(`Subscription canceled for user: ${profile.userId}`);
  } catch (error: any) {
    console.error("Prisma Query or Update Error:", error.message);
    throw new Error("Failed to handle subscription deletion.");
  }
};