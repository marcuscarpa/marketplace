'use client';

import Image from 'next/image';
import { type FormEvent, useState } from 'react';

const BACKGROUND_IMAGE = '/banner 1.2 (1) (1).png';
const LOGO_SRC = '/logotipo.webp';

function ArrowRightIcon({ className = 'h-4 w-4' }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

export function ComingSoon() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <main
      className="relative flex min-h-screen flex-col overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url('${BACKGROUND_IMAGE}')` }}
    >
      {/* Overlay escuro leve para manter o texto branco legível sobre a imagem */}
      <div className="absolute inset-0 bg-black/30" aria-hidden="true" />

      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <Image
          src={LOGO_SRC}
          alt="Sinesia Karol"
          width={150}
          height={75}
          priority
          className="absolute left-1/2 top-[55px] h-[75px] w-[150px] -translate-x-1/2 object-contain"
        />

        <h1 className="mb-6 max-w-3xl text-4xl font-bold uppercase leading-tight tracking-tight text-white sm:text-5xl">
          WE&apos;RE BUILDING OUR WEBSITE
        </h1>

        <p className="mb-12 max-w-md text-base font-light leading-relaxed text-white sm:text-lg">
          Sign up now and be the first to know when it&apos;s ready!
        </p>

        <form
          onSubmit={onSubmit}
          className="mb-12 flex w-full max-w-md items-center gap-3"
          noValidate
        >
          <label htmlFor="coming-soon-email" className="sr-only">
            Email address
          </label>
          <input
            id="coming-soon-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value);
              setSubmitted(false);
            }}
            placeholder="Enter your email..."
            className="h-12 min-w-0 flex-1 rounded-full border border-white/80 bg-transparent px-6 text-base text-white outline-none transition-colors placeholder:italic placeholder:text-white/60 focus:border-white"
          />
          <button
            type="submit"
            aria-label="Submit email"
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/80 bg-transparent text-white transition-colors hover:bg-white hover:text-black"
          >
            <ArrowRightIcon />
          </button>
        </form>

        <p
          className="min-h-5 text-sm font-light text-white/80"
          role="status"
          aria-live="polite"
        >
          {submitted ? 'Thanks for signing up — we’ll be in touch!' : ''}
        </p>
      </div>
    </main>
  );
}
