import { LEGAL_PROSE } from '@/lib/help/legal-prose';

export function CookieContentPt({ locale }: { locale: string }) {
  const privacyHref = `/${locale}/privacy`;
  const contactHref = `/${locale}/contact`;

  return (
    <article className={LEGAL_PROSE}>
      <p className="text-neutral-500">Última atualização: 27 de maio de 2026</p>

      <section>
        <h2>Nosso Uso de Cookies, Web Beacons e Tecnologias Semelhantes</h2>
        <p>
          Quando você visita ou interage com nossos sites, serviços, aplicativos, ferramentas ou mensagens, nós ou
          nossos prestadores de serviços autorizados podemos usar cookies, web beacons e outras tecnologias semelhantes
          para tornar sua experiência melhor, mais rápida e mais segura, para fins publicitários e para nos permitir
          melhorar continuamente nossos sites, serviços, aplicativos e ferramentas.
        </p>
        <p>
          Esperamos que as informações abaixo forneçam informações claras e abrangentes sobre as tecnologias que usamos
          e os fins para os quais as usamos, mas se tiver dúvidas adicionais ou precisar de mais informações, consulte
          nossa <a href={privacyHref}>Política de Privacidade</a>, Central de Privacidade ou{' '}
          <a href={contactHref}>entre em contato conosco</a>.
        </p>
      </section>

      <section>
        <h2>Seu Consentimento</h2>
        <p>
          Ao continuar a usar e navegar em nossos sites, serviços, aplicativos, ferramentas ou mensagens, você concorda
          com nosso uso de cookies, web beacons e tecnologias semelhantes conforme descrito aqui e em nossa{' '}
          <a href={privacyHref}>Política de Privacidade</a>. Se não desejar aceitar essas tecnologias em conexão com
          sua visita ou uso de nossos sites, serviços, aplicativos, ferramentas ou mensagens, você pode visitar nossa
          página Gerenciar Configurações e ver opções adicionais abaixo disponíveis para gerenciar, controlar ou excluir
          nosso uso ou o de nossos prestadores de serviços dessas tecnologias.
        </p>
      </section>

      <section>
        <h2>O Que São Cookies, Web Beacons e Tecnologias Semelhantes</h2>
        <p>
          Essas tecnologias são essencialmente pequenos arquivos de dados colocados em seu computador, tablet, celular
          ou outro dispositivo (&quot;coletivamente, um &quot;dispositivo&quot;) que nos permitem registrar informações
          quando você visita ou interage com nossos sites, serviços, aplicativos, mensagens e outras ferramentas. Embora
          frequentemente sejam genericamente referidas como &quot;Cookies&quot;, cada uma funciona de forma ligeiramente
          diferente e é melhor explicada abaixo:
        </p>
        <p>
          <strong>Cookies:</strong> São pequenos arquivos de texto (geralmente compostos por letras e números) colocados
          na memória do seu navegador ou dispositivo quando você visita um site ou visualiza uma mensagem. Os cookies
          permitem que um site reconheça um dispositivo ou navegador específico.
        </p>
        <p>Existem vários tipos de cookies:</p>
        <ul>
          <li>
            <strong>Cookies de sessão</strong> expiram ao final da sessão do navegador e nos permitem vincular suas
            ações durante essa sessão específica do navegador.
          </li>
          <li>
            <strong>Cookies persistentes</strong> são armazenados em seu dispositivo entre sessões do navegador,
            permitindo-nos lembrar suas preferências ou ações em vários sites.
          </li>
          <li>
            <strong>Cookies de primeira parte</strong> são definidos por um site que está sendo visitado pelo usuário no
            momento, a fim de preservar suas configurações (por exemplo, enquanto estiver em nosso site).
          </li>
          <li>
            <strong>Cookies de terceiros</strong> são colocados em seu navegador por um site ou domínio que não é o site
            ou domínio que você está visitando no momento. Se um usuário visita um site e outra entidade define um cookie
            por meio desse site, trata-se de um cookie de terceiros.
          </li>
        </ul>
        <p>
          Quando você entra em um site que usa cookies, pode ser solicitado a preencher um formulário fornecendo
          informações pessoais, como nome, endereço de e-mail e interesses. Essas informações são empacotadas em um
          cookie e enviadas ao seu navegador (Chrome, Firefox etc.), que então armazena as informações para uso
          posterior. Na próxima vez que você acessar o mesmo site, seu navegador enviará o cookie ao servidor.
        </p>
        <p>A mensagem é enviada de volta ao servidor sempre que o navegador solicita uma página do servidor.</p>
        <p>
          <strong>Web beacons:</strong> pequenos arquivos (também chamados de &quot;pixels&quot;, &quot;tags de
          imagem&quot; ou &quot;tags de script&quot;) que podem ser carregados em nossos sites, aplicativos e
          ferramentas, e que podem trabalhar em conjunto com cookies para identificar nossos usuários e fornecer dados
          anonimizados sobre seu comportamento.
        </p>
        <p>
          <strong>Tecnologias semelhantes:</strong> Tecnologias que armazenam informações em seu navegador ou
          dispositivo utilizando objetos compartilhados locais ou armazenamento local, como flash cookies, cookies HTML
          5 e outros métodos de software de aplicativos web.
        </p>
        <p>
          Essas tecnologias podem operar em todos os seus navegadores e, em alguns casos, podem não ser totalmente
          gerenciadas pelo navegador e podem exigir gerenciamento diretamente por meio de seus aplicativos ou
          dispositivos instalados. Não usamos essas tecnologias para armazenar informações com o objetivo de direcionar
          publicidade a você dentro ou fora de nossos sites.
        </p>
      </section>

      <section id="cookie-types">
        <h2>Quais Tipos de Cookies, Web Beacons e Tecnologias Semelhantes Usamos e Por Quê</h2>
        <p>
          Nossos cookies, web beacons e tecnologias semelhantes servem a vários propósitos, mas geralmente são
          necessários ou essenciais para o funcionamento de nossos sites, serviços, aplicativos, ferramentas ou
          mensagens, nos ajudam a melhorar o desempenho ou fornecer funcionalidade extra, ou nos ajudam a veicular
          anúncios relevantes e direcionados. Mais especificamente:
        </p>
        <h3>Estritamente Necessários ou Essenciais</h3>
        <p>
          Cookies, web beacons e tecnologias semelhantes &apos;estritamente necessários&apos; ou &quot;essenciais&quot;
          permitem que você navegue pelo site e use recursos essenciais como áreas seguras e carrinhos de compras. Sem
          essas tecnologias, os serviços que você solicitou não podem ser fornecidos.
        </p>
        <p>
          Observe que essas tecnologias não coletam informações sobre você que possam ser usadas para marketing ou para
          lembrar onde você esteve na internet. Aceitar essas tecnologias é condição para usar nossos sites, serviços,
          aplicativos, ferramentas ou mensagens; se você impedir que sejam carregadas, não podemos garantir seu uso ou
          como a segurança neles funcionará durante sua visita.
        </p>
        <h3>Desempenho</h3>
        <p>
          Cookies, web beacons e tecnologias semelhantes de &apos;Desempenho&apos; coletam informações sobre como você
          usa nosso site, por exemplo, quais páginas visita e se encontra erros. Esses cookies não coletam informações
          que possam identificá-lo e são usados apenas para nos ajudar a melhorar o funcionamento do site, entender os
          interesses de nossos usuários e medir a eficácia de nosso conteúdo, fornecendo estatísticas e dados anônimos
          sobre o uso do site. Aceitar essas tecnologias é condição para usar nossos sites, serviços, aplicativos,
          ferramentas ou mensagens; se você impedir que sejam carregadas, não podemos garantir seu uso ou como a
          segurança neles funcionará durante sua visita.
        </p>
        <h3>Funcionalidade</h3>
        <p>
          Esses cookies, web beacons ou tecnologias semelhantes são usados para fornecer serviços ou lembrar configurações
          para melhorar sua visita.
        </p>
        <h3 id="advertising">Publicidade</h3>
        <p>
          Cookies e web beacons de primeira ou terceira parte podem ser colocados por nossos sites, aplicativos ou
          ferramentas, a fim de veicular conteúdo, incluindo anúncios relacionados a produtos, relevantes aos seus
          interesses específicos em nossos sites ou sites de terceiros. Essas tecnologias nos permitem entender a
          utilidade de nossos anúncios e melhorar a relevância do conteúdo entregue aos nossos usuários.
        </p>
        <p>
          Também utilizamos prestadores de serviços terceirizados para nos auxiliar nas mesmas funções, o que significa
          que nossos prestadores de serviços autorizados também podem colocar cookies, web beacons e tecnologias
          semelhantes em seu dispositivo por meio de nossos serviços (cookies de primeira e terceira parte). Eles
          também podem coletar informações que os ajudam a identificar seu dispositivo, como endereço IP ou outros
          identificadores únicos ou de dispositivo.
        </p>
      </section>

      <section>
        <h2>Como Gerenciar, Controlar e Excluir Cookies, Web Beacons e Tecnologias Semelhantes</h2>
        <p>
          Você pode gerenciar determinados cookies, web beacons e tecnologias semelhantes que colocamos visitando nosso
          painel de controle Gerenciar Configurações. Você também pode visitar o link &quot;Preferências de
          Publicidade&quot; no rodapé de nossas páginas web.
        </p>
        <p>
          Você pode bloquear cookies ativando a configuração do navegador que permite recusar a configuração de todos
          ou alguns cookies. No entanto, se usar as configurações do navegador para bloquear todos os cookies
          (incluindo cookies essenciais), isso pode limitar o uso de certos recursos ou funções em nosso site ou
          serviço. Salvo se você tiver ajustado as configurações do navegador para recusar cookies, nosso sistema emitirá
          cookies assim que você visitar nosso site. Observe que, conforme descrito em nossa Política de Privacidade,
          atualmente não alteramos nossas práticas quando recebemos um sinal &quot;Do Not Track&quot; do navegador de
          um visitante.
        </p>
        <p>
          Os navegadores de internet permitem alterar suas configurações de cookies. Essas configurações geralmente
          estão no menu &apos;opções&apos; ou &apos;preferências&apos; do navegador. Para entender essas configurações,
          os links a seguir podem ser úteis. Caso contrário, use a opção &apos;Ajuda&apos; do navegador para mais
          detalhes.
        </p>
        <ul>
          <li>
            <a
              href="https://support.microsoft.com/en-us/windows/manage-cookies-in-microsoft-edge-view-allow-block-delete-and-use-168dab11-0753-043d-7c16-ede5947fc64d"
              target="_blank"
              rel="noopener noreferrer"
            >
              Configurações de cookies no Internet Explorer
            </a>
          </li>
          <li>
            <a
              href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
              target="_blank"
              rel="noopener noreferrer"
            >
              Configurações de cookies no Firefox
            </a>
          </li>
          <li>
            <a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer">
              Configurações de cookies no Chrome
            </a>
          </li>
          <li>
            <a href="https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" target="_blank" rel="noopener noreferrer">
              Configurações de cookies no Safari
            </a>
          </li>
        </ul>
        <p>
          Se desejar retirar seu consentimento a qualquer momento, precisará excluir seus cookies usando as
          configurações do navegador de internet.
        </p>
      </section>

      <section>
        <h2>Mais Informações Sobre Cookies</h2>
        <p>
          Informações úteis sobre cookies, incluindo informações sobre exclusão ou bloqueio de cookies, podem ser
          encontradas em:{' '}
          <a href="http://www.allaboutcookies.org" target="_blank" rel="noopener noreferrer">
            http://www.allaboutcookies.org
          </a>
        </p>
        <p>
          Um guia sobre publicidade comportamental e privacidade online foi produzido pela indústria de publicidade na
          internet e pode ser encontrado em:{' '}
          <a href="http://www.youronlinechoices.eu" target="_blank" rel="noopener noreferrer">
            http://www.youronlinechoices.eu
          </a>
        </p>
        <p>
          Informações sobre o guia de cookies do ICC (Reino Unido) podem ser encontradas na seção do site da ICC:{' '}
          <a
            href="http://www.international-chamber.co.uk/our-expertise/digitaleconomy"
            target="_blank"
            rel="noopener noreferrer"
          >
            http://www.international-chamber.co.uk/our-expertise/digitaleconomy
          </a>
        </p>
      </section>

      <section>
        <h2>Contato</h2>
        <p>
          Se precisar de mais informações ou tiver comentários ou dúvidas sobre este site ou qualquer aspecto de nossos
          serviços, entre em contato com nossa Equipe de Comunicação de Marketing.
        </p>
      </section>
    </article>
  );
}
