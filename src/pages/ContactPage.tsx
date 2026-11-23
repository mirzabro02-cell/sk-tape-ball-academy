import { useState, type FormEvent } from 'react';
import { ACADEMY_BRAND } from '@/src/data/brand';
import { useDocumentTitle } from '@/src/hooks/useDocumentTitle';
import { Button } from '@/src/components/ui/Button';
import { Card } from '@/src/components/ui/Card';
import { Input } from '@/src/components/ui/Input';
import { PlaceholderNotice } from '@/src/components/ui/PlaceholderNotice';
import { Textarea } from '@/src/components/ui/Textarea';
import { WhatsAppCta } from '@/src/components/ui/WhatsAppCta';

export function ContactPage() {
  useDocumentTitle('Contact');

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNotice('Contact inquiry UI check complete. Backend messaging will be wired in a later phase.');
  }

  return (
    <PlaceholderNotice
      routePath="/contact"
      sectionLabel="Academy Desk"
      title="Contact SK Tape Ball Academy"
      description="Placeholder contact route. All academy phone numbers, WhatsApp numbers, email addresses, and ground addresses remain un-invented placeholders."
      plannedModules={[
        'Official Academy Ground Map & Directions',
        'Verified Phone, Email & WhatsApp Links',
        'Direct Inquiry Submission Form',
      ]}
    >
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-5" padding="lg">
          <h2 className="text-lg font-bold text-[#071A36]">
            Official Contact Slots (Placeholders)
          </h2>
          <div className="mt-4 space-y-3 text-sm text-[#64748B]">
            <p>{ACADEMY_BRAND.contactPlaceholders.addressPlaceholder}</p>
            <p>{ACADEMY_BRAND.contactPlaceholders.phonePlaceholder}</p>
            <p>{ACADEMY_BRAND.contactPlaceholders.emailPlaceholder}</p>
            <p>{ACADEMY_BRAND.contactPlaceholders.hoursPlaceholder}</p>
          </div>
          <div className="mt-6">
            <WhatsAppCta variant="banner" />
          </div>
        </Card>

        <Card className="lg:col-span-7" padding="lg">
          <h2 className="text-lg font-bold text-[#071A36]">
            Inquiry Form Controls (Placeholder)
          </h2>
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <Input
              label="Your Name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <Input
              label="Subject"
              placeholder="e.g., Batch timings or admissions inquiry"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              required
            />
            <Textarea
              label="Message"
              placeholder="Write your question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
            {notice && (
              <div className="rounded-[10px] border border-[#E2E8F0] bg-[#F5F7FA] px-4 py-3 text-sm text-[#071A36]">
                {notice}
              </div>
            )}
            <Button type="submit" variant="secondary">
              Preview Inquiry Submit
            </Button>
          </form>
        </Card>
      </div>
    </PlaceholderNotice>
  );
}
