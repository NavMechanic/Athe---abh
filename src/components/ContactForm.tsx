'use client';

import { useState, type FormEvent } from 'react';
import site from '@content/site.json';
import { buttonClass } from './Button';

const field =
  'mt-1.5 block w-full rounded-md border border-slate-400 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-500';
const label = 'block text-sm font-semibold text-navy-900';

/**
 * No backend: submitting drafts an email in the visitor's mail app via mailto.
 * There is deliberately no "sent" state, because the page cannot know if anything was sent.
 */
export function ContactForm() {
  const { contact, contactEmail } = site;
  const [drafted, setDrafted] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const get = (key: string) => String(data.get(key) ?? '').trim();

    const subject = `Project enquiry: ${get('company') || get('name')}`;
    const body = [
      `Name: ${get('name')}`,
      `Company: ${get('company')}`,
      `Email: ${get('email')}`,
      `Project type: ${get('projectType')}`,
      '',
      get('message'),
      '',
      'Consent: I agree to ATHENA using these details to reply to this enquiry.',
    ].join('\n');

    window.location.href = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setDrafted(true);
  };

  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <form onSubmit={onSubmit} className="rounded-lg border border-slate-200 bg-white p-5 md:p-8">
        <p className="text-sm text-slate-600">
          Fields marked <span aria-hidden="true">*</span>
          <span className="sr-only">with an asterisk</span> are required.
        </p>
        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="cf-name" className={label}>
              Name *
            </label>
            <input id="cf-name" name="name" type="text" required autoComplete="name" className={field} />
          </div>
          <div>
            <label htmlFor="cf-company" className={label}>
              Company
            </label>
            <input id="cf-company" name="company" type="text" autoComplete="organization" className={field} />
          </div>
          <div>
            <label htmlFor="cf-email" className={label}>
              Work email *
            </label>
            <input id="cf-email" name="email" type="email" required autoComplete="email" className={field} />
          </div>
          <div>
            <label htmlFor="cf-type" className={label}>
              Project type
            </label>
            <select id="cf-type" name="projectType" defaultValue={contact.projectTypes[0]} className={field}>
              {contact.projectTypes.map((type) => (
                <option key={type}>{type}</option>
              ))}
            </select>
          </div>
          <div className="sm:col-span-2">
            <label htmlFor="cf-message" className={label}>
              What are you building? *
            </label>
            <textarea id="cf-message" name="message" required rows={5} className={field} />
          </div>
        </div>

        <div className="mt-5 flex items-start gap-3">
          <input id="cf-consent" name="consent" type="checkbox" required className="mt-1 h-5 w-5 shrink-0 accent-teal-700" />
          <label htmlFor="cf-consent" className="text-sm leading-relaxed text-slate-700">
            {contact.consent} *
          </label>
        </div>

        <button type="submit" className={buttonClass('primary', 'mt-6 w-full sm:w-auto')}>
          {contact.submitLabel}
        </button>

        <p role="status" aria-live="polite" className="mt-4 text-sm leading-relaxed text-slate-700">
          {drafted
            ? `Your mail app should now show a draft addressed to ${contactEmail}. Nothing has been sent yet: review it and press send there. If no draft opened, use the address on this page.`
            : ''}
        </p>
      </form>

      <aside aria-label="Email us directly" className="self-start rounded-lg border border-slate-200 bg-white p-5 md:p-8">
        <h3 className="text-base font-semibold text-navy-900">Prefer email?</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Write to us directly with your requirement, target ratings, standards and timeline.
        </p>
        <a
          href={`mailto:${contactEmail}`}
          className="mt-4 inline-flex min-h-[44px] items-center break-all text-sm font-semibold text-teal-800 underline underline-offset-4"
        >
          {contactEmail}
        </a>
      </aside>
    </div>
  );
}
