export const qrTypes = [
  { value: 'text', label: 'Link / Text' },
  { value: 'wifi', label: 'Wi-Fi' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'sms', label: 'SMS' },
  { value: 'contact', label: 'Contact' }
] as const;

export type QrType = (typeof qrTypes)[number]['value'];
export type QrContent = {
  kind: QrType;
  text: string;
  wifi: { ssid: string; password: string; security: 'WPA' | 'WEP' | 'nopass'; hidden: boolean };
  email: { address: string; subject: string; body: string };
  phone: string;
  sms: { phone: string; message: string };
  contact: { firstName: string; lastName: string; phone: string; email: string; organization: string; website: string };
};

export function createQrContent(): QrContent {
  return {
    kind: 'text',
    text: 'https://bry-dev.github.io/communal-app/',
    wifi: { ssid: '', password: '', security: 'WPA', hidden: false },
    email: { address: '', subject: '', body: '' },
    phone: '',
    sms: { phone: '', message: '' },
    contact: { firstName: '', lastName: '', phone: '', email: '', organization: '', website: '' }
  };
}

function normalizePhone(value: string): string {
  return value.replace(/[\s().-]/g, '');
}

function validPhone(value: string): boolean {
  return /^\+?\d{3,15}$/.test(normalizePhone(value));
}

function validEmail(value: string): boolean {
  return /^[^\s@,;<>]+@[^\s@,;<>]+\.[^\s@,;<>]+$/.test(value.trim());
}

// ZXing Wi-Fi format: escape delimiters and quote text that looks hexadecimal.
// https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11
function escapeWifi(value: string): string {
  const escaped = value.replace(/([\\;,:"])/g, '\\$1');
  return /^[\da-f]+$/i.test(value) ? `"${escaped}"` : escaped;
}

function escapeVcard(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/([;,])/g, '\\$1');
}

function foldVcardLine(line: string): string {
  const encoder = new TextEncoder();
  let length = 0;
  let folded = '';
  for (const character of line) {
    const bytes = encoder.encode(character).length;
    if (length + bytes > 75) {
      folded += '\r\n ';
      length = 1;
    }
    folded += character;
    length += bytes;
  }
  return folded;
}

function isWebsite(value: string): boolean {
  if (/[\r\n]/.test(value)) return false;
  try {
    const url = new URL(value.trim());
    return url.protocol === 'https:' || url.protocol === 'http:';
  } catch { return false; }
}

/** Build scanner payloads locally; return guidance instead of encoding incomplete content. */
export function buildQrContent(content: QrContent): { data: string; error: string } {
  const invalid = (error: string) => ({ data: '', error });
  let data = '';

  switch (content.kind) {
    case 'text':
      if (!content.text.trim()) return invalid('Enter a link or some text to create your QR code.');
      data = content.text;
      break;
    case 'wifi': {
      const { ssid, password, security, hidden } = content.wifi;
      if (!ssid) return invalid('Enter your Wi-Fi network name.');
      if (new TextEncoder().encode(ssid).length > 32) return invalid('The network name must be 32 bytes or fewer.');
      if (/[\r\n\0]/.test(ssid + password)) return invalid('Remove line breaks or null characters from the Wi-Fi details.');
      if (security !== 'nopass' && !password) return invalid('Enter the Wi-Fi password, or choose an open network.');
      data = `WIFI:T:${security};S:${escapeWifi(ssid)};`;
      if (security !== 'nopass') data += `P:${escapeWifi(password)};`;
      if (hidden) data += 'H:true;';
      data += ';';
      break;
    }
    case 'email': {
      const { address, subject, body } = content.email;
      if (!validEmail(address)) return invalid('Enter a valid recipient email address.');
      const fields: string[] = [];
      if (subject) fields.push(`subject=${encodeURIComponent(subject.replace(/[\r\n]+/g, ' '))}`);
      if (body) fields.push(`body=${encodeURIComponent(body.replace(/\r\n|\r|\n/g, '\r\n'))}`);
      data = `mailto:${encodeURIComponent(address.trim()).replace('%40', '@')}${fields.length ? '?' + fields.join('&') : ''}`;
      break;
    }
    case 'phone':
      if (!validPhone(content.phone)) return invalid('Enter a phone number with 3–15 digits. You can include a country code.');
      data = `tel:${normalizePhone(content.phone)}`;
      break;
    case 'sms':
      if (!validPhone(content.sms.phone)) return invalid('Enter a phone number with 3–15 digits for the SMS recipient.');
      data = `sms:${normalizePhone(content.sms.phone)}${content.sms.message ? '?body=' + encodeURIComponent(content.sms.message) : ''}`;
      break;
    case 'contact': {
      const contact = content.contact;
      const firstName = contact.firstName.trim();
      const lastName = contact.lastName.trim();
      if (!firstName && !lastName) return invalid('Enter a first or last name for the contact.');
      if (contact.email && !validEmail(contact.email)) return invalid('Enter a valid contact email address, or leave it blank.');
      if (contact.phone && !validPhone(contact.phone)) return invalid('Enter a valid contact phone number, or leave it blank.');
      if (contact.website && !isWebsite(contact.website)) return invalid('Enter a website starting with https:// or http://.');
      const lines = [
        'BEGIN:VCARD', 'VERSION:3.0',
        `N:${escapeVcard(lastName)};${escapeVcard(firstName)};;;`,
        `FN:${escapeVcard([firstName, lastName].filter(Boolean).join(' '))}`
      ];
      if (contact.organization) lines.push(`ORG:${escapeVcard(contact.organization)}`);
      if (contact.phone) lines.push(`TEL;TYPE=CELL:${normalizePhone(contact.phone)}`);
      if (contact.email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVcard(contact.email.trim())}`);
      if (contact.website) lines.push(`URL:${contact.website.trim()}`);
      lines.push('END:VCARD');
      data = lines.map(foldVcardLine).join('\r\n') + '\r\n';
      break;
    }
  }

  // Leave room for high error correction, including when a logo is enabled.
  if (new TextEncoder().encode(data).length > 1200) return invalid('This content is too long for one QR code. Shorten the text or use a link.');
  return { data, error: '' };
}
