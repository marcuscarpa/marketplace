import { LEGAL_PROSE } from '@/lib/help/legal-prose';

const EMAIL = 'business@sinesiakarol.com';
const PHONE = '401-847-1087';

export function ReturnsContentPt({ locale }: { locale: string }) {
  const termsHref = `/${locale}/terms`;

  return (
    <article className={LEGAL_PROSE}>
      <p>
        Todos os termos definidos utilizados abaixo terão os significados estabelecidos em nossos{' '}
        <a href={termsHref}>Termos e Condições</a>.
      </p>

      <section>
        <h2>Cancelamento de Pedidos</h2>
        <p>
          Pedidos enviados online são processados imediatamente e não podem ser cancelados. Você precisa aguardar
          receber a mercadoria para poder devolvê-la.
        </p>
      </section>

      <section>
        <h2>Devoluções</h2>
        <p>
          Uma vez entregue um item, você pode devolvê-lo em até 7 dias após a entrega para reembolso integral. Todas
          as devoluções feitas após 7 dias receberão crédito na loja. Para ser elegível à devolução, sua mercadoria
          deve estar sem uso, nas mesmas condições em que foi recebida e na embalagem original. Nossa política de
          devolução não se aplica aos seguintes produtos: itens com desconto ou em liquidação final, cartões-presente e
          produtos usados ou danificados. Esses itens não são elegíveis para devolução, reembolso ou troca.
        </p>
      </section>

      <section>
        <h2>Envio</h2>
        <p>
          Para iniciar uma devolução, envie um e-mail para <a href={`mailto:${EMAIL}`}>{EMAIL}</a>. Exigimos recibo ou
          comprovante de compra junto com sua devolução.
        </p>
        <p>Toda mercadoria devolvida deve ser enviada para:</p>
        <address className="space-y-1">
          <p>Sinesia Karol</p>
          <p>Attn: RETURNS (Order #_____)</p>
          <p>135 Spring Street</p>
          <p>Newport, Rhode Island 02840</p>
          <p>
            <a href={`tel:${PHONE.replace(/-/g, '')}`}>{PHONE}</a>
          </p>
        </address>
        <p>
          Para itens fabricados por terceiros e revendidos por Nós, por favor não envie tais itens de volta ao
          fabricante.
        </p>
        <p>
          Você é responsável pelo pagamento de todos os custos de envio do item devolvido. Os custos de envio não são
          reembolsáveis. Se você receber um reembolso, o custo de qualquer envio de devolução será deduzido do seu
          reembolso. Recomendamos considerar o uso de serviço de envio rastreável ou contratar seguro de envio para
          itens de valor.
        </p>
        <p>Dependendo de onde você mora, o tempo para que o produto trocado chegue até você pode variar.</p>
      </section>

      <section>
        <h2>Reembolsos e Trocas</h2>
        <p>
          Após recebermos sua devolução válida, enviaremos um e-mail para informar que recebemos seu item devolvido e
          notificá-lo sobre a aceitação ou rejeição da devolução.
        </p>
        <p>
          Se sua devolução for aceita por Nós, forneceremos, em prazo razoável, uma das seguintes opções: troca de
          mercadoria pelo item devolvido, crédito de mercadoria intransferível, crédito no cartão de pagamento ou
          método de pagamento original usado para pagar o item, cheque, ou outra solução que determinemos de boa-fé como
          apropriada nas circunstâncias.
        </p>
        <p>
          Só substituímos itens se estiverem defeituosos ou danificados na chegada. Se precisar fazer uma troca por
          tais itens, envie um e-mail para <a href={`mailto:${EMAIL}`}>{EMAIL}</a> e responderemos com instruções sobre
          como proceder.
        </p>
      </section>

      <section>
        <h2>Reembolsos Atrasados ou Ausentes (se aplicável)</h2>
        <p>Se você ainda não recebeu seu reembolso, verifique novamente sua conta bancária.</p>
        <p>
          Em seguida, contate a operadora do seu cartão de crédito; pode levar algum tempo até que o reembolso seja
          oficialmente lançado.
        </p>
        <p>Depois contate seu banco. Frequentemente há um tempo de processamento antes que um reembolso seja lançado.</p>
        <p>
          Se você fez tudo isso e ainda não recebeu seu reembolso, entre em contato conosco em{' '}
          <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
        </p>
      </section>

      <section>
        <h2>Disposições Gerais</h2>
        <p>
          Se você não cumprir qualquer das condições acima, reservamo-nos o direito de recusar a devolução ou troca, ou
          impor condições diferentes ou adicionais.
        </p>
      </section>
    </article>
  );
}
