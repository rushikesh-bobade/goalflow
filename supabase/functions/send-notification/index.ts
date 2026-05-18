// @ts-nocheck
import { serve } from "https://deno.land/std@0.192.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const MS_TEAMS_WEBHOOK_URL = Deno.env.get("MS_TEAMS_WEBHOOK_URL");

serve(async (req) => {
  try {
    const payload = await req.json();

    // Only process UPDATE events for goals
    if (payload.type !== "UPDATE" || payload.table !== "goals") {
      return new Response("Not a goal update", { status: 200 });
    }

    const newGoal = payload.record;
    const oldGoal = payload.old_record;

    // We only care if the status changed
    if (newGoal.status === oldGoal.status) {
      return new Response("Status unchanged", { status: 200 });
    }

    const status = newGoal.status;
    let title = "";
    let message = "";

    if (status === "submitted") {
      title = "Goals Submitted for Approval";
      message = `A team member has submitted their goals for the upcoming cycle. Please review them in the GoalFlow portal.`;
    } else if (status === "approved") {
      title = "Goals Approved!";
      message = `Your manager has approved your goals. They are now locked for the quarter.`;
    } else if (status === "rework") {
      title = "Goals Returned for Rework";
      message = `Your manager has requested changes to your goals. Please review their feedback and resubmit.`;
    } else {
      return new Response("Ignored status", { status: 200 });
    }

    const actionUrl = `https://goalflow-atomberg.vercel.app`;

    const promises = [];

    // 1. Send MS Teams Message (Bonus 5.2)
    if (MS_TEAMS_WEBHOOK_URL) {
      const teamsPayload = {
        "@type": "MessageCard",
        "@context": "http://schema.org/extensions",
        "themeColor": "FF6B2B",
        "summary": title,
        "sections": [{
          "activityTitle": title,
          "activitySubtitle": "AtomQuest Notifications",
          "text": message,
          "markdown": true
        }],
        "potentialAction": [{
          "@type": "OpenUri",
          "name": "View in GoalFlow",
          "targets": [{ "os": "default", "uri": actionUrl }]
        }]
      };

      promises.push(
        fetch(MS_TEAMS_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(teamsPayload)
        })
      );
    }

    // 2. Send Email via Resend (Bonus 5.2)
    // Note: We need user emails, but for the hackathon we can simulate by sending to a generic/test address
    // since the webhook payload only contains UUIDs, not the actual email strings.
    if (RESEND_API_KEY) {
      promises.push(
        fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${RESEND_API_KEY}`
          },
          body: JSON.stringify({
            from: "AtomQuest Notifications <notifications@goalflow.com>",
            to: ["test@example.com"], // Hardcoded for demo
            subject: title,
            html: `<h2>${title}</h2><p>${message}</p><a href="${actionUrl}">Open Portal</a>`
          })
        })
      );
    }

    await Promise.all(promises);

    return new Response(JSON.stringify({ success: true }), {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    return new Response(String(err), { status: 500 });
  }
});
