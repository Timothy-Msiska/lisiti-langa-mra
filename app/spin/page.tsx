import { redirect } from "next/navigation"
import { Brand } from "@/components/brand"
import { isSignedIn } from "@/lib/auth"
import { getState } from "@/lib/draw"
import { SpinRunner } from "./spin-runner"

export default async function SpinPage() {
  if (!(await isSignedIn())) redirect("/")
  const { snapshot, prizes } = getState()
  // Display order: 1st on top, 2nd middle, 3rd bottom.
  // Reveal order is handled by SpinRunner (3rd first → 2nd → 1st last).
  const ladder = [...prizes] // prizes = [1st, 2nd, 3rd]

  return (
    <div className="mra">
      <header className="topbar">
        <Brand />
        <div className="operator">
          <span>{snapshot.campaignId}</span>
          <strong id="draw-status">LIVE DRAW</strong>
          <a href="/control" aria-label="Exit draw">
            ×
          </a>
        </div>
      </header>

      <main className="spin-room">
        <section className="spin-copy">
          <span className="eyebrow">LIVE DRAW ROOM · AUTOMATED SEQUENCE</span>
          <h1 id="spin-title">Selecting 3rd prize.</h1>
          <p id="spin-description">Watch the secure draw service select from the frozen population.</p>
          <div className="live">
            <i />
            <span id="live-status">Selection in progress</span>
          </div>
          <div className="sequence">↯ Automatic sequence · 3rd → 2nd → 1st</div>
        </section>

        <section className="wheel-stage">
          <div className="halo halo-one" />
          <div className="halo halo-two" />
          <div className="pointer" />
          <div className="wheel" id="wheel">
            <div className="wheel-center">
              <span>DRAWING</span>
              <b>...</b>
            </div>
          </div>
        </section>

        <aside className="prizes">
          <span className="eyebrow">PRIZE LADDER</span>
          {ladder.map((prize) => (
            <div className="prize" data-position={prize.position} key={prize.position}>
              <span>{prize.position}</span>
              <div>
                <b>{prize.name}</b>
                <small>{prize.amount}</small>
              </div>
              <strong>○</strong>
            </div>
          ))}
        </aside>
      </main>

      <div className="celebration" id="celebration" aria-hidden="true">
        <div className="balloons" id="balloons" />
        <div className="grand-card">
          <span className="grand-eyebrow">GRAND PRIZE WINNER</span>
          <b id="celebration-name">Grand prize</b>
          <small id="celebration-amount">—</small>
          <span className="grand-tag">1st place · Lisiti Langa</span>
        </div>
      </div>

      <SpinRunner />
    </div>
  )
}
