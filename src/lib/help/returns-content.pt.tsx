import { LEGAL_PROSE } from '@/lib/help/legal-prose';
import { CONTACT_EMAIL, CONTACT_PHONES } from '@/lib/help/contact-info';

export function ReturnsContentPt({ locale }: { locale: string }) {
  const termsHref = `/${locale}/terms`;

  return (
    <article className={LEGAL_PROSE}>
      <p>
        Todos os termos definidos utilizados abaixo terão os significados estabelecidos em nossos{' '}
        <a href={termsHref}>Termos e Condições</a>.
      </p>

      <section>
        <h2>CANCELAMENTO DE PEDIDOS</h2>
        <p>
          Pedidos que você envia online são processados imediatamente e não podem ser cancelados. Você precisa aguardar
          até receber a mercadoria para devolvê-la.
        </p>
      </section>

      <section>
        <h2>DEVOLUÇÕES</h2>
        <p>Uma vez que um item de mercadoria é entregue a você:</p>
        <ul>
          <li>Devoluções feitas em até 7 dias após a entrega são elegíveis para reembolso integral.</li>
          <li>Devoluções feitas entre 8 e 30 dias receberão crédito na loja.</li>
          <li>
            Para se qualificarem, os itens devem estar sem uso, sem danos e em sua embalagem original.
          </li>
          <li>
            Itens em liquidação final, cartões-presente e mercadorias usadas ou danificadas não podem ser devolvidos,
            reembolsados ou trocados.
          </li>
        </ul>
      </section>

      <section>
        <h2>ENVIO</h2>
        <p>
          Para iniciar uma devolução, envie um e-mail para <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          Exigimos recibo ou comprovante de compra acompanhando sua devolução.
        </p>
        <p>Toda a mercadoria devolvida deve ser enviada para nós em:</p>
        <address className="space-y-1">
          <p>Sinesia Karol</p>
          <p>Attn: DEVOLUÇÕES (Nº do Pedido #_____)</p>
          <p>135 Spring Street</p>
          <p>Newport, Rhode Island 02840</p>
          <p>
            <a href={CONTACT_PHONES.us.href}>{CONTACT_PHONES.us.display}</a>
          </p>
        </address>
        <p>
          Para itens fabricados por outra parte e revendidos por Nós, não envie tais itens de volta ao fabricante.
        </p>
        <p>
          Você é responsável por pagar todos os custos de envio do seu item devolvido. Os custos de envio não são
          reembolsáveis. Se você receber um reembolso, o custo de qualquer envio de devolução será deduzido do seu
          reembolso. Você deve considerar usar um serviço de envio com rastreamento ou contratar seguro de envio para
          itens de valor.
        </p>
        <p>
          Dependendo de onde você mora, o tempo que pode levar para seu produto trocado chegar até você pode variar.
        </p>
      </section>

      <section>
        <h2>REEMBOLSOS E TROCAS</h2>
        <p>
          Depois que Nós recebermos sua devolução válida, enviaremos um e-mail para notificá-lo de que Nós recebemos
          seu item devolvido e informá-lo sobre a aceitação ou rejeição de sua devolução.
        </p>
        <p>
          Se sua devolução for aceita por Nós, forneceremos uma das seguintes opções em prazo razoável: troca de
          mercadoria pelo item devolvido, crédito de mercadoria intransferível, crédito no cartão de pagamento ou
          método de pagamento original usado para pagar o item, ou outro recurso que determinarmos de boa-fé como
          apropriado nas circunstâncias.
        </p>
        <p>
          Só substituímos itens se estiverem defeituosos ou danificados na chegada. Se você precisar fazer uma troca
          desses itens, envie um e-mail para <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> e responderemos
          com instruções sobre como proceder.
        </p>
      </section>

      <section>
        <h2>REEMBOLSOS ATRASADOS OU AUSENTES (se aplicável)</h2>
        <p>Se você ainda não recebeu um reembolso, primeiro verifique novamente sua conta bancária.</p>
        <p>
          Depois contate a operadora do seu cartão de crédito; pode levar algum tempo até que seu reembolso seja
          oficialmente lançado.
        </p>
        <p>
          Em seguida, contate seu banco. Frequentemente há algum tempo de processamento antes que um reembolso seja
          lançado.
        </p>
        <p>
          Se você fez tudo isso e ainda não recebeu seu reembolso, entre em contato conosco em{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>GERAL</h2>
        <p>
          Se você não cumprir qualquer das condições acima, reservamo-nos o direito de recusar a devolução ou troca, ou
          de impor condições diferentes ou adicionais.
        </p>
      </section>
    </article>
  );
}
