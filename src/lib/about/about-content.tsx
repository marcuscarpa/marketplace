import { LEGAL_PROSE_SIMPLE } from '@/lib/help/legal-prose';

export function AboutHubContent({ locale }: { locale: string }) {
  const isPt = locale === 'pt';

  return (
    <div className="border-t border-neutral-200 font-sans-ui text-sm uppercase tracking-[0.12em] text-neutral-900">
      <p className="border-b border-neutral-200 py-5">{isPt ? 'Conheça a Designer' : 'Meet the Designer'}</p>
      <p className="border-b border-neutral-200 py-5">{isPt ? 'Nossa Marca' : 'Our Brand'}</p>
    </div>
  );
}

export function MeetTheDesignerContent({ locale }: { locale: string }) {
  const isPt = locale === 'pt';

  if (isPt) {
    return (
      <article className={LEGAL_PROSE_SIMPLE}>
        <p>
          Natural de Vitória, Brasil, cidade litorânea ao norte do Rio de Janeiro, Sinesia Karol desenvolveu cedo o
          interesse por moda e design, influenciada pela mãe, que confeccionava grande parte das roupas da família.
          Crescer em uma comunidade de praia permitiu que Sinesia se tornasse uma observadora atenta da moda e do estilo
          em um ambiente oceânico, com uma base sólida em arte, música e arquitetura brasileiras.
        </p>
        <p>
          Em 1995, Sinesia conheceu o amor de sua vida, seu marido Bill Karol. Casaram-se em seguida e juntos criaram
          quatro filhos. Hoje dividem seu tempo entre Boston e Portsmouth, Rhode Island, nos Estados Unidos, e Vitória,
          Brasil.
        </p>
        <p>
          Quando os filhos cresceram, Sinesia decidiu retornar às suas raízes culturais brasileiras. Observando o mercado
          de moda praia nos Estados Unidos, ficou fascinada pelas diferentes perspectivas que mulheres americanas e
          brasileiras tinham sobre a vida na praia, moda e confiança corporal. Ela acreditava que era possível unir esses
          dois mercados distintos.
        </p>
        <p>
          Sinesia Karol decidiu lançar sua coleção homônima com foco em um design elevado e execução impecável do
          produto. Inicialmente trabalhou com a artista brasileira Ana Paula Castro para criar estampas em lycra e
          chiffon de seda, direcionadas ao público mais exigente. Sinesia estreou sua linha resortwear para celebrar a
          forma feminina com impecável gosto em moda de luxo. Desde então, sua equipe cresceu para cinquenta
          funcionários.
        </p>
        <p>
          Em Boston, Sinesia contribui com sua comunidade. Sua energia e compromisso com trabalho filantrópico são tão
          inspiradores quanto seu trabalho na empresa que leva seu nome. Sua contribuição incansável para a{' '}
          <a href="https://www.bcrf.org/" target="_blank" rel="noopener noreferrer">
            Breast Cancer Research Foundation
          </a>{' '}
          (BCRF) é reconhecida nacionalmente. Ela presidiu grandes eventos para a BCRF, bem como para o{' '}
          <a
            href="https://www.nwh.org/development-office/development-office"
            target="_blank"
            rel="noopener noreferrer"
          >
            Newton Wellesley Hospital
          </a>{' '}
          e participa do{' '}
          <a href="https://www.nativityboston.org/" target="_blank" rel="noopener noreferrer">
            Nativity Prep School
          </a>{' '}
          como membro do conselho.
        </p>
        <p>
          No Rio de Janeiro, Brasil, Sinesia está envolvida com a escola de arte especializada{' '}
          <a href="https://spectaculu.org.br/en/" target="_blank" rel="noopener noreferrer">
            Spetaculu
          </a>{' '}
          há quatro anos. O programa ajuda estudantes talentosos que não encontraram caminho para a universidade; Sinesia
          patrocina cinco estudantes por ano. Em sua cidade natal, Vitória, ela está envolvida com creches em áreas muito
          pobres, apoiando diversos programas todos os anos.
        </p>
      </article>
    );
  }

  return (
    <article className={LEGAL_PROSE_SIMPLE}>
      <p>
        Hailing from the island beach town of Vitória, Brazil, just north of Rio de Janeiro, Sinesia Karol&apos;s
        interest in apparel and design was piqued at an early age, influenced by her mother who handmade much of the
        family&apos;s clothing. Growing up in a beach community allowed Sinesia to become a keen observer of fashion and
        style in an ocean setting while offering her a deep foundation in Brazilian art, music, and architecture.
      </p>
      <p>
        In 1995 Sinesia met the love of her life, her husband Bill Karol. They married shortly thereafter and together
        have raised four children. They currently reside in both Boston, Portsmouth, Rhode Island in the United States
        and Vitoria, Brazil.
      </p>
      <p>
        As her children grew, Sinesia decided it was time to return to her roots of Brazil culture. Observing swimwear
        in the United States, she was fascinated by the differing perspectives women in the United States and Brazil had
        to beach-life, fashion, and body confidence. She felt there was a way to join these two distinct markets.
      </p>
      <p>
        Sinesia Karol decided to launch her eponymous collection focusing on an elevated design sensibility and
        exquisite execution of the product. She originally worked with prominent Brazilian artist Ana Paula Castro to
        design printed textiles, which she produced on lycra and silk chiffon to appeal the most discerning audience.
        Sinesia debuted her resortwear line to celebrate the female form with impeccable taste in luxury fashion. Since
        those early days, Sinesia&apos;s team has grown to fifty employees.
      </p>
      <p>
        In Boston Sinesia gives back to her community. Her energy and commitment to her philanthropic work is as
        inspiring as her work for the company with her own name. Her tireless contribution to the{' '}
        <a href="https://www.bcrf.org/" target="_blank" rel="noopener noreferrer">
          Breast Cancer Research Foundation
        </a>{' '}
        (BCRF) is known nationally. She has chaired major events for BCRF as well as for{' '}
        <a href="https://www.nwh.org/development-office/development-office" target="_blank" rel="noopener noreferrer">
          Newton Wellesley Hospital
        </a>{' '}
        and is involved with{' '}
        <a href="https://www.nativityboston.org/" target="_blank" rel="noopener noreferrer">
          Nativity Prep School
        </a>{' '}
        as a trustee.
      </p>
      <p>
        In Rio De Janeiro, Brazil, Sinesia has been involved with the specialized art school{' '}
        <a href="https://spectaculu.org.br/en/" target="_blank" rel="noopener noreferrer">
          Spetaculu
        </a>{' '}
        for four years. The program helps students who are talented but have been unable to find their way to college,
        Sinesia sponsors five students each year. In her home town of Vitória, she is involved with day care centers in
        the very poor areas helping every year with a variety of programs.
      </p>
    </article>
  );
}

export function OurBrandContent({ locale }: { locale: string }) {
  const isPt = locale === 'pt';

  if (isPt) {
    return (
      <article className={LEGAL_PROSE_SIMPLE}>
        <p>
          Em 2012, Sinesia Karol viu uma oportunidade de trazer moda praia vibrante e chique dos Estados Unidos a partir
          de seu país natal, o Brasil. Desde então, a marca cresceu rapidamente, adicionando ready-to-wear elegante e
          acessórios sofisticados. A marca está presente em lojas premium nos Estados Unidos, Brasil e Grécia.
        </p>
        <p>
          As coleções são concebidas no atelier Sinesia Karol, localizado em Vila Velha, Espírito Santo, Brasil. Com
          base na visão de Sinesia para a temporada, os designs de estampa são criados por três artistas locais que ela
          seleciona para cada coleção. Têxteis, mão de obra e desenvolvimento são, portanto, 100% brasileiros — um ponto
          de propósito e orgulho para a equipe.
        </p>
        <p>
          A Sinesia Karol, LLC está comprometida com parcerias brasileiras, gerando empregos para aproximadamente
          cinquenta funcionários que alcançam nossos altos padrões de manufatura. As duas principais fábricas são
          administradas por mulheres, permitindo flexibilidade e poder de ganho para mães trabalhadoras. Sinesia mantém
          relacionamento com uma fábrica no Brasil — amplamente considerada a melhor do setor — há quase uma década.
        </p>
        <p>
          O meio ambiente também é importante para Sinesia; manter práticas de manufatura sustentáveis é uma consideração
          central. As empresas usadas para produção estão comprometidas com a proteção ambiental local e diretrizes
          internacionais, o que é de extrema importância.
        </p>
      </article>
    );
  }

  return (
    <article className={LEGAL_PROSE_SIMPLE}>
      <p>
        In 2012 Sinesia Karol saw an opportunity to bring vibrant and chic swimwear to the United States from her home
        country of Brazil. Since then brand has grown rapidly, adding elegant ready-to-wear and high-styled accessories.
        The brand is found in up-market shops in the United States, Brazil, and Greece.
      </p>
      <p>
        The collections are conceived at the Sinesia Karol atelier, located in Vila Velha Espirito Santo, Brazil. Based
        on Sinesia&apos;s vision for the season the print designs are created by three local artists which Sinesia hand
        selects for each collection. Textiles, labor, and development is therefore 100% Brazilian, a point of purpose and
        pride for the team.
      </p>
      <p>
        Sinesia Karol, LLC is committed to Brazilian partnerships, enabling jobs for approximately fifty employees who
        achieve our high standards of manufacturing. The two main factories are woman run, allowing flexibility and
        earning power to working mothers. Sinesia has had a relationship with one factory in Brazil — widely considered
        the best in the industry—for almost a decade.
      </p>
      <p>
        The environment is equally important to Sinesia, keeping her manufacturing practices sustainable is a main
        consideration. The companies used for production are committed to local environmental protection and
        international guidelines which is of the utmost importance.
      </p>
    </article>
  );
}
