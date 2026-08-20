import { Brand } from "@/components/brand"
import { signIn } from "@/lib/auth"

export default function LoginPage() {
  return (
    <main className="mra login-page">
      <section className="login-panel">
        <Brand />
        <div className="login-copy">
          <span className="eyebrow">OFFICIAL DRAW CONTROL</span>
          <h1>Welcome back.</h1>
          <p>Sign in to manage the Lisiti Langa official draw.</p>
        </div>
        <form action={signIn}>
          <label>
            Email address
            <input name="email" type="email" placeholder="name@mra.mw" required />
          </label>
          <label>
            Password
            <input name="password" type="password" placeholder="Enter your password" required />
          </label>
          <button className="button primary" type="submit">
            Sign in <span>{"→"}</span>
          </button>
        </form>
        <p className="security">{"✓ Secure access for authorised draw administrators"}</p>
      </section>
      <aside className="login-aside">
        <span className="eyebrow">LISITI LANGA · LL-2026</span>
        <h2>
          Every receipt.
          <br />
          <em>One trusted draw.</em>
        </h2>
        <p>The official MRA EIS draw room keeps every selection controlled, visible and auditable.</p>
        <hr />
        <small>Wednesday, 20 August 2026</small>
      </aside>
    </main>
  )
}
