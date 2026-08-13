import { LEGAL_PROSE } from '@/lib/help/legal-prose';
import { CONTACT_EMAIL, CONTACT_PHONES } from '@/lib/help/contact-info';

export function ReturnsContentPt({ locale }: { locale: string }) {
  const termsHref = `/${locale}/terms`;

  return (
    <article className={LEGAL_PROSE}>
      <p>
        Todos os termos definidos abaixo terão os significados estabelecidos em nossos{' '}
        <a href={termsHref}>Termos e Condições</a>.
      </p>

      <section>
        <h2>Cancelamento de Pedidos</h2>
        <p>
          Pedidos feitos online são processados imediatamente e não podem ser cancelados. Você deve aguardar receber a
          mercadoria antes de poder devolvê-la.
        </p>
      </section>

      <section>
        <h2>Devoluções</h2>
        <p>
          Uma vez que a mercadoria é entregue a você, você pode devolvê-la em até 7 dias após a entrega para reembolso
          integral. Todas as devoluções feitas após 7 dias resultarão na emissão de crédito na loja. Para ser elegível à
          devolução, a mercadoria deve estar sem uso, nas mesmas condições em que foi recebida e na embalagem original.
          Nossa política de devolução não se aplica aos seguintes produtos: itens com desconto ou em liquidação final,
          cartões-presente e produtos usados ou danificados. Esses itens não são elegíveis para devolução, reembolso ou
          troca.
        </p>
      </section>

      <section>
        <h2>Envio</h2>
        <p>
          Para iniciar uma devolução, envie um e-mail para <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          Exigimos recibo ou comprovante de compra junto com a devolução.
        </p>
        <p>Toda a mercadoria devolvida deve ser enviada para:</p>
        <address className="space-y-1">
          <p>Sinesia Karol</p>
          <p>Attn: DEVOLUÇÕES (Nº do Pedido ___)</p>
          <p>135 Spring Street</p>
          <p>Newport, Rhode Island 02840</p>
          <p>
            <a href={CONTACT_PHONES.us.href}>{CONTACT_PHONES.us.display}</a>
          </p>
        </address>
        <p>
          Para itens fabricados por terceiros e revendidos por nós, não envie o item de volta ao fabricante.
        </p>
        <p>
          Você é responsável por pagar todos os custos de envio do item devolvido. Os custos de envio não são
          reembolsáveis. Se você receber um reembolso, o custo do envio da devolução será deduzido do valor do
          reembolso. Recomendamos usar um serviço de envio com rastreamento ou contratar seguro de envio para itens
          valiosos.
        </p>
        <p>Dependendo de onde você mora, o tempo para um produto trocado chegar até você pode variar.</p>
      </section>

      <section>
        <h2>Reembolsos e Trocas</h2>
        <p>
          Após o recebimento da sua devolução válida, enviaremos um e-mail notificando que recebemos o item devolvido e
          informando sobre a aceitação ou rejeição da devolução. Se a devolução for aceita, providenciaremos uma das
          seguintes opções em um prazo razoável: troca pelo item devolvido, crédito na loja intransferível, crédito no
          cartão ou no método de pagamento original usado na compra, cheque ou outra solução que determinarmos, de boa-fé,
          como apropriada para as circunstâncias.
        </p>
        <p>
          Só substituímos itens se estiverem defeituosos ou danificados no recebimento. Se precisar trocar itens nessa
          condição, envie um e-mail para <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> e responderemos com
          instruções sobre como proceder.
        </p>
      </section>

      <section>
        <h2>Reembolsos Atrasados ou Ausentes (se aplicável)</h2>
        <p>Se você ainda não recebeu seu reembolso, verifique novamente sua conta bancária.</p>
        <p>
          Em seguida, contate a operadora do seu cartão de crédito; pode levar algum tempo até que o reembolso seja
          oficialmente lançado.
        </p>
        <p>
          Depois, contate seu banco. Frequentemente há um tempo de processamento antes que um reembolso seja de fato
          lançado em sua conta.
        </p>
        <p>
          Se você concluiu todas essas etapas e ainda não recebeu seu reembolso, entre em contato conosco em{' '}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
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
