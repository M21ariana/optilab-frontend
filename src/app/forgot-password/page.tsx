import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background text-primary">
      {/* Background image */}
      <div className="absolute inset-0 opacity-100">
        <Image
          src="/images/login_background.png"
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Soft overlay */}
      <div className="absolute inset-0 bg-background/20" />

      {/* Content */}
      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-10">
        <section className="w-full max-w-md">
          {/* Logo */}
          <Link href="/" className="mb-10 block">
            <Image
              src="/logo/optilab_logo.png"
              alt="OptiLab Logo"
              width={220}
              height={70}
              priority
              className="mx-auto h-auto w-[220px] object-contain"
            />
          </Link>

          {/* Recovery card */}
          <div className="rounded-[2rem] border border-border bg-surface/95 p-8 shadow-2xl shadow-primary/10 backdrop-blur-md">
            <Link
              href="/login"
              className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-secondary transition hover:text-accent"
            >
              <ArrowLeft size={18} />
              Volver al inicio de sesión
            </Link>

            <h1 className="text-3xl font-black tracking-tight text-primary">
              Recuperar contraseña
            </h1>

            <p className="mt-3 text-sm leading-6 text-secondary">
              Ingresa el correo electrónico asociado a tu cuenta. Te enviaremos
              las instrucciones para restablecer tu contraseña.
            </p>

            <form className="mt-8 space-y-6">
              <label className="block">
                <span className="mb-2 block text-sm font-bold">
                  Correo electrónico
                </span>

                <div className="flex items-center gap-3 rounded-2xl border border-border bg-white px-4 py-3 shadow-sm transition focus-within:border-accent">
                  <Mail size={18} className="text-accent" />

                  <input
                    type="email"
                    placeholder="usuario@laboratorio.com"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-secondary/50"
                  />
                </div>
              </label>

              <button
                type="submit"
                className="flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-4 text-sm font-extrabold text-white transition hover:bg-secondary"
              >
                Enviar instrucciones
              </button>
            </form>

            <div className="mt-6 rounded-2xl border border-border bg-muted/40 px-4 py-3">
              <p className="text-sm leading-6 text-secondary">
                Si el correo está registrado en OptiLab, recibirás un mensaje
                con los pasos para recuperar el acceso.
              </p>
            </div>
          </div>

          <p className="mt-6 text-center text-sm text-secondary">
            © 2026 OptiLab
          </p>
        </section>
      </div>
    </main>
  );
}