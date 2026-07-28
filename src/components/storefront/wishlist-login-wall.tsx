'use client';

import { useState } from 'react';

interface WishlistLoginWallProps {
  locale: string;
  onSignIn: () => void;
  onRegister: () => void;
}

export function WishlistLoginWall({ locale, onSignIn, onRegister }: WishlistLoginWallProps) {
  const [email, setEmail] = useState('');
  const isPt = locale === 'pt';

  const copy = {
    registered: isPt ? 'Já tem conta?' : 'Already registered?',
    email: isPt ? 'Endereço de email' : 'Email address',
    signIn: isPt ? 'Entrar' : 'Sign in',
    registerTitle: isPt ? 'Registar-se' : 'Register',
    register: isPt ? 'Criar conta' : 'Create account',
    guestHint: isPt
      ? 'Pode ver os seus favoritos abaixo sem iniciar sessão.'
      : 'You can view your saved items below without signing in.',
  };

  return (
    <section className="mx-auto max-w-[420px] px-5 py-10 md:px-0">
      <p className="mb-6 text-center font-sans-ui text-[11px] leading-relaxed text-[#03060799]">{copy.guestHint}</p>

      <h2 className="mb-4 text-center font-sans-ui text-[13px] font-normal uppercase tracking-[0.06em] text-ink">
        {copy.registered}
      </h2>

      <label className="mb-4 block">
        <span className="sr-only">{copy.email}</span>
        <input
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={copy.email}
          className="w-full border-0 border-b border-[#03060733] bg-transparent py-3 font-sans-ui text-[13px] text-ink placeholder:text-[#03060766] outline-none focus:border-ink"
        />
      </label>

      <button
        type="button"
        onClick={onSignIn}
        className="mb-8 w-full bg-ink py-3.5 font-sans-ui text-[12px] uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#1a1a1a]"
      >
        {copy.signIn}
      </button>

      <div className="mb-8 border-t border-[#03060714]" aria-hidden />

      <h2 className="mb-4 text-center font-sans-ui text-[13px] font-normal uppercase tracking-[0.06em] text-ink">
        {copy.registerTitle}
      </h2>

      <button
        type="button"
        onClick={onRegister}
        className="w-full bg-[#eceae5] py-3.5 font-sans-ui text-[12px] uppercase tracking-[0.1em] text-ink transition-colors hover:bg-[#e0ddd6]"
      >
        {copy.register}
      </button>
    </section>
  );
}
