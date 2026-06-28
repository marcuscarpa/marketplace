import { LEGAL_PROSE } from '@/lib/help/legal-prose';

const SITE = 'sinesiakarol.us';
const EMAIL = 'orders@sinesiakarol.us';

const necessaryCookies = [
  ['_ab', 'Usado em conexão com acesso ao admin.', '2y'],
  ['_secure_session_id', 'Usado em conexão com a navegação em uma vitrine.', '24h'],
  ['_shopify_country', 'Usado em conexão com o checkout.', 'session'],
  ['_shopify_m', 'Usado para gerenciar configurações de privacidade do cliente.', '1y'],
  ['_shopify_tm', 'Usado para gerenciar configurações de privacidade do cliente.', '30min'],
  ['_shopify_tw', 'Usado para gerenciar configurações de privacidade do cliente.', '2w'],
  ['_storefront_u', 'Usado para facilitar a atualização de informações da conta do cliente.', '1min'],
  ['_tracking_consent', 'Preferências de rastreamento.', '1y'],
  ['c', 'Usado em conexão com o checkout.', '1y'],
  ['cart', 'Usado em conexão com o carrinho de compras.', '2w'],
  ['cart_currency', 'Usado em conexão com o carrinho de compras.', '2w'],
  ['cart_sig', 'Usado em conexão com o checkout.', '2w'],
  ['cart_ts', 'Usado em conexão com o checkout.', '2w'],
  ['cart_ver', 'Usado em conexão com o carrinho de compras.', '2w'],
  ['checkout', 'Usado em conexão com o checkout.', '4w'],
  ['checkout_token', 'Usado em conexão com o checkout.', '1y'],
  ['dynamic_checkout_shown_on_cart', 'Usado em conexão com o checkout.', '30min'],
  ['hide_shopify_pay_for_checkout', 'Usado em conexão com o checkout.', 'session'],
  ['keep_alive', 'Usado em conexão com a localização do comprador.', '2w'],
  ['master_device_id', 'Usado em conexão com login do comerciante.', '2y'],
  ['previous_step', 'Usado em conexão com o checkout.', '1y'],
  ['remember_me', 'Usado em conexão com o checkout.', '1y'],
  ['secure_customer_sig', 'Usado em conexão com login do cliente.', '20y'],
  ['shopify_pay', 'Usado em conexão com o checkout.', '1y'],
  ['shopify_pay_redirect', 'Usado em conexão com o checkout.', '30 minutes, 3w or 1y depending on value'],
  ['storefront_digest', 'Usado em conexão com login do cliente.', '2y'],
  ['tracked_start_checkout', 'Usado em conexão com o checkout.', '1y'],
  ['checkout_one_experiment', 'Usado em conexão com o checkout.', 'session'],
] as const;

const analyticsCookies = [
  ['_landing_page', 'Rastreia páginas de destino.', '2w'],
  ['_orig_referrer', 'Rastreia páginas de destino.', '2w'],
  ['_s', 'Analytics Shopify.', '30min'],
  ['_shopify_d', 'Analytics Shopify.', 'session'],
  ['_shopify_s', 'Analytics Shopify.', '30min'],
  ['_shopify_sa_p', 'Analytics Shopify relacionado a marketing e indicações.', '30min'],
  ['_shopify_sa_t', 'Analytics Shopify relacionado a marketing e indicações.', '30min'],
  ['_shopify_y', 'Analytics Shopify.', '1y'],
  ['_y', 'Analytics Shopify.', '1y'],
  ['_shopify_evids', 'Analytics Shopify.', 'session'],
  ['_shopify_ga', 'Shopify e Google Analytics.', 'session'],
] as const;

function CookieTable({ rows }: { rows: readonly (readonly [string, string, string])[] }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Nome</th>
          <th>Função</th>
          <th>Duração</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(([name, fn, duration]) => (
          <tr key={name}>
            <td>{name}</td>
            <td>{fn}</td>
            <td>{duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function InfoBlock({
  purpose,
  source,
  disclosure,
  collected,
}: {
  purpose: string;
  source: string;
  disclosure: string;
  collected: string;
}) {
  return (
    <div className="space-y-2 border-l-2 border-neutral-200 pl-4">
      <p>
        <strong>Finalidade da coleta:</strong> {purpose}
      </p>
      <p>
        <strong>Origem da coleta:</strong> {source}
      </p>
      <p>
        <strong>Divulgação para fins comerciais:</strong> {disclosure}
      </p>
      <p>
        <strong>Informações pessoais coletadas:</strong> {collected}
      </p>
    </div>
  );
}

export function PrivacyContentPt({ locale }: { locale: string }) {
  const cookiesHref = `/${locale}/cookies`;

  return (
    <article className={LEGAL_PROSE}>
      <p className="text-neutral-500">Última atualização: 27 de maio de 2026</p>

      <p>
        Esta Política de Privacidade descreve como {SITE} (o &quot;Site&quot; ou &quot;nós&quot;) coleta, usa e
        divulga suas Informações Pessoais quando você visita ou faz uma compra no Site.
      </p>

      <section>
        <h2>Contato</h2>
        <p>
          Após revisar esta política, se tiver dúvidas adicionais, quiser mais informações sobre nossas práticas de
          privacidade ou desejar registrar uma reclamação, entre em contato conosco por e-mail em{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a> ou por correio usando os dados abaixo:
        </p>
        <p>135 Spring Street, Newport, RI 02840, USA</p>
      </section>

      <section>
        <h2>Coleta de Informações Pessoais</h2>
        <p>
          Quando você visita o Site, coletamos certas informações sobre seu dispositivo, sua interação com o Site e
          informações necessárias para processar suas compras. Também podemos coletar informações adicionais se você
          entrar em contato conosco para suporte ao cliente. Nesta Política de Privacidade, referimo-nos a qualquer
          informação sobre um indivíduo identificável (incluindo as informações abaixo) como &quot;Informações
          Pessoais&quot;. Consulte a lista abaixo para mais informações sobre quais Informações Pessoais coletamos e
          por quê.
        </p>

        <h3>Informações do dispositivo</h3>
        <InfoBlock
          purpose="carregar o Site corretamente para você e realizar análises de uso do Site para otimizá-lo."
          source="Coletadas automaticamente quando você acessa nosso Site usando cookies, arquivos de log, web beacons, tags ou pixels."
          disclosure="compartilhadas com nosso processador Shopify."
          collected="versão do navegador web, endereço IP, fuso horário, informações de cookies, quais sites ou produtos você visualiza, termos de busca e como você interage com o Site."
        />

        <h3>Informações do pedido</h3>
        <InfoBlock
          purpose="fornecer produtos ou serviços a você para cumprir nosso contrato, processar suas informações de pagamento, organizar o envio e fornecer faturas e/ou confirmações de pedido, comunicar-se com você, analisar nossos pedidos quanto a risco ou fraude potencial e, de acordo com as preferências que você compartilhou conosco, fornecer informações ou publicidade relacionadas aos nossos produtos ou serviços."
          source="coletadas de você."
          disclosure="compartilhadas com nosso processador Shopify."
          collected="nome, endereço de cobrança, endereço de entrega, informações de pagamento (incluindo números de cartão de crédito), endereço de e-mail e número de telefone."
        />

        <h3>Informações de suporte ao cliente</h3>
        <InfoBlock
          purpose="fornecer suporte ao cliente."
          source="coletadas de você."
          disclosure=""
          collected=""
        />
      </section>

      <section>
        <h2>Menores de Idade</h2>
        <p>
          O Site não se destina a indivíduos menores de 13 anos. Não coletamos intencionalmente Informações Pessoais de
          crianças. Se você é pai, mãe ou responsável legal e acredita que seu filho nos forneceu Informações Pessoais,
          entre em contato conosco no endereço acima para solicitar a exclusão.
        </p>
      </section>

      <section>
        <h2>Compartilhamento de Informações Pessoais</h2>
        <p>
          Compartilhamos suas Informações Pessoais com prestadores de serviços para nos ajudar a fornecer nossos
          serviços e cumprir nossos contratos com você, conforme descrito acima. Por exemplo:
        </p>
        <ul>
          <li>
            Usamos a Shopify para operar nossa loja online. Você pode ler mais sobre como a Shopify usa suas Informações
            Pessoais aqui:{' '}
            <a href="https://www.shopify.com/legal/privacy" target="_blank" rel="noopener noreferrer">
              https://www.shopify.com/legal/privacy
            </a>
            .
          </li>
          <li>
            Podemos compartilhar suas Informações Pessoais para cumprir leis e regulamentos aplicáveis, responder a
            intimações, mandados de busca ou outras solicitações legais de informações que recebemos, ou proteger nossos
            direitos de outra forma.
          </li>
        </ul>
      </section>

      <section>
        <h2>Publicidade Comportamental</h2>
        <p>
          Conforme descrito acima, usamos suas Informações Pessoais para fornecer anúncios direcionados ou comunicações
          de marketing que acreditamos ser do seu interesse. Por exemplo:
        </p>
        <ul>
          <li>
            Usamos o Google Analytics para nos ajudar a entender como nossos clientes usam o Site. Você pode ler mais
            sobre como o Google usa suas Informações Pessoais aqui:{' '}
            <a href="https://www.google.com/intl/en/policies/privacy/" target="_blank" rel="noopener noreferrer">
              https://www.google.com/intl/en/policies/privacy/
            </a>
            . Você também pode cancelar a participação no Google Analytics aqui:{' '}
            <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">
              https://tools.google.com/dlpage/gaoptout
            </a>
            .
          </li>
          <li>
            Para mais informações sobre como funciona a publicidade direcionada, você pode visitar a página educativa
            da Network Advertising Initiative (&quot;NAI&quot;) em{' '}
            <a
              href="https://www.networkadvertising.org/understanding-online-advertising/how-does-it-work"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://www.networkadvertising.org/understanding-online-advertising/how-does-it-work
            </a>
            .
          </li>
        </ul>
        <p>Você pode cancelar a publicidade direcionada por meio de:</p>
        <ul>
          <li>
            FACEBOOK –{' '}
            <a href="https://www.facebook.com/settings/?tab=ads" target="_blank" rel="noopener noreferrer">
              https://www.facebook.com/settings/?tab=ads
            </a>
          </li>
          <li>
            GOOGLE –{' '}
            <a href="https://www.google.com/settings/ads/anonymous" target="_blank" rel="noopener noreferrer">
              https://www.google.com/settings/ads/anonymous
            </a>
          </li>
          <li>
            BING –{' '}
            <a
              href="https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://advertise.bingads.microsoft.com/en-us/resources/policies/personalized-ads
            </a>
          </li>
        </ul>
        <p>
          Além disso, você pode cancelar a participação em alguns desses serviços visitando o portal de opt-out da
          Digital Advertising Alliance em:{' '}
          <a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer">
            https://optout.aboutads.info/
          </a>
          .
        </p>
      </section>

      <section>
        <h2>Uso de Informações Pessoais</h2>
        <p>
          Usamos suas Informações Pessoais para fornecer nossos serviços a você, o que inclui: oferecer produtos à
          venda, processar pagamentos, enviar e cumprir seu pedido e mantê-lo informado sobre novos produtos, serviços e
          ofertas.
        </p>
      </section>

      <section>
        <h2>Base Legal</h2>
        <p>
          De acordo com o Regulamento Geral sobre a Proteção de Dados (&quot;GDPR&quot;), se você for residente do
          Espaço Econômico Europeu (&quot;EEE&quot;), processamos suas informações pessoais com base nas seguintes bases
          legais:
        </p>
        <ul>
          <li>Seu consentimento;</li>
          <li>A execução do contrato entre você e o Site;</li>
          <li>Cumprimento de nossas obrigações legais;</li>
          <li>Proteção de seus interesses vitais;</li>
          <li>Execução de tarefa realizada no interesse público;</li>
          <li>Para nossos interesses legítimos, que não prevalecem sobre seus direitos e liberdades fundamentais.</li>
        </ul>
      </section>

      <section>
        <h2>Retenção</h2>
        <p>
          Quando você faz um pedido pelo Site, reteremos suas Informações Pessoais em nossos registros, salvo se e até
          que você nos solicite apagar essas informações. Para mais informações sobre seu direito de apagamento,
          consulte a seção &apos;Seus direitos&apos; abaixo.
        </p>
      </section>

      <section>
        <h2>Decisão Automatizada</h2>
        <p>
          Se você for residente do EEE, tem o direito de se opor ao processamento baseado exclusivamente em decisão
          automatizada (que inclui perfilamento), quando essa decisão tiver efeito legal sobre você ou afetá-lo
          significativamente de outra forma.
        </p>
        <p>
          Não realizamos decisão totalmente automatizada com efeito legal ou significativo usando dados de clientes.
        </p>
        <p>
          Nosso processador Shopify usa decisão automatizada limitada para prevenir fraudes, sem efeito legal ou
          significativo sobre você.
        </p>
        <p>Serviços que incluem elementos de decisão automatizada incluem:</p>
        <ul>
          <li>
            Lista negra temporária de endereços IP associados a transações falhas repetidas. Essa lista persiste por
            algumas horas.
          </li>
          <li>
            Lista negra temporária de cartões de crédito associados a endereços IP na lista negra. Essa lista persiste
            por alguns dias.
          </li>
        </ul>
      </section>

      <section>
        <h2>Seus Direitos</h2>
        <h3>GDPR</h3>
        <p>
          Se você for residente do EEE, tem o direito de acessar as Informações Pessoais que mantemos sobre você,
          portá-las para um novo serviço e solicitar que suas Informações Pessoais sejam corrigidas, atualizadas ou
          apagadas. Se desejar exercer esses direitos, entre em contato conosco pelas informações de contato acima.
        </p>
        <p>
          Suas Informações Pessoais serão inicialmente processadas na Irlanda e depois transferidas para fora da Europa
          para armazenamento e processamento adicional, incluindo Canadá e Estados Unidos. Para mais informações sobre
          como as transferências de dados cumprem o GDPR, consulte o GDPR Whitepaper da Shopify:{' '}
          <a
            href="https://help.shopify.com/en/manual/your-account/privacy/GDPR"
            target="_blank"
            rel="noopener noreferrer"
          >
            https://help.shopify.com/en/manual/your-account/privacy/GDPR
          </a>
          .
        </p>
        <h3>CCPA</h3>
        <p>
          Se você for residente da Califórnia, tem o direito de acessar as Informações Pessoais que mantemos sobre você
          (também conhecido como &apos;Direito de Saber&apos;), portá-las para um novo serviço e solicitar que suas
          Informações Pessoais sejam corrigidas, atualizadas ou apagadas. Se desejar exercer esses direitos, entre em
          contato conosco pelas informações de contato acima.
        </p>
        <p>
          Se desejar designar um agente autorizado para enviar essas solicitações em seu nome, entre em contato conosco
          no endereço acima.
        </p>
      </section>

      <section>
        <h2>Cookies</h2>
        <p>
          Um cookie é uma pequena quantidade de informação baixada para seu computador ou dispositivo quando você visita
          nosso Site. Usamos vários cookies diferentes, incluindo funcionais, de desempenho, publicidade e mídia social
          ou conteúdo. Os cookies melhoram sua experiência de navegação permitindo que o site lembre suas ações e
          preferências (como login e seleção de região). Isso significa que você não precisa inserir essas informações
          toda vez que retorna ao site ou navega de uma página para outra. Os cookies também fornecem informações sobre
          como as pessoas usam o site, por exemplo, se é a primeira visita ou se são visitantes frequentes.
        </p>
        <p>Usamos os seguintes cookies para otimizar sua experiência em nosso Site e fornecer nossos serviços.</p>
        <p>
          Certifique-se de verificar esta lista em relação à lista atual de cookies da Shopify na vitrine do
          comerciante:{' '}
          <a href="https://www.shopify.com/legal/cookies" target="_blank" rel="noopener noreferrer">
            https://www.shopify.com/legal/cookies
          </a>
        </p>

        <h3>Cookies Necessários para o Funcionamento da Loja</h3>
        <CookieTable rows={necessaryCookies} />

        <h3>Relatórios e Analytics</h3>
        <CookieTable rows={analyticsCookies} />

        <p>
          O tempo que um cookie permanece em seu computador ou dispositivo móvel depende de ser um cookie
          &quot;persistente&quot; ou de &quot;sessão&quot;. Cookies de sessão duram até você parar de navegar e cookies
          persistentes duram até expirarem ou serem excluídos. A maioria dos cookies que usamos é persistente e expirará
          entre 30 minutos e dois anos a partir da data em que foram baixados para seu dispositivo.
        </p>
        <p>
          Você pode controlar e gerenciar cookies de várias formas. Lembre-se de que remover ou bloquear cookies pode
          impactar negativamente sua experiência de usuário e partes de nosso site podem deixar de estar totalmente
          acessíveis.
        </p>
        <p>
          A maioria dos navegadores aceita cookies automaticamente, mas você pode escolher aceitar ou não cookies por
          meio dos controles do navegador, frequentemente encontrados no menu &quot;Ferramentas&quot; ou
          &quot;Preferências&quot; do navegador. Para mais informações sobre como modificar as configurações do
          navegador ou como bloquear, gerenciar ou filtrar cookies, consulte o arquivo de ajuda do navegador ou sites
          como:{' '}
          <a href="https://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
            www.allaboutcookies.org
          </a>
          . Consulte também nossa <a href={cookiesHref}>Política de Cookies</a>.
        </p>
        <p>
          Além disso, observe que bloquear cookies pode não impedir completamente como compartilhamos informações com
          terceiros, como nossos parceiros de publicidade. Para exercer seus direitos ou cancelar certos usos de suas
          informações por essas partes, siga as instruções na seção &quot;Publicidade Comportamental&quot; acima.
        </p>
      </section>

      <section>
        <h2>Do Not Track</h2>
        <p>
          Observe que, como não há entendimento consistente na indústria sobre como responder a sinais &quot;Do Not
          Track&quot;, não alteramos nossas práticas de coleta e uso de dados quando detectamos tal sinal do seu
          navegador.
        </p>
      </section>

      <section>
        <h2>Alterações</h2>
        <p>
          Podemos atualizar esta Política de Privacidade periodicamente para refletir, por exemplo, alterações em
          nossas práticas ou por outros motivos operacionais, legais ou regulatórios.
        </p>
      </section>

      <section>
        <h2>Reclamações</h2>
        <p>
          Conforme observado acima, se desejar registrar uma reclamação, entre em contato conosco por e-mail ou correio
          usando os dados fornecidos em &quot;Contato&quot; acima.
        </p>
        <p>
          Se não estiver satisfeito com nossa resposta à sua reclamação, você tem o direito de registrar sua
          reclamação junto à autoridade de proteção de dados relevante. Você pode contatar sua autoridade local de
          proteção de dados ou nossa autoridade supervisora aqui:{' '}
          <a href="https://ico.org.uk/make-a-complaint/" target="_blank" rel="noopener noreferrer">
            https://ico.org.uk/make-a-complaint/
          </a>
        </p>
      </section>

      <p>
        Este site é protegido pelo reCAPTCHA e a{' '}
        <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">
          Política de Privacidade do Google
        </a>{' '}
        e os{' '}
        <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer">
          Termos de Serviço do Google
        </a>{' '}
        se aplicam.
      </p>
    </article>
  );
}
