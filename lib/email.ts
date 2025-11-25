import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

interface EmailNotificationParams {
  to: string;
  memberName: string;
  week: number;
  amount: number;
}

export async function sendEmailNotification({
  to,
  memberName,
  week,
  amount,
}: EmailNotificationParams) {
  // Only send if API key is configured
  if (!resend || !process.env.RESEND_API_KEY) {
    console.log("Email notification (mock - API key not configured):", {
      to,
      memberName,
      week,
      amount,
    });
    return { success: true, mock: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "Tabungan Kawanua <onboarding@resend.dev>",
      to: [to],
      subject: `Notifikasi: ${memberName} Menerima Arisan Minggu Ke-${week}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background: #f9fafb;
              }
              .card {
                background: white;
                border-radius: 8px;
                padding: 30px;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                border-radius: 8px 8px 0 0;
                text-align: center;
              }
              .content {
                padding: 20px;
              }
              .highlight {
                background: #f0f9ff;
                padding: 15px;
                border-left: 4px solid #3b82f6;
                margin: 20px 0;
              }
              .amount {
                font-size: 24px;
                font-weight: bold;
                color: #10b981;
              }
              .footer {
                text-align: center;
                padding: 20px;
                color: #6b7280;
                font-size: 12px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="card">
                <div class="header">
                  <h1>🎉 Notifikasi Arisan</h1>
                </div>
                <div class="content">
                  <p>Halo Admin,</p>
                  <p>Berikut adalah notifikasi penerimaan arisan:</p>
                  
                  <div class="highlight">
                    <p><strong>Anggota:</strong> ${memberName}</p>
                    <p><strong>Minggu Ke:</strong> ${week}</p>
                    <p><strong>Jumlah:</strong> <span class="amount">Rp ${amount.toLocaleString("id-ID")}</span></p>
                  </div>
                  
                  <p>Status penerimaan telah ditandai di sistem.</p>
                  
                  <p>Terima kasih,<br>Sistem Tabungan Kawanua</p>
                </div>
                <div class="footer">
                  <p>Rekening: BCA 6115876019 - FIKRI MOBILIU</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw error;
    }

    return { success: true, data };
  } catch (error) {
    console.error("Failed to send email notification:", error);
    throw error;
  }
}
