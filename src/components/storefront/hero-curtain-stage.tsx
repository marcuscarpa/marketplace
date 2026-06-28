import type { ReactNode } from 'react';

/**
 * Cortina vertical no hero (“sticky reveal”): contentor `200svh`; hero em `sticky top-0`
 * enquanto o scroll percorre o 2.º meio-viewport. Conteúdo abaixo com `-mt-[100svh]` sobe por cima (`z-[2]`).
 * Paridade com Alist `AlistHomeHeroCurtainStage` — só hero, sem cortina de rodapé.
 */
export type HeroCurtainStageProps = Readonly<{
  hero: ReactNode;
  children: ReactNode;
}>;

export function HeroCurtainStage({ hero, children }: HeroCurtainStageProps) {
  return (
    <div className="relative isolate z-0">
      <div className="relative h-[200svh] overflow-visible">
        <div className="sticky top-0 z-[1] w-full min-h-0 antialiased">{hero}</div>
      </div>
      <div className="relative z-[2] isolate -mt-[100svh] bg-[var(--color-background)]">{children}</div>
    </div>
  );
}
