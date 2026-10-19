# Khyron Devs — Brevo + Zoho Mail Integration & Workflow Guide

This document specifies the architecture, email templates, and step-by-step developer workflows for handling client inquiries at Khyron Devs (`khyrondevs.com`).

---

## 1. System Architecture Overview

```
[ Visitor on khyrondevs.com/contact ]
                 │
                 ▼ Submits Contact Form
       [ Next.js /api/contact ]
                 │
                 ▼ Dual Dispatch via Brevo REST API (POST /v3/smtp/email)
       ┌─────────┴────────────────────────┐
       ▼                                  ▼
[ Occasion 1: Client Confirmation ]   [ Occasion 2: Dev Team Intake Dossier ]
To: enquirer's email                 To: enquiries@khyrondevs.com (Zoho Mail Group)
Reply-To: enquiries@khyrondevs.com    Reply-To: enquirer's email
                                                  │
                                                  ▼
                                      [ Zoho Mail Webmail / App ]
                                      Developers review inquiry brief
                                                  │
                                                  ▼ Reply to enquirer
                                      [ Occasion 3: Developer Reply ]
                                      - Embeds developer's reply message
                                      - Embeds engineer signature
                                      - Preserves original inquiry brief
```

---

## 2. The 3 Occasions & Templates

| Occasion | Purpose | Recipient | Sender | Brevo Template ID |
|---|---|---|---|---|
| **1. Client Auto-Confirmation** | Immediate reassurance, project recap, SLA roadmap (24–48h) | Enquirer (`body.email`) | `Khyron Devs <enquiries@khyrondevs.com>` | `BREVO_CLIENT_TEMPLATE_ID=1` |
| **2. Dev Team Intake Dossier** | High-density brief, WhatsApp 1-click link, structured scope | `enquiries@khyrondevs.com` | `Khyron Devs Inquiries <enquiries@khyrondevs.com>` | `BREVO_TEAM_TEMPLATE_ID=2` |
| **3. Developer Reply with Dossier** | Architect's response, signature, preserving original inquiry | Enquirer | `Khyron Devs <enquiries@khyrondevs.com>` | `BREVO_REPLY_TEMPLATE_ID=3` / Zoho Mail Template |

---

## 3. Replying to Inquiries: Two Simple Workflows

When a developer receives an inquiry in Zoho Mail, there are two ways to reply:

### Workflow A (Recommended): 1-Click Branded Reply Studio
Standard email clients (Zoho Mail, Gmail) cannot automatically wrap your raw typed replies in custom HTML templates. To make replying effortless:
1. Open the inquiry in Zoho Mail.
2. Click the prominent button at the bottom: **`⚡ Open 1-Click Reply Studio (Template 3)`**.
3. A private Studio page opens with the client's information pre-filled.
4. Select or enter your name and title (e.g., *Vittal • Lead Systems & Full-Stack Architect*).
5. Pick a quick preset or type your response.
6. Click **`Dispatch Branded Reply`**.
7. The system calls Brevo API (`POST /v3/smtp/email`) and delivers **Template 3** directly to the client with your signature and their original inquiry dossier attached!

---

### Workflow B: Direct Reply inside Zoho Mail Webmail
If you prefer to reply directly inside Zoho Mail:
1. Open the inquiry in Zoho Mail and click **Reply**.
2. Because Template 2 is designed with a **Quote-Safe Dossier**, the quoted text below your reply will cleanly display only the client's recorded project scope and budget (no internal developer telemetry or buttons).
3. Optionally, you can insert the pre-saved **Zoho Mail Template** below to wrap your response in full branding:

#### Setup: 1-Click Template in Zoho Mail

### Step 1: Create the Template in Zoho Mail
1. Open [Zoho Mail](https://mail.zoho.com).
2. Click the **Gear icon (Settings)** in the top right.
3. Navigate to **Mail** &rarr; **Templates** (or compose a new message and click the **Templates** icon).
4. Click **+ Add Template**.
5. Name the template: `Khyron Devs - Client Reply with Dossier`.
6. Click the **Code View / HTML (`</>`)** button in the rich text editor.
7. Paste the following HTML snippet:

```html
<table style="width: 100%; max-width: 620px; margin: 0 auto; background: #0c0f1a; border: 1px solid rgba(255, 255, 255, 0.12); border-radius: 16px; overflow: hidden; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9; box-shadow: 0 20px 45px rgba(0, 0, 0, 0.7);">
  <!-- Header -->
  <tr>
    <td style="background: linear-gradient(135deg, #090d16 0%, #1e1b4b 50%, #0369a1 100%); padding: 28px 36px; border-bottom: 1px solid rgba(255, 255, 255, 0.12);">
      <div style="display: inline-block; font-family: monospace; font-size: 11px; font-weight: 700; background: rgba(129, 140, 248, 0.2); color: #818cf8; padding: 4px 12px; border-radius: 999px; border: 1px solid rgba(129, 140, 248, 0.4); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px;">
        KHYRON DEVS &bull; ENGINEERING RESPONSE
      </div>
      <h1 style="margin: 0; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.02em;">
        Following Up on Your Project Brief
      </h1>
    </td>
  </tr>

  <!-- Reply Content -->
  <tr>
    <td style="padding: 32px 36px; background-color: #0c0f1a;">
      <p style="margin: 0 0 16px 0; font-size: 15px; line-height: 1.6; color: #f8fafc;">
        Hi <strong style="color: #38bdf8;">[CLIENT_NAME]</strong>,
      </p>

      <!-- Type your response here -->
      <div style="font-size: 14px; line-height: 1.7; color: #e2e8f0; margin-bottom: 28px;">
        [TYPE YOUR RESPONSE HERE]
      </div>

      <!-- Engineer Signature Card -->
      <div style="padding: 16px 20px; background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; margin-bottom: 32px;">
        <div style="font-weight: 700; color: #ffffff; font-size: 14px;">[ENGINEER_NAME]</div>
        <div style="font-size: 12px; color: #818cf8; font-family: monospace; margin-top: 2px;">Lead Systems & Full-Stack Architect &bull; Khyron Devs</div>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 8px; font-family: monospace;">
          Web: <a href="https://khyrondevs.com" style="color: #38bdf8; text-decoration: none;">khyrondevs.com</a> &bull; Email: <a href="mailto:enquiries@khyrondevs.com" style="color: #38bdf8; text-decoration: none;">enquiries@khyrondevs.com</a>
        </div>
      </div>

      <!-- Quoted Original Dossier -->
      <div style="background: #060810; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px 24px;">
        <div style="border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 8px; margin-bottom: 12px;">
          <span style="font-family: monospace; font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.08em;">
            ORIGINAL INQUIRY ARCHIVE // CONTEXT
          </span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-bottom: 12px;">
          <tr>
            <td style="padding: 4px 0; color: #64748b; font-family: monospace; width: 110px;">Entity:</td>
            <td style="padding: 4px 0; color: #cbd5e1;">[COMPANY_NAME]</td>
          </tr>
          <tr>
            <td style="padding: 4px 0; color: #64748b; font-family: monospace;">Budget:</td>
            <td style="padding: 4px 0; color: #38bdf8; font-family: monospace; font-weight: 600;">[SELECTED_BUDGET]</td>
          </tr>
        </table>

        <div>
          <div style="font-family: monospace; font-size: 10px; color: #64748b; text-transform: uppercase; margin-bottom: 4px;">Original Scope:</div>
          <div style="font-size: 13px; line-height: 1.55; color: #94a3b8; font-style: italic; border-left: 2px solid rgba(56, 189, 248, 0.4); padding-left: 10px;">
            &ldquo;[ORIGINAL_MESSAGE]&rdquo;
          </div>
        </div>
      </div>
    </td>
  </tr>

  <!-- Footer -->
  <tr>
    <td style="padding: 18px 36px; background: #060810; border-top: 1px solid rgba(255, 255, 255, 0.08); font-size: 11px; color: #64748b; font-family: monospace;">
      Delivered directly via Khyron Devs Communication Relay &bull; Reply to this email to continue the conversation.
    </td>
  </tr>
</table>
```
8. Save the template.

### Step 2: Replying to an Inquiry in Zoho Mail
1. Open the inquiry in the `enquiries@khyrondevs.com` folder or group.
2. Click **Reply** (the `To:` field will automatically be set to the client's email thanks to the `Reply-To` header).
3. Click the **Templates** icon in the Zoho Mail composer and select `Khyron Devs - Client Reply with Dossier`.
4. Replace `[CLIENT_NAME]`, `[TYPE YOUR RESPONSE HERE]`, and paste the client's original scope into the quote card.
5. Click **Send**.

---

## 4. Engineer Signature for Zoho Mail

To set up your official signature in Zoho Mail:

1. In Zoho Mail, go to **Settings** &rarr; **Signatures** &rarr; **+ Add new signature**.
2. Switch to **HTML Code View** (`</>`) and paste:

```html
<table style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; font-size: 13px; color: #334155; line-height: 1.4; border-top: 2px solid #0284c7; padding-top: 10px; margin-top: 14px;">
  <tr>
    <td style="vertical-align: top; padding-right: 14px;">
      <div style="font-size: 15px; font-weight: 700; color: #0f172a;">Khyron Devs Team</div>
      <div style="font-size: 12px; color: #0284c7; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 2px;">Software Engineering &amp; Distributed Systems</div>
      <div style="font-size: 12px; color: #64748b; margin-top: 6px;">
        🌐 <a href="https://khyrondevs.com" style="color: #0284c7; text-decoration: none;">khyrondevs.com</a> &nbsp;|&nbsp; ✉️ <a href="mailto:enquiries@khyrondevs.com" style="color: #0284c7; text-decoration: none;">enquiries@khyrondevs.com</a>
      </div>
    </td>
  </tr>
</table>
```

---

## 5. Maintenance & CLI Commands

### Synchronizing Brevo Templates
Whenever changes are made to template designs in `lib/email-templates.ts`, update the registered templates in Brevo by running:

```bash
npm run email:sync
```

### Testing the Pipeline
To verify delivery across all 3 occasions:

```bash
# Tests delivery using the test recipient
npm run email:test

# Tests delivery to a specific custom email address
npm run email:test -- client@example.com
```

---

## 6. DNS & Deliverability Checklist

To ensure 100% inbox placement (avoiding spam/junk folders):

- [x] **SPF Record:** Configured in domain DNS including `include:spf.brevo.com` and `include:zoho.in`.
- [x] **DKIM Record:** Configured for `khyrondevs.com` in both Brevo and Zoho Mail dashboards.
- [x] **DMARC Record:** Configured as `v=DMARC1; p=none; rua=mailto:enquiries@khyrondevs.com`.
- [x] **Sender Authenticity:** `enquiries@khyrondevs.com` verified as valid mailbox in Zoho Mail.
