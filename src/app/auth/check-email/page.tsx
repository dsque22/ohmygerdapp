'use client'

import Link from 'next/link'
import { MailCheck } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export default function CheckEmailPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <img src="/liao-symbol.png" alt="Liao Herbal" className="h-8 mr-3" />
            <h1 className="text-4xl font-bold text-primary-800">
              OhMyGerd
            </h1>
          </div>
          <p className="text-text-secondary">
            Conferma la tua email
          </p>
        </div>

        <Card>
          <CardHeader className="text-center">
            <MailCheck className="mx-auto h-12 w-12 text-green-500" />
            <CardTitle className="mt-4 font-sans font-bold">Verifica la tua casella di posta</CardTitle>
            <CardDescription>
              Abbiamo inviato un link di verifica a tuo indirizzo email.
              Per favore, controlla la tua casella di posta (e la cartella spam) per completare la registrazione.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-text-secondary">
              Non hai ricevuto l'email? Controlla la cartella spam o <Link href="/signup" className="text-accent hover:text-accent-dark transition-colors font-bold">prova a registrarti di nuovo</Link>.
            </p>
            <p className="mt-4 text-sm text-text-secondary">
              Già verificato? <Link href="/login" className="text-accent hover:text-accent-dark transition-colors font-bold">Accedi qui</Link>.
            </p>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-text-muted">
            © 2025 by LiaoHerbal LLC
          </p>
        </div>
      </div>
    </div>
  )
}
