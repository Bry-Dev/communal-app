import assert from 'node:assert/strict';
import test from 'node:test';
import { createQrSvgParts } from '@svelte-put/qr';
import { buildQrContent, createQrContent, qrTypes } from '../src/lib/qr/content.ts';

function content(kind, values) {
  const input = createQrContent();
  input.kind = kind;
  if (typeof input[kind] === 'string') input[kind] = values;
  else Object.assign(input[kind], values);
  return input;
}

function payload(input) {
  const result = buildQrContent(input);
  assert.equal(result.error, '');
  return result.data;
}

test('text preserves spaces, Unicode, and links exactly', () => {
  assert.equal(payload(content('text', '  Hello, 世界!\nhttps://example.com/?a=1&b=2  ')), '  Hello, 世界!\nhttps://example.com/?a=1&b=2  ');
  assert.ok(buildQrContent(content('text', ' \n ')).error);
});

test('Wi-Fi escapes reserved characters without trimming SSIDs or passwords', () => {
  const input = content('wifi', { ssid: ' Guest;Room:"A",\\ ', password: 'p;,:"\\word', hidden: true });
  assert.equal(payload(input), 'WIFI:T:WPA;S: Guest\\;Room\\:\\"A\\"\\,\\\\ ;P:p\\;\\,\\:\\"\\\\word;H:true;;');
});

test('Wi-Fi quotes hexadecimal-looking text and supports WEP', () => {
  assert.equal(payload(content('wifi', { ssid: 'ABCD', password: 'aabbccdd', security: 'WEP' })), 'WIFI:T:WEP;S:"ABCD";P:"aabbccdd";;');
});

test('open Wi-Fi excludes a previously entered password', () => {
  assert.equal(payload(content('wifi', { ssid: 'Cafe', password: 'old-password', security: 'nopass' })), 'WIFI:T:nopass;S:"Cafe";;');
});

test('Wi-Fi validates required fields and SSID UTF-8 length', () => {
  for (const values of [{}, { ssid: 'Guest' }, { ssid: '界'.repeat(11), password: 'password' }, { ssid: 'Guest\nH:true', password: 'password' }]) {
    const result = buildQrContent(content('wifi', values));
    assert.equal(result.data, '');
    assert.ok(result.error);
  }
  assert.ok(payload(content('wifi', { ssid: '界'.repeat(10), password: 'password' })).startsWith('WIFI:'));
});

test('email encodes query delimiters, Unicode, and CRLF message lines', () => {
  const data = payload(content('email', { address: ' hello+qr@example.com ', subject: 'Hi & hello? 世界', body: 'One\nTwo & three' }));
  assert.equal(data, 'mailto:hello%2Bqr@example.com?subject=Hi%20%26%20hello%3F%20%E4%B8%96%E7%95%8C&body=One%0D%0ATwo%20%26%20three');
  assert.equal(payload(content('email', { address: 'a@example.com' })), 'mailto:a@example.com');
  assert.ok(buildQrContent(content('email', { address: 'bad\n@example.com' })).error);
});

test('phone normalizes formatting and rejects URI parameter injection', () => {
  assert.equal(payload(content('phone', '+63 (912) 345-6789')), 'tel:+639123456789');
  for (const number of ['', '12', 'abc', '+123;ext=45', '1234567890123456']) assert.ok(buildQrContent(content('phone', number)).error);
});

test('SMS uses an encoded body parameter and allows shortcodes', () => {
  assert.equal(payload(content('sms', { phone: '12345', message: 'Hi & bye?\n世界' })), 'sms:12345?body=Hi%20%26%20bye%3F%0A%E4%B8%96%E7%95%8C');
  assert.equal(payload(content('sms', { phone: '+63 912 345 6789' })), 'sms:+639123456789');
});

test('contact includes required vCard 3.0 fields and escapes property values', () => {
  const data = payload(content('contact', { firstName: 'Ada', lastName: 'Love;lace', organization: 'A,B\\C\nNew line', phone: '+63 912 345 6789', email: 'ada@example.com', website: 'https://example.com/?a=1&b=2' }));
  assert.equal(data, [
    'BEGIN:VCARD', 'VERSION:3.0', 'N:Love\\;lace;Ada;;;', 'FN:Ada Love\\;lace',
    'ORG:A\\,B\\\\C\\nNew line', 'TEL;TYPE=CELL:+639123456789',
    'EMAIL;TYPE=INTERNET:ada@example.com', 'URL:https://example.com/?a=1&b=2', 'END:VCARD', ''
  ].join('\r\n'));
});

test('contact folds long Unicode lines without breaking code points', () => {
  const data = payload(content('contact', { firstName: '名'.repeat(40) }));
  assert.ok(data.includes('\r\n '));
  for (const line of data.split('\r\n')) assert.ok(Buffer.byteLength(line) <= 75);
  assert.ok(data.replace(/\r\n /g, '').includes('FN:' + '名'.repeat(40)));
});

test('contact requires a name and validates optional details', () => {
  for (const values of [{}, { firstName: 'Ada', email: 'invalid' }, { firstName: 'Ada', phone: 'bad' }, { firstName: 'Ada', website: 'javascript:alert(1)' }, { firstName: 'Ada', website: 'https://example.com/\nTEL:123' }]) assert.ok(buildQrContent(content('contact', values)).error);
  assert.ok(payload(content('contact', { lastName: 'Lovelace' })).includes('FN:Lovelace'));
});

test('all kinds reject missing required details instead of encoding stale text', () => {
  for (const { value } of qrTypes.filter((type) => type.value !== 'text')) {
    const input = createQrContent();
    input.kind = value;
    assert.equal(buildQrContent(input).data, '');
  }
});

test('changing types preserves entered values and fresh forms share no state', () => {
  const input = createQrContent();
  input.kind = 'wifi';
  Object.assign(input.wifi, { ssid: 'Guest', password: 'password' });
  const wifi = payload(input);
  input.kind = 'text';
  assert.equal(payload(input), 'https://bry-dev.github.io/communal-app/');
  input.kind = 'wifi';
  assert.equal(payload(input), wifi);
  assert.equal(createQrContent().wifi.ssid, '');
});

test('overlong UTF-8 payloads are rejected before QR rendering', () => {
  const result = buildQrContent(content('text', '界'.repeat(401)));
  assert.equal(result.data, '');
  assert.match(result.error, /too long/);
});

test('all six payload types render with the production QR library and high error correction', () => {
  const inputs = [
    createQrContent(), content('wifi', { ssid: 'Guest', password: 'password' }),
    content('email', { address: 'hi@example.com' }), content('phone', '+639123456789'),
    content('sms', { phone: '+639123456789', message: 'Hello' }),
    content('contact', { firstName: 'Ada', lastName: 'Lovelace' }), content('text', 'x'.repeat(1200))
  ];
  for (const input of inputs) {
    const parts = createQrSvgParts({ data: payload(input), margin: 4, errorCorrectionLevel: 'H' });
    assert.ok(parts.modules.includes('<rect'));
    assert.ok(parts.attributes.viewBox);
  }
});
