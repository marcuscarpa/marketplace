import type { HelpAccordionItem } from '@/components/help/help-accordion';

const BRAND = 'Sinesia Karol';
const SUPPORT_EMAIL = 'hello@sinesiakarol.com';

export function getFaqSections(locale: string): { heading: string; items: HelpAccordionItem[] }[] {
  const p = `/${locale}`;
  return locale === 'pt' ? FAQ_SECTIONS_PT(p) : FAQ_SECTIONS_EN(p);
}

function FAQ_SECTIONS_EN(p: string): { heading: string; items: HelpAccordionItem[] }[] {
  return [
    {
      heading: 'Orders and Shipping',
      items: [
        {
          title: 'What delivery option does the Online Boutique offer?',
          content: (
            <>
              <p>
                <strong>UNITED STATES</strong> — Ground (free, 2–5 business days), Express (USD $15, 1–3 days), Next Day (USD $30), and Collect In Boutique (complimentary, ready within 1 business day).
              </p>
              <p>
                <strong>INTERNATIONAL</strong> (Puerto Rico) — Express: free over USD $500, otherwise USD $15; delivery within 2–4 business days.
              </p>
              <p>
                All orders are processed within 1 business day. Explore more on our{' '}
                <a href={`${p}/shipping`}>delivery options page</a>.
              </p>
            </>
          ),
        },
        {
          title: 'Can I collect my order in boutique?',
          content: (
            <p>
              We offer a complimentary Collect In Boutique service. Purchase items online and collect from your selected {BRAND} boutique, subject to item and boutique eligibility.
            </p>
          ),
        },
        {
          title: 'Can I have my order delivered to my PO box or Parcel Locker?',
          content: <p>We cannot deliver to PO Box, Parcel Locker or Freight Forwarding addresses. Orders to these addresses may be subject to cancellation.</p>,
        },
        {
          title: 'Can I make changes to my order?',
          content: (
            <p>
              Contact Client Services immediately at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. We cannot guarantee amendments once an order has been placed.
            </p>
          ),
        },
        {
          title: 'How can I check the status of my order?',
          content: (
            <p>
              You will receive a confirmation email upon placing your order and again once your order has been packed, with a delivery tracking link. Contact Client Services for further enquiries.
            </p>
          ),
        },
        {
          title: 'What payment methods does the Online Boutique offer?',
          content: <p>We accept payments via Apple Pay, American Express, Visa, Mastercard and PayPal.</p>,
        },
        {
          title: 'How many units can I purchase per style?',
          content: (
            <p>
              Boutiques and Online: no more than three (3) units per style and colour. Outlets: no more than three (3) units per style and colour.
            </p>
          ),
        },
      ],
    },
    {
      heading: 'Returns',
      items: [
        {
          title: "What is Sinesia Karol's Online return policy?",
          content: (
            <p>
              You may return your {BRAND} Online order within 14 days from the date of delivery for a refund. Read more on our{' '}
              <a href={`${p}/returns`}>returns policy</a>.
            </p>
          ),
        },
        {
          title: 'How do I return my Online Order?',
          content: (
            <p>
              Contact Client Services at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> to submit a return request. A return request must be submitted to receive your refund within normal processing times.
            </p>
          ),
        },
        {
          title: 'How long will it take for my return to be processed?',
          content: <p>You will receive email notification once your return is processed, within 5 business days of receiving your return.</p>,
        },
      ],
    },
    {
      heading: 'Product Information',
      items: [
        {
          title: 'What is the product sizing?',
          content: (
            <p>
              We offer Ready-to-Wear and Swim &amp; Resort pieces in sizes ranging between 0P and 4. Find out more on our{' '}
              <a href={`${p}/size-chart`}>size guide</a>.
            </p>
          ),
        },
        {
          title: 'How do I find out if an item will come back in stock?',
          content: (
            <p>
              Use the &quot;Notify Me&quot; feature on the product page to be notified if the item comes back in stock. Our boutique and Client Services experts are happy to assist if you are looking for a particular product.
            </p>
          ),
        },
        {
          title: 'How do I wash and care for my pieces?',
          content: <p>Each individual item has its own care instructions. Refer to the item product page or the care tag in the garment for all care instructions.</p>,
        },
      ],
    },
    {
      heading: 'Corporate Responsibility',
      items: [
        {
          title: "What is Sinesia Karol's commitment to sustainability?",
          content: (
            <p>
              {BRAND} takes sustainability seriously. Our teams are constantly evaluating the best options in this fast-changing space, and we are committed to being transparent about our journey.
            </p>
          ),
        },
        {
          title: 'How is my data and privacy managed?',
          content: (
            <p>
              Your privacy and data protection are incredibly important to us. Your personal data is handled in accordance with {BRAND}&apos;s{' '}
              <a href={`${p}/privacy`}>privacy policy</a>.
            </p>
          ),
        },
      ],
    },
    {
      heading: 'Visit Us',
      items: [
        {
          title: 'Where is my closest boutique?',
          content: <p>Contact Client Services at {SUPPORT_EMAIL} for boutique locations. Our boutique teams look forward to warmly welcoming you.</p>,
        },
      ],
    },
  ];
}

function FAQ_SECTIONS_PT(p: string): { heading: string; items: HelpAccordionItem[] }[] {
  return [
    {
      heading: 'Pedidos e envio',
      items: [
        {
          title: 'Quais opções de entrega a Boutique Online oferece?',
          content: (
            <>
              <p>
                <strong>ESTADOS UNIDOS</strong> — Terrestre (grátis, 2–5 dias úteis), Expresso (USD $15, 1–3 dias), Entrega no dia seguinte (USD $30) e Retirada na boutique (gratuita, pronta em 1 dia útil).
              </p>
              <p>
                <strong>INTERNACIONAL</strong> (Porto Rico) — Expresso: grátis acima de USD $500, caso contrário USD $15; entrega em 2–4 dias úteis.
              </p>
              <p>
                Todos os pedidos são processados em até 1 dia útil. Saiba mais em nossa{' '}
                <a href={`${p}/shipping`}>página de opções de entrega</a>.
              </p>
            </>
          ),
        },
        {
          title: 'Posso retirar meu pedido na boutique?',
          content: (
            <p>
              Oferecemos o serviço gratuito de Retirada na Boutique. Compre online e retire na boutique {BRAND} selecionada, conforme elegibilidade do item e da loja.
            </p>
          ),
        },
        {
          title: 'Posso entregar em caixa postal ou armário inteligente?',
          content: <p>Não entregamos em caixa postal, armário inteligente ou endereço de redirecionamento de carga. Pedidos para esses endereços podem ser cancelados.</p>,
        },
        {
          title: 'Posso alterar meu pedido?',
          content: (
            <p>
              Entre em contato com o Atendimento ao Cliente imediatamente em <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>. Não garantimos alterações após a confirmação do pedido.
            </p>
          ),
        },
        {
          title: 'Como acompanho o status do meu pedido?',
          content: (
            <p>
              Você receberá um e-mail de confirmação ao fazer o pedido e outro quando ele for embalado, com link de rastreamento. Para mais informações, fale com o Atendimento ao Cliente.
            </p>
          ),
        },
        {
          title: 'Quais formas de pagamento a Boutique Online aceita?',
          content: <p>Aceitamos Apple Pay, American Express, Visa, Mastercard e PayPal.</p>,
        },
        {
          title: 'Quantas unidades posso comprar por modelo?',
          content: (
            <p>
              Boutiques e Online: no máximo três (3) unidades por modelo e cor. Outlets: no máximo três (3) unidades por modelo e cor.
            </p>
          ),
        },
      ],
    },
    {
      heading: 'Devoluções',
      items: [
        {
          title: 'Qual é a política de devolução online da Sinesia Karol?',
          content: (
            <p>
              Você pode devolver seu pedido online {BRAND} em até 14 dias a partir da data de entrega para reembolso. Leia mais em nossa{' '}
              <a href={`${p}/returns`}>política de devolução</a>.
            </p>
          ),
        },
        {
          title: 'Como devolvo meu pedido online?',
          content: (
            <p>
              Entre em contato com o Atendimento ao Cliente em <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> para solicitar a devolução. A solicitação é necessária para receber o reembolso dentro do prazo habitual.
            </p>
          ),
        },
        {
          title: 'Quanto tempo leva para processar minha devolução?',
          content: <p>Você receberá um e-mail quando a devolução for processada, em até 5 dias úteis após o recebimento do item.</p>,
        },
      ],
    },
    {
      heading: 'Informações do produto',
      items: [
        {
          title: 'Como funciona a numeração dos produtos?',
          content: (
            <p>
              Oferecemos peças prêt-à-porter e moda praia/resort nos tamanhos de 0P a 4. Consulte nosso{' '}
              <a href={`${p}/size-chart`}>guia de tamanhos</a>.
            </p>
          ),
        },
        {
          title: 'Como saber se um item voltará ao estoque?',
          content: (
            <p>
              Use o recurso &quot;Avise-me&quot; na página do produto para ser notificado quando o item estiver disponível novamente. Nossa equipe de boutiques e Atendimento ao Cliente também pode ajudar.
            </p>
          ),
        },
        {
          title: 'Como lavar e cuidar das peças?',
          content: <p>Cada item possui instruções de cuidado específicas. Consulte a página do produto ou a etiqueta da peça.</p>,
        },
      ],
    },
    {
      heading: 'Responsabilidade corporativa',
      items: [
        {
          title: 'Qual é o compromisso da Sinesia Karol com a sustentabilidade?',
          content: (
            <p>
              A {BRAND} leva a sustentabilidade a sério. Nossas equipes avaliam constantemente as melhores opções neste setor em evolução, com compromisso de transparência em nossa jornada.
            </p>
          ),
        },
        {
          title: 'Como meus dados e privacidade são tratados?',
          content: (
            <p>
              Sua privacidade e proteção de dados são muito importantes para nós. Seus dados pessoais são tratados conforme a{' '}
              <a href={`${p}/privacy`}>política de privacidade</a> da {BRAND}.
            </p>
          ),
        },
      ],
    },
    {
      heading: 'Visite-nos',
      items: [
        {
          title: 'Onde fica a boutique mais próxima?',
          content: <p>Entre em contato com o Atendimento ao Cliente em {SUPPORT_EMAIL} para localizar boutiques. Nossas equipes aguardam você de braços abertos.</p>,
        },
      ],
    },
  ];
}
