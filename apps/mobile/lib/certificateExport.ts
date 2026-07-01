import { Alert, Platform } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export type CertificateData = {
  name: string;
  hours: number;
  shifts: number;
  issuedDate: string;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export function buildCertificateHtml(data: CertificateData): string {
  const name = escapeHtml(data.name);
  const hours = Math.max(0, Math.round(data.hours));
  const shifts = Math.max(0, data.shifts);
  const issued = escapeHtml(data.issuedDate);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Hourly Volunteer Certificate — ${name}</title>
  <style>
    @page { size: letter landscape; margin: 0; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #0f1419;
      font-family: Georgia, "Times New Roman", serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .frame {
      width: 10.5in;
      height: 7.5in;
      padding: 0.55in;
      background: linear-gradient(145deg, #121820 0%, #0d1117 100%);
      border: 3px solid #1D9E75;
      border-radius: 12px;
      position: relative;
      color: #f5f7fa;
    }
    .inner {
      height: 100%;
      border: 1px solid rgba(29, 158, 117, 0.45);
      border-radius: 8px;
      padding: 0.65in 0.85in;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    .brand {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      letter-spacing: 0.28em;
      text-transform: uppercase;
      color: #1D9E75;
      margin-bottom: 0.35in;
    }
    h1 {
      font-size: 34px;
      font-weight: 400;
      letter-spacing: 0.06em;
      margin: 0 0 0.15in;
      text-transform: uppercase;
    }
    .subtitle {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 14px;
      color: #9aa4b2;
      margin-bottom: 0.45in;
    }
    .recipient {
      font-size: 42px;
      font-weight: 600;
      color: #ffffff;
      margin: 0.1in 0 0.25in;
      line-height: 1.15;
    }
    .body {
      font-size: 18px;
      line-height: 1.6;
      max-width: 7.5in;
      color: #d7dde5;
      margin: 0 0 0.35in;
    }
    .hours {
      font-size: 56px;
      font-weight: 700;
      color: #1D9E75;
      font-family: system-ui, -apple-system, sans-serif;
      line-height: 1;
      margin: 0.1in 0;
    }
    .hours-label {
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 13px;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: #9aa4b2;
    }
    .meta {
      margin-top: auto;
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      font-family: system-ui, -apple-system, sans-serif;
      font-size: 12px;
      color: #9aa4b2;
    }
    .signature {
      text-align: left;
    }
    .signature-line {
      width: 2.2in;
      border-top: 1px solid rgba(245, 247, 250, 0.35);
      margin-bottom: 6px;
    }
    .seal {
      position: absolute;
      right: 0.75in;
      bottom: 0.75in;
      width: 1.1in;
      height: 1.1in;
      border-radius: 50%;
      border: 2px solid rgba(29, 158, 117, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-family: system-ui, sans-serif;
      font-size: 11px;
      letter-spacing: 0.08em;
      color: #1D9E75;
      text-transform: uppercase;
    }
    @media print {
      body { background: #fff; }
    }
  </style>
</head>
<body>
  <div class="frame">
    <div class="inner">
      <div class="brand">Hourly</div>
      <h1>Certificate of Volunteer Service</h1>
      <p class="subtitle">Verified community impact record</p>
      <p class="body">This certifies that</p>
      <p class="recipient">${name}</p>
      <p class="body">
        has completed <strong>${shifts}</strong> verified volunteer shift${shifts === 1 ? '' : 's'}
        and contributed the following verified service hours to their community.
      </p>
      <p class="hours">${hours}</p>
      <p class="hours-label">Verified hours</p>
      <div class="meta">
        <div class="signature">
          <div class="signature-line"></div>
          <div>Hourly Verification</div>
        </div>
        <div>Issued ${issued}</div>
      </div>
    </div>
    <div class="seal">Verified</div>
  </div>
</body>
</html>`;
}

function exportCertificateWeb(html: string, fileName: string): void {
  if (typeof window === 'undefined') {
    Alert.alert('Certificate', 'Certificate export is only available in a browser.');
    return;
  }

  const printWindow = window.open('', '_blank', 'noopener,noreferrer,width=960,height=720');
  if (!printWindow) {
    Alert.alert('Certificate', 'Allow pop-ups to open the certificate, then use Print → Save as PDF.');
    return;
  }

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();

  const triggerPrint = () => {
    printWindow.focus();
    printWindow.print();
  };

  if (printWindow.document.readyState === 'complete') {
    setTimeout(triggerPrint, 250);
  } else {
    printWindow.onload = () => setTimeout(triggerPrint, 250);
  }

  try {
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.html`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch {
    // HTML download is optional; print dialog is the primary web path.
  }
}

export async function exportVolunteerCertificate(data: CertificateData): Promise<void> {
  const html = buildCertificateHtml(data);
  const safeFileName = `hourly-certificate-${data.name.replace(/[^\w.-]+/g, '-').slice(0, 40) || 'volunteer'}`;

  if (Platform.OS === 'web') {
    exportCertificateWeb(html, safeFileName);
    return;
  }

  try {
    const { uri } = await Print.printToFileAsync({ html });
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(uri, {
        mimeType: 'application/pdf',
        dialogTitle: 'Volunteer certificate',
        UTI: 'com.adobe.pdf',
      });
      return;
    }

    Alert.alert('Certificate ready', 'Your certificate PDF was generated on this device.');
  } catch {
    Alert.alert('Certificate', 'Could not generate the certificate on this device.');
  }
}
