import { ALL_CONTACT_PHONES, CONTACT_EMAIL } from '@/lib/help/contact-info';

const TOPICS_EN = [
  'Orders & Payment',
  'Returns & Exchanges',
  'Shipping & Tracking',
  'Press',
  'Other',
] as const;

const TOPICS_PT = [
  'Pedidos e pagamento',
  'Devoluções e trocas',
  'Envio e rastreamento',
  'Imprensa',
  'Outro',
] as const;

export function ContactPageContent({ locale }: { locale: string }) {
  const isPt = locale === 'pt';
  const topics = isPt ? TOPICS_PT : TOPICS_EN;

  return (
    <div className="max-w-xl font-sans-ui text-sm text-neutral-700">
      <form className="space-y-5" action={`mailto:${CONTACT_EMAIL}`} method="post" encType="text/plain">
        <div>
          <label htmlFor="contact-name" className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-neutral-900">
            {isPt ? 'Nome completo' : 'Full Name'} *
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            className="w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label htmlFor="contact-email" className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-neutral-900">
            Email *
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            className="w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label htmlFor="contact-phone" className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-neutral-900">
            {isPt ? 'Telefone' : 'Phone Number'}
          </label>
          <input
            id="contact-phone"
            name="phone"
            type="tel"
            className="w-full border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <div>
          <label htmlFor="contact-topic" className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-neutral-900">
            {isPt ? 'Assunto' : 'Select Topic'} *
          </label>
          <select
            id="contact-topic"
            name="topic"
            required
            defaultValue=""
            className="w-full border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
          >
            <option value="" disabled>
              {isPt ? 'Selecione' : 'Select'}
            </option>
            {topics.map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="contact-message" className="mb-1.5 block text-[11px] uppercase tracking-[0.12em] text-neutral-900">
            {isPt ? 'Mensagem' : 'Message'} *
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            className="w-full resize-y border border-neutral-300 px-3 py-2.5 text-sm outline-none focus:border-neutral-900"
          />
        </div>

        <p className="text-xs text-neutral-500">
          {isPt ? 'Campos marcados com (*) são obrigatórios.' : 'Fields marked with an asterisk (*) are required.'}
        </p>

        <button
          type="submit"
          className="border border-neutral-900 px-8 py-3 text-[11px] uppercase tracking-[0.14em] text-neutral-900 transition-opacity hover:opacity-60"
        >
          {isPt ? 'Enviar' : 'Send'}
        </button>
      </form>

      <p className="mt-10 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-base text-neutral-900">
        {ALL_CONTACT_PHONES.map((phone, index) => (
          <span key={phone.href} className="inline-flex items-center gap-x-2">
            {index > 0 ? <span>/</span> : null}
            <a href={phone.href} className="hover:opacity-60">
              {phone.display}
            </a>
          </span>
        ))}
        <span>/</span>
        <a href={`mailto:${CONTACT_EMAIL}`} className="hover:opacity-60">
          {CONTACT_EMAIL}
        </a>
      </p>
    </div>
  );
}
