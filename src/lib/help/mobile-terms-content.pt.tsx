import { LEGAL_PROSE_SIMPLE } from '@/lib/help/legal-prose';
import { CONTACT_PHONES } from '@/lib/help/contact-info';

const BRAND = 'SINESIA KAROL';
const SUPPORT_EMAIL = 'admin@sinesiakarol.com';
const SENDING_NUMBER = CONTACT_PHONES.us.display;

export function MobileTermsContentPt({ locale }: { locale: string }) {
  const privacyHref = `/${locale}/privacy`;

  return (
    <article className={LEGAL_PROSE_SIMPLE}>
      <p className="text-neutral-500">Última atualização: 27 de maio de 2026</p>

      <p>
        O serviço de mensagens móveis {BRAND} (o &quot;Serviço&quot;) é operado pela {BRAND} (&quot;{BRAND}&quot;,
        &quot;nós&quot; ou &quot;nos&quot;). O uso do Serviço constitui sua concordância com estes termos e condições
        (&quot;Termos Móveis&quot;). Podemos modificar ou cancelar o Serviço ou qualquer de seus recursos sem aviso
        prévio. Na medida permitida pela lei aplicável, também podemos modificar estes Termos Móveis a qualquer momento,
        e o uso continuado do Serviço após a data de vigência de quaisquer alterações constituirá sua aceitação de
        tais alterações.
      </p>

      <p>
        Ao consentir com o serviço de SMS/mensagens de texto da {BRAND}, você concorda em receber mensagens SMS/texto
        recorrentes da e em nome da {BRAND} por meio de sua operadora de telefonia móvel para o número de celular
        fornecido, mesmo que seu número esteja registrado em qualquer lista estadual ou federal de Não Ligar. As
        mensagens de texto podem ser enviadas usando sistema automático de discagem telefônica ou outra tecnologia.
        Mensagens relacionadas ao serviço podem incluir atualizações, alertas e informações (por exemplo, atualizações
        de pedidos, alertas de conta etc.). Mensagens promocionais podem incluir promoções, ofertas especiais e outras
        ofertas de marketing (por exemplo, lembretes de carrinho).
      </p>

      <p>
        Você entende que não precisa se inscrever neste programa para fazer compras, e seu consentimento não é condição
        para qualquer compra com a {BRAND}. Sua participação neste programa é totalmente voluntária.
      </p>

      <p>
        Não cobramos pelo Serviço, mas você é responsável por todas as tarifas e taxas associadas a mensagens de texto
        impostas por sua operadora de telefonia móvel. A frequência de mensagens varia. Podem ser aplicadas tarifas de
        mensagens e dados. Verifique seu plano móvel e contate sua operadora para detalhes. Você é o único responsável
        por todas as cobranças relacionadas a mensagens SMS/texto, incluindo cobranças de sua operadora.
      </p>

      <p>
        Você pode cancelar a inscrição no Serviço a qualquer momento. Envie a palavra-chave STOP para {SENDING_NUMBER}{' '}
        ou clique no link de cancelamento de inscrição (quando disponível) em qualquer mensagem de texto para
        cancelar. Você receberá uma mensagem de confirmação de cancelamento única. Nenhuma outra mensagem será enviada
        ao seu dispositivo móvel, salvo se iniciada por você. Se você se inscreveu em outros programas de mensagens
        móveis da {BRAND} e deseja cancelar, exceto quando a lei aplicável exigir o contrário, precisará cancelar
        separadamente nesses programas seguindo as instruções fornecidas em seus respectivos termos móveis.
      </p>

      <p>
        Para suporte ou assistência do Serviço, envie HELP para {SENDING_NUMBER} ou e-mail{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.
      </p>

      <p>
        Podemos alterar qualquer short code ou número de telefone que usamos para operar o Serviço a qualquer momento e
        notificaremos você sobre essas alterações. Você reconhece que quaisquer mensagens, incluindo solicitações STOP
        ou HELP, enviadas a um short code ou número de telefone que alteramos podem não ser recebidas e não seremos
        responsáveis por honrar solicitações feitas nessas mensagens.
      </p>

      <p>
        As operadoras de telefonia móvel suportadas pelo Serviço não são responsáveis por mensagens atrasadas ou não
        entregues. Você concorda em nos fornecer um número de celular válido. Se obtiver um novo número, precisará se
        inscrever no programa com seu novo número.
      </p>

      <p>
        Na medida permitida pela lei aplicável, você concorda que não seremos responsáveis por entrega falha, atrasada
        ou direcionada incorretamente de qualquer informação enviada pelo Serviço, quaisquer erros nessas informações
        e/ou qualquer ação que você tome ou deixe de tomar com base nas informações ou no Serviço.
      </p>

      <p>
        Respeitamos seu direito à privacidade. Para ver como coletamos e usamos suas informações pessoais, consulte
        nosso <a href={privacyHref}>Aviso de Privacidade</a>.
      </p>
    </article>
  );
}
