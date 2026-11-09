<script lang="ts">
  import { qrTypes, type QrContent } from '$lib/qr/content';
  export let content: QrContent;
  export let error = '';
  let showPassword = false;
</script>

<div class="space-y-5">
  <fieldset>
    <legend class="mb-3 text-sm font-semibold">What would you like to share?</legend>
    <div class="grid grid-cols-3 gap-2.5">
      {#each qrTypes as type}
        <label class="qr-type">
          <input type="radio" class="sr-only" name="qr-type" value={type.value} bind:group={content.kind} />
          <span class="qr-type-choice">
            <span class="qr-type-icon" aria-hidden="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                {#if type.value === 'text'}
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                {:else if type.value === 'wifi'}
                  <path d="M2 8.5a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-10.5 3.5a5.5 5.5 0 0 1 7 0" /><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none" />
                {:else if type.value === 'email'}
                  <rect x="3" y="5" width="18" height="14" rx="3" /><path d="m4 7 8 6 8-6" />
                {:else if type.value === 'phone'}
                  <path d="m8 3 2 5-3 2a15 15 0 0 0 7 7l2-3 5 2v3a2 2 0 0 1-2 2A18 18 0 0 1 3 5a2 2 0 0 1 2-2Z" />
                {:else if type.value === 'sms'}
                  <path d="M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l1.5-4A8.5 8.5 0 1 1 21 11.5Z" /><path d="M8 10h8m-8 4h5" />
                {:else}
                  <rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="2" /><path d="M6 16a3 3 0 0 1 6 0m3-7h3m-3 4h3" />
                {/if}
              </svg>
            </span>
            <span class="qr-type-text">{type.label}</span>
            <svg class="qr-type-check" width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 8 3 3 7-7" /></svg>
          </span>
        </label>
      {/each}
    </div>
  </fieldset>

  {#if content.kind === 'text'}
    <div class="space-y-2">
      <label for="text-convert" class="text-sm font-medium">Link / Text</label>
      <textarea id="text-convert" class="field" rows="3" bind:value={content.text} placeholder="https://example.com or your message" required></textarea>
      <p class="text-xs text-muted">Use a full link starting with https:// to open a website when scanned.</p>
    </div>
  {:else if content.kind === 'wifi'}
    <div class="space-y-4">
      <div class="space-y-2"><label for="wifi-name" class="text-sm font-medium">Network name (SSID)</label><input id="wifi-name" class="field" bind:value={content.wifi.ssid} placeholder="Your Wi-Fi network" autocomplete="off" spellcheck="false" required /></div>
      <div class="space-y-2">
        <label for="wifi-security" class="text-sm font-medium">Security</label>
        <select id="wifi-security" class="field" bind:value={content.wifi.security}>
          <option value="WPA">WPA / WPA2 Personal</option><option value="WEP">WEP</option><option value="nopass">Open (no password)</option>
        </select>
      </div>
      {#if content.wifi.security !== 'nopass'}
        <div class="space-y-2">
          <label for="wifi-password" class="text-sm font-medium">Password</label>
          <div class="flex items-stretch gap-2">
            <input id="wifi-password" class="field min-w-0 flex-1" type={showPassword ? 'text' : 'password'} bind:value={content.wifi.password} autocomplete="off" spellcheck="false" required />
            <button type="button" class="min-h-11 rounded-lg border border-line px-3 text-sm text-accent hover:bg-soft" aria-controls="wifi-password" aria-pressed={showPassword} onclick={() => showPassword = !showPassword}>{showPassword ? 'Hide' : 'Show'}</button>
          </div>
        </div>
      {/if}
      <label class="flex min-h-11 cursor-pointer items-center gap-3 text-sm"><input type="checkbox" class="h-4 w-4" bind:checked={content.wifi.hidden} />Hidden network</label>
      <p class="text-xs leading-6 text-muted">Scanning lets guests join your network. Anyone with this QR code can read the included password.</p>
    </div>
  {:else if content.kind === 'email'}
    <div class="space-y-4">
      <div class="space-y-2"><label for="email-address" class="text-sm font-medium">Recipient email</label><input id="email-address" type="email" class="field" bind:value={content.email.address} placeholder="hello@example.com" required /></div>
      <div class="space-y-2"><label for="email-subject" class="text-sm font-medium">Subject <span class="text-muted">(optional)</span></label><input id="email-subject" class="field" bind:value={content.email.subject} /></div>
      <div class="space-y-2"><label for="email-body" class="text-sm font-medium">Message <span class="text-muted">(optional)</span></label><textarea id="email-body" rows="3" class="field" bind:value={content.email.body}></textarea></div>
      <p class="text-xs text-muted">Opens an email draft. The person scanning decides when to send it.</p>
    </div>
  {:else if content.kind === 'phone'}
    <div class="space-y-2"><label for="phone-number" class="text-sm font-medium">Phone number</label><input id="phone-number" type="tel" class="field" bind:value={content.phone} placeholder="+63 912 345 6789" required /><p class="text-xs text-muted">Include the country code for international use. Scanning opens the dialer.</p></div>
  {:else if content.kind === 'sms'}
    <div class="space-y-4">
      <div class="space-y-2"><label for="sms-number" class="text-sm font-medium">Recipient phone number</label><input id="sms-number" type="tel" class="field" bind:value={content.sms.phone} placeholder="+63 912 345 6789" required /></div>
      <div class="space-y-2"><label for="sms-body" class="text-sm font-medium">Message <span class="text-muted">(optional)</span></label><textarea id="sms-body" class="field" rows="3" bind:value={content.sms.message}></textarea></div>
      <p class="text-xs text-muted">Opens a text message draft. Message prefilling depends on the scanning app.</p>
    </div>
  {:else if content.kind === 'contact'}
    <div class="space-y-4">
      <div class="grid gap-4 sm:grid-cols-2">
        <div class="space-y-2"><label for="contact-first" class="text-sm font-medium">First name</label><input id="contact-first" class="field" bind:value={content.contact.firstName} /></div>
        <div class="space-y-2"><label for="contact-last" class="text-sm font-medium">Last name</label><input id="contact-last" class="field" bind:value={content.contact.lastName} /></div>
      </div>
      <p class="text-xs text-muted">Enter at least one name. The remaining details are optional.</p>
      <div class="space-y-2"><label for="contact-phone" class="text-sm font-medium">Phone number</label><input id="contact-phone" type="tel" class="field" bind:value={content.contact.phone} placeholder="+63 912 345 6789" /></div>
      <div class="space-y-2"><label for="contact-email" class="text-sm font-medium">Email</label><input id="contact-email" type="email" class="field" bind:value={content.contact.email} /></div>
      <div class="space-y-2"><label for="contact-company" class="text-sm font-medium">Company</label><input id="contact-company" class="field" bind:value={content.contact.organization} /></div>
      <div class="space-y-2"><label for="contact-website" class="text-sm font-medium">Website</label><input id="contact-website" type="url" class="field" bind:value={content.contact.website} placeholder="https://example.com" /></div>
      <p class="text-xs text-muted">Scanning offers a contact card to save to your address book.</p>
    </div>
  {/if}

  <p class="text-xs leading-6 text-muted" role="status">{error || 'Created in your browser. Your details are not saved or uploaded.'}</p>
</div>

<style>
  .qr-type { min-width: 0; cursor: pointer; }
  .qr-type-choice {
    position: relative;
    display: flex;
    min-height: 84px;
    height: 100%;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 7px;
    padding: 10px 8px;
    border: 1px solid var(--line);
    border-radius: 12px;
    background: var(--surface);
    color: var(--ink);
    transition: background 160ms, border-color 160ms, box-shadow 160ms, transform 160ms;
  }
  .qr-type-icon { display: flex; width: 32px; height: 32px; flex-shrink: 0; align-items: center; justify-content: center; border-radius: 9px; background: var(--accent-soft); color: var(--accent); transition: background 160ms, color 160ms; }
  .qr-type-text { font-size: 13px; font-weight: 500; line-height: 1.35; text-align: center; }
  .qr-type-check { position: absolute; top: 7px; right: 7px; opacity: 0; transition: opacity 160ms; }
  .qr-type:hover .qr-type-choice { border-color: var(--accent); background: var(--accent-soft); box-shadow: 0 4px 10px var(--shadow); transform: translateY(-2px); }
  .qr-type:active .qr-type-choice { transform: translateY(0); }
  .qr-type input:checked + .qr-type-choice { background: var(--accent); border-color: var(--accent); color: var(--on-accent); box-shadow: 0 4px 12px var(--shadow); }
  .qr-type input:checked + .qr-type-choice .qr-type-icon { background: var(--on-accent); color: var(--accent); }
  .qr-type input:checked + .qr-type-choice .qr-type-text { font-weight: 600; }
  .qr-type input:checked + .qr-type-choice .qr-type-check { opacity: 1; }
  @media (min-width: 640px) {
    .qr-type-choice { min-height: 64px; flex-direction: row; gap: 8px; padding: 10px; }
  }
</style>
