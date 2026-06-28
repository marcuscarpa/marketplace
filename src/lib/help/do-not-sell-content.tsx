const BRAND = 'Sinesia Karol';
const PRIVACY_EMAIL = 'privacy@sinesiakarol.com';

export function DoNotSellContent({ locale }: { locale: string }) {
  const isPt = locale === 'pt';

  if (isPt) {
    return (
      <div className="space-y-6 font-sans-ui text-sm leading-relaxed text-neutral-700 [&_a]:underline [&_a]:underline-offset-2">
        <p>
          A {BRAND} <strong>não vende</strong> suas informações pessoais. Não compartilhamos seus dados com terceiros em
          troca de compensação monetária, nem vendemos ou alugamos suas informações a anunciantes ou corretores de dados.
        </p>
        <p>
          Podemos compartilhar informações limitadas com prestadores de serviços (pagamentos, envios, hospedagem, suporte
          ao cliente) apenas para operar a loja e cumprir pedidos — nunca como venda de suas informações.
        </p>
        <p>
          Se você reside na Califórnia ou em outra jurisdição com direitos semelhantes, pode solicitar confirmação, acesso
          ou exclusão de seus dados entrando em contato com{' '}
          <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>. Responderemos dentro dos prazos legais aplicáveis.
        </p>
        <p>
          Para mais detalhes sobre como tratamos seus dados, consulte nossa{' '}
          <a href={`/${locale}/privacy`}>Política de Privacidade</a>.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans-ui text-sm leading-relaxed text-neutral-700 [&_a]:underline [&_a]:underline-offset-2">
      <p>
        {BRAND} <strong>does not sell</strong> your personal information. We do not share your data with third parties
        in exchange for money, and we do not sell or rent your information to advertisers or data brokers.
      </p>
      <p>
        We may share limited information with service providers (payments, shipping, hosting, customer support) solely
        to operate the store and fulfill orders — never as a sale of your information.
      </p>
      <p>
        If you are a California resident or live in a jurisdiction with similar rights, you may request confirmation,
        access, or deletion of your data by contacting{' '}
        <a href={`mailto:${PRIVACY_EMAIL}`}>{PRIVACY_EMAIL}</a>. We will respond within applicable legal timeframes.
      </p>
      <p>
        For more detail on how we handle your data, see our{' '}
        <a href={`/${locale}/privacy`}>Privacy Policy</a>.
      </p>
    </div>
  );
}
