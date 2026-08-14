import { LEGAL_PROSE } from '@/lib/help/legal-prose';

const COMPANY = 'Sinesia Karol, LLC.';
const EMAIL = 'business@sinesiakarol.com';

export function TermsContentPt({ locale }: { locale: string }) {
  void locale;

  return (
    <article className={LEGAL_PROSE}>
      <p className="text-neutral-500">Última atualização: 27 de maio de 2026</p>

      <section>
        <h2>TERMOS DE USO {COMPANY}</h2>
        <p>
          A {COMPANY} presta serviços a você sujeitos aos termos e condições incluídos nestes Termos de Uso e em
          outras páginas de atendimento ao cliente que preparamos para tornar sua experiência de compra com a{' '}
          {COMPANY} o mais agradável e livre de problemas possível. Leia-os com atenção. Ao visitar ou utilizar este
          site, você reconhece que leu e compreendeu, e concorda em estar vinculado aos Termos de Uso. Você também
          concorda em cumprir todas as leis e regulamentos aplicáveis, incluindo as leis de direitos autorais e marcas
          registradas dos Estados Unidos. Se você não concordar com estes termos, não utilize o site da {COMPANY}.
        </p>
      </section>

      <section>
        <h2>PRIVACIDADE</h2>
        <p>
          As informações que você nos fornece permanecem na {COMPANY}. Mantemos rigorosa segurança sobre as
          informações que você nos fornece e as utilizamos apenas das seguintes formas:
        </p>
        <ol>
          <li>Para enviar informações que você solicitar e atualizá-lo sobre o status desse pedido.</li>
          <li>Para monitorar o tráfego em nosso site e nos ajudar a projetar o site mais eficiente possível.</li>
          <li>
            Para enviar ocasionalmente materiais promocionais gratuitos. Exceto informações de cartão de crédito, que
            não processamos, mantemos suas informações internamente na {COMPANY}. Se desejar remover suas informações
            de nosso banco de dados, envie um e-mail para{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>
          </li>
          <li>
            Clientes internacionais — só enviaremos e-mails após você ter optado por recebê-los no checkout ou se
            inscrito em nossa newsletter no site. O servidor web registra seu endereço IP em logs padrão para ajudar a
            diagnosticar problemas com nosso servidor e administrar nosso site. Ao usar nosso site e fornecer suas
            informações, você concorda que podemos coletar e usar essas informações. Quaisquer alterações em nossa
            política de privacidade serão publicadas em nosso site.
          </li>
        </ol>
      </section>

      <section>
        <h2>PROPRIEDADE E DIREITOS AUTORAIS</h2>
        <p>
          O site da {COMPANY} é de propriedade e operado pela {COMPANY}. Salvo indicação em contrário, todo o design e
          conteúdo incluídos neste site, incluindo textos, gráficos, logotipos, ícones, imagens, obras de arte, clipes
          de áudio e vídeo e software, são propriedade da {COMPANY} (ou são usados sob licença da {COMPANY}) e estão
          protegidos pelas leis de direitos autorais dos Estados Unidos e internacionais.
        </p>
      </section>

      <section>
        <h2>ELEGIBILIDADE PARA USAR E/OU REGISTRAR-SE NO SITE</h2>
        <p>
          O Site, o Serviço e a Comunidade não se destinam a usuários menores de 13 anos, e apenas pessoas com 18 anos
          ou mais podem se registrar no Site. A {COMPANY} não coleta intencionalmente informações pessoalmente
          identificáveis de usuários menores de 13 anos. Tais usuários estão expressamente proibidos de usar o Serviço,
          de enviar suas informações pessoalmente identificáveis a nós e de se registrar como membros.
        </p>
        <p>
          Os usuários concordam em não se passar por outras pessoas, em não fornecer informações falsas e em não
          confiar na identidade ou identificação de outros usuários exibida no Site, pois a {COMPANY} não emprega
          nenhum meio para verificar a verdadeira identidade de usuários registrados.
        </p>
      </section>

      <section>
        <h2>COMUNICAÇÕES ELETRÔNICAS</h2>
        <p>
          Você concorda que todos os acordos, avisos, divulgações e outras comunicações que lhe fornecemos
          eletronicamente atendem a qualquer exigência legal de que tais comunicações sejam feitas por escrito.
        </p>
      </section>
    </article>
  );
}
