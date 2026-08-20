import { redirect } from "next/navigation"
import { Brand } from "@/components/brand"
import { isSignedIn, signOut, startDrawAction } from "@/lib/auth"
import { getState } from "@/lib/draw"

export default async function ControlPage() {
  if (!(await isSignedIn())) redirect("/")
  const { snapshot } = getState()

  return (
    <div className="mra">
      <header className="topbar">
        <Brand />
        <div className="operator">
          <i />
          Authorised operator
          <form action={signOut}>
            <button aria-label="Sign out" type="submit">
              ×
            </button>
          </form>
        </div>
      </header>

      <main className="control">
        <section className="intro">
          <span className="eyebrow">OFFICIAL DRAW CONTROL · STEP 01 OF 02</span>
          <h1>
            Ready to begin
            <br />
            <em>the official draw?</em>
          </h1>
          <p>Confirm the frozen eligibility snapshot before entering the live draw room.</p>
        </section>

        <section className="control-grid">
          <article className="panel">
            <div className="panel-heading">
              <div>
                <span className="eyebrow">DRAW SNAPSHOT</span>
                <h2>{snapshot.campaignId}</h2>
              </div>
              <span className="badge">LOCKED</span>
            </div>
            <dl>
              <div>
                <dt>Campaign</dt>
                <dd>{snapshot.campaignName}</dd>
              </div>
              <div>
                <dt>Draw date</dt>
                <dd>{snapshot.drawDate}</dd>
              </div>
              <div>
                <dt>Eligible entries</dt>
                <dd>{snapshot.eligibleEntries.toLocaleString("en-US")}</dd>
              </div>
              <div>
                <dt>Winners to select</dt>
                <dd>3 official prizes</dd>
              </div>
              <div>
                <dt>Population hash</dt>
                <dd className="mono">{snapshot.populationHash}</dd>
              </div>
            </dl>
            <div className="integrity">
              <strong>{"✓ Snapshot verified"}</strong>
              <span>Eligibility is frozen and cannot change during this draw.</span>
            </div>
          </article>

          <aside className="panel action">
            <span className="action-mark">◆</span>
            <span className="eyebrow">AUTHORISED ACTION</span>
            <h2>Open draw room</h2>
            <p>
              Starting the draw will create an audit record and move you to the live winner selection
              screen.
            </p>
            <form action={startDrawAction}>
              <button className="button primary" type="submit">
                Confirm and start draw <span>{"→"}</span>
              </button>
            </form>
            <small>▣ Backend-controlled selection</small>
          </aside>
        </section>
      </main>
    </div>
  )
}
