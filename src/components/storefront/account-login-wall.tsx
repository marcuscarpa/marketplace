'use client';

import { useState } from 'react';

interface AccountLoginWallProps {
  locale: string;
  onSignIn: (email: string) => void;
  onRegister: (email: string) => void;
  guestHint?: string;
  error?: string | null;
}

export function AccountLoginWall({
  locale,
  onSignIn,
  onRegister,
  guestHint,
  error,
}: AccountLoginWallProps) {
  const [email, setEmail] = useState('');
  const isPt = locale === 'pt';

  const copy = {
    registered: isPt ? 'Já está cadastrado?' : 'Already registered?',
    email: isPt ? 'Endereço de email' : 'Email address',
    signIn: isPt ? 'Conecte-se' : 'Sign in',
    registerTitle: isPt ? 'Inscrever-se' : 'Register',
    register: isPt ? 'Cadastre-se' : 'Create account',
  };

  return (
    <section className="mx-auto w-full max-w-[420px] px-5 py-10 md:px-0 md:py-16">
      {guestHint ? (
        <p className="mb-8 text-center font-sans-ui text-[11px] leading-relaxed text-[#03060799]">
          {guestHint}
        </p>
      ) : null}

      {error ? (
        <div className="mb-6 border border-[#9c4a4a33] bg-[#fdf5f5] px-4 py-3 font-sans-ui text-[12px] text-[#9c4a4a]">
          {error}
        </div>
      ) : null}

      <h2 className="mb-5 text-center font-sans-ui text-[15px] font-medium text-ink">
        {copy.registered}
      </h2>

      <form
        className="mb-10"
        onSubmit={(e) => {
          e.preventDefault();
          onSignIn(email);
        }}
      >
        <label className="mb-4 block">
          <span className="sr-only">{copy.email}</span>
          <input
            type="email"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={copy.email}
            className="w-full border border-[#03060726] bg-white px-4 py-3.5 font-sans-ui text-[13px] text-ink placeholder:text-[#03060766] outline-none transition-colors focus:border-ink"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-ink py-3.5 font-sans-ui text-[13px] text-white transition-colors hover:bg-[#1a1a1a]"
        >
          {copy.signIn}
        </button>
      </form>

      <div className="mb-10 border-t border-[#03060714]" aria-hidden />

      <h2 className="mb-5 text-center font-sans-ui text-[15px] font-medium text-ink">
        {copy.registerTitle}
      </h2>

      <button
        type="button"
        onClick={() => onRegister(email)}
        className="w-full bg-[#eceae5] py-3.5 font-sans-ui text-[13px] text-ink transition-colors hover:bg-[#e0ddd6]"
      >
        {copy.register}
      </button>
    </section>
  );
}
