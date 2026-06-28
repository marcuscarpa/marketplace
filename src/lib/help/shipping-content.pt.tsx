import type { HelpAccordionItem } from '@/components/help/help-accordion';

const BRAND = 'Sinesia Karol';
const SUPPORT_EMAIL = 'hello@sinesiakarol.com';

function usShippingTable() {
  return (
    <table>
      <thead>
        <tr>
          <th>Opção de envio</th>
          <th>Preço de entrega</th>
          <th>Prazo de entrega</th>
          <th>Períodos de promoção</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Ground</td>
          <td>Grátis para todos os pedidos.</td>
          <td>
            A entrega Ground pode ser esperada em 2–5 dias úteis. Algumas localidades podem levar mais 1–2 dias úteis.
            Entrega aos sábados pode estar disponível para endereços residenciais.
          </td>
          <td>Durante períodos de promoção, as entregas podem levar mais 1–2 dias úteis.</td>
        </tr>
        <tr>
          <td>Express</td>
          <td>USD $15 em todos os pedidos.</td>
          <td>A entrega Express pode ser esperada em 1–3 dias úteis.</td>
          <td>Durante períodos de promoção, as entregas podem levar mais 1–2 dias úteis.</td>
        </tr>
        <tr>
          <td>Next Day</td>
          <td>USD $30 em todos os pedidos.</td>
          <td>
            Pedidos até 12h EST para entrega no próximo dia útil até 20h. Pedidos após 12h EST serão entregues em 2 dias
            úteis.
          </td>
          <td>
            Durante períodos de promoção, pedidos até 10h EST para entrega no próximo dia útil até 20h EST.
          </td>
        </tr>
        <tr>
          <td>Retirada na Boutique</td>
          <td>Gratuita para todos os pedidos.</td>
          <td>Os pedidos estarão prontos para retirada em 1 dia útil.</td>
          <td>Durante períodos de promoção, o processamento do pedido pode levar mais 1–2 dias.</td>
        </tr>
      </tbody>
    </table>
  );
}

export function getShippingStepsPt() {
  return [
    { label: 'Crie Seu Pedido', icon: 'order' as const },
    { label: 'Processe Seu Pedido', icon: 'process' as const },
    { label: 'Envie com a Transportadora', icon: 'courier' as const },
    { label: 'Rastreie o Pedido', icon: 'track' as const },
    { label: 'Receba Seus Itens', icon: 'receive' as const },
  ] as const;
}

export function getShippingSectionsPt(): HelpAccordionItem[] {
  return [
    {
      title: 'Processamento de Pedidos e Prazos de Entrega',
      content: (
        <>
          <p>
            <strong>ESTADOS UNIDOS</strong>
          </p>
          {usShippingTable()}
          <p>
            <strong>INTERNACIONAL</strong>
            <br />
            Inclui apenas Porto Rico.
          </p>
          <table>
            <thead>
              <tr>
                <th>Opção de envio</th>
                <th>Preço de entrega</th>
                <th>Prazo de entrega</th>
                <th>Períodos de promoção</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Express</td>
                <td>Grátis para pedidos acima de USD $500. Pedidos abaixo de USD $500 serão cobrados USD $15.</td>
                <td>
                  A entrega Express pode ser esperada em 2–4 dias úteis. Algumas localidades podem levar mais 1–2 dias
                  úteis. Será exigida assinatura na entrega.
                </td>
                <td>Durante períodos de promoção, a entrega express pode levar mais 1–2 dias.</td>
              </tr>
            </tbody>
          </table>
          <p>
            Todos os pedidos são processados em 1 dia útil e enviados de segunda a sexta. Todas as entregas devem ser
            assinadas. Certifique-se de que alguém estará disponível entre 9h e 20h para assinar a entrega.
          </p>
          <p>
            Nota: A data estimada de entrega fornecida no checkout é uma estimativa e pode estar sujeita a alterações.
            Para informações mais detalhadas sobre a entrega, clique no link de rastreamento no e-mail de confirmação de
            envio.
          </p>
        </>
      ),
    },
    {
      title: 'Opções de Embalagem',
      content: (
        <>
          <p>
            A Boutique Online {BRAND} oferece atualmente duas opções de embalagem para você escolher durante o checkout:
          </p>
          <p>
            <strong>SIGNATURE</strong>
            <br />
            Você pode optar por enviar com nossa embalagem de presente signature para sua experiência de presenteio.
            Nossas caixas de presente signature atualmente não são recicláveis. Estamos trabalhando para eliminá-las e
            substituí-las por uma nova caixa de presente signature 100% reciclável.
          </p>
          <p>
            <strong>ECO</strong>
            <br />
            Alternativamente, você pode optar por enviar com nossa opção de embalagem reciclável e ecológica. Nossa
            opção eco usa menos embalagem para reduzir os materiais utilizados. Nossas caixas eco são feitas com
            percentual de material reciclado e são totalmente recicláveis.
          </p>
          <p>
            Nota: Ao fazer um pedido pelo Apple Pay, você não terá a opção de selecionar uma opção de embalagem. Seu
            pedido será enviado em nossa opção de embalagem eco. Se desejar alterar isso, entre em contato com nossa
            equipe de Atendimento ao Cliente em{' '}
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
          </p>
        </>
      ),
    },
    {
      title: 'Recebimento do Pedido — Assinatura Obrigatória',
      content: (
        <>
          <p>
            Após o envio do seu pedido, um número de rastreamento exclusivo será enviado ao endereço de e-mail
            informado. Você pode rastrear seu pedido clicando no link fornecido no e-mail de envio.
          </p>
          <p>
            Todas as entregas devem ser assinadas. Certifique-se de que alguém estará disponível para assinar a entrega
            entre 9h e 18h.
          </p>
          <p>
            Não podemos entregar em endereços de PO Box, armários de encomendas ou redirecionadores de carga. Pedidos
            para esses endereços podem ser cancelados.
          </p>
          <p>
            Pedidos com vários itens podem ser enviados em mais de uma entrega. Isso será indicado pelo recebimento de
            vários e-mails de confirmação de envio.
          </p>
        </>
      ),
    },
    {
      title: 'Serviço de Entrega Next Day',
      content: (
        <>
          <p>
            Para todos os pedidos nos EUA, a Boutique Online {BRAND} oferece opção de entrega Next Day no checkout.
          </p>
          <p>
            Para usar este serviço, você deve fazer seu pedido antes das 12h EST, de segunda a sexta, para entrega no
            próximo dia útil até 20h.
          </p>
          <p>
            Se seu pedido for feito após 12h EST de segunda a sexta, será entregue em 2 dias úteis.
          </p>
          <p>Todos os pedidos feitos no sábado e domingo serão entregues na terça-feira seguinte.</p>
        </>
      ),
    },
    {
      title: 'Retirada na Boutique',
      content: (
        <p>
          Agora oferecemos serviço gratuito de Retirada na Boutique. Este serviço permite comprar itens online e
          retirar em uma boutique {BRAND} selecionada, sujeito à elegibilidade do item e da boutique.
        </p>
      ),
    },
    {
      title: 'Parceiros de Entrega',
      content: (
        <>
          <p>
            <strong>Ground</strong> — Para entrega nos EUA, usamos o serviço FedEx Ground e Home Delivery.
          </p>
          <p>
            <strong>Express</strong> — Para entrega nos EUA, incluindo Porto Rico, usamos o serviço FedEx Express Saver.
          </p>
          <p>
            <strong>Internacional</strong> — Para entrega fora dos EUA, exceto Porto Rico, usamos o serviço DHL Express
            International.
          </p>
          <p>
            <strong>Next Day</strong> — Para entrega Next Day, usamos FedEx Standard Overnight. Disponível apenas para
            pedidos domésticos nos EUA.
          </p>
        </>
      ),
    },
    {
      title: 'Moeda, Taxas e Impostos',
      content: (
        <>
          <p>
            Todos os preços de produtos indicados e pagamentos feitos no site da Boutique Online dos EUA estão em moeda
            USD.
          </p>
          <p>
            Para Porto Rico, os envios são entregues com base Delivery Duty Paid (DDP) — todos os direitos, impostos e
            taxas aplicáveis estão incluídos no valor total do pedido no checkout.
          </p>
          <p>
            Para os Estados Unidos, os pedidos incluirão impostos locais exibidos no valor total do pedido no checkout.
            Imposto sobre vendas será adicionado ao total do pedido no checkout, quando aplicável.
          </p>
          <p>
            Se desejar devolver um item, a {BRAND} não reembolsa direitos e impostos internacionais pré-pagos pagos no
            checkout para pedidos Delivered Duties Paid (DDP).
          </p>
        </>
      ),
    },
    {
      title: 'Disponibilidade de Itens',
      content: (
        <p>
          Ocasionalmente, os níveis de estoque na Boutique Online podem não estar atualizados. Se um item do seu pedido
          estiver indisponível, você será notificado por e-mail o mais rápido possível e receberá uma substituição
          adequada ou reembolso integral.
        </p>
      ),
    },
    {
      title: 'Política de Limite de Compra',
      content: (
        <>
          <p>
            Para proporcionar uma melhor experiência a todos os clientes, a {BRAND} possui os seguintes limites de
            compra por cliente:
          </p>
          <ul>
            <li>
              Boutiques e Online: Não mais que três (3) unidades por estilo e cor, independentemente de preço cheio ou
              markdown.
            </li>
            <li>Outlets: Não mais que três (3) unidades por estilo e cor.</li>
          </ul>
          <p>
            Esta política pode ser alterada a qualquer momento. A {BRAND} pode recusar concluir uma transação de venda
            se os limites de compra não forem respeitados.
          </p>
        </>
      ),
    },
    {
      title: 'Alterações no Seu Pedido',
      content: (
        <p>
          Embora a {BRAND} não possa garantir alterações ou cancelamento de um pedido após sua realização, recomendamos
          que entre em contato com o Atendimento ao Cliente o mais rápido possível em{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>, e nossa equipe sempre se esforçará para ajudar
          quando viável.
        </p>
      ),
    },
    {
      title: 'Detalhes do Pedido e Pagamentos',
      content: (
        <>
          <p>
            Os detalhes do pedido estão disponíveis nos e-mails de confirmação de pedido e em Minha Conta para clientes
            que estavam logados ao fazer o pedido.
          </p>
          <p>
            Os seguintes métodos de pagamento são aceitos na Boutique Online: cartão de crédito (Visa, Mastercard,
            American Express) e PayPal.
          </p>
          <p>
            O processamento de transações é baseado nos EUA; seu banco pode aplicar taxas de transação internacional.
          </p>
        </>
      ),
    },
    {
      title: 'Verificações de Segurança',
      content: (
        <p>
          Nosso sistema realiza verificações de segurança em transações aleatoriamente. Se seu pedido for selecionado,
          nossa equipe de Atendimento ao Cliente entrará em contato para solicitar informações adicionais, que podem
          incluir cópia eletrônica de documento de identidade emitido pelo governo. Se não houver resposta em 48 horas,
          os pedidos podem ser cancelados.
        </p>
      ),
    },
    {
      title: 'Política de Promoções',
      content: (
        <p>
          Promoções incluem apenas estilos selecionados e excluem todas as coleções da nova temporada. Os preços
          promocionais são conforme indicado e válidos online na América do Norte e Caribe. A Boutique Online {BRAND}{' '}
          não oferece ajustes de preço promocional ou qualquer forma de equalização de preços. As promoções estão
          sujeitas a alterações sem aviso prévio e estritamente enquanto durarem os estoques.
        </p>
      ),
    },
  ];
}
