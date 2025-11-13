import { useEffect, useMemo, useState } from 'react'
import Spline from '@splinetool/react-spline'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

function CosmicButton({ loading, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className="relative inline-flex items-center justify-center px-6 py-3 rounded-xl font-semibold tracking-wide transition-all disabled:opacity-60 disabled:cursor-not-allowed \
                 bg-gradient-to-r from-cyan-500 via-blue-600 to-purple-700 text-white shadow-[0_0_20px_rgba(56,189,248,.35)] hover:shadow-[0_0_40px_rgba(56,189,248,.6)]"
    >
      <span className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400/30 via-blue-600/30 to-purple-700/30 blur-xl rounded-xl" aria-hidden />
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Generating...
          </>
        ) : (
          <>⚡ Hyper-Generate</>
        )}
      </span>
    </button>
  )
}

function CodeBlock({ title, code }) {
  return (
    <div className="bg-[#0A0F1D]/80 border border-white/10 rounded-xl overflow-hidden backdrop-blur">
      <div className="px-4 py-2 text-xs uppercase tracking-wider text-cyan-300/80 bg-white/5">{title}</div>
      <pre className="p-4 text-[12px] leading-relaxed text-cyan-50 whitespace-pre-wrap overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function MediaCard({ title, children, actions }) {
  return (
    <div className="bg-[#0A0F1D]/80 border border-white/10 rounded-xl p-4 backdrop-blur flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h3 className="text-cyan-200 text-sm tracking-wider uppercase">{title}</h3>
        {actions}
      </div>
      {children}
    </div>
  )
}

function App() {
  const [prompt, setPrompt] = useState(
    'The discovery of a giant alien monolith on the dark side of the Moon, depicting ancient symbols and radiating a faint electric blue light.'
  )
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  const bgStyle = useMemo(() => ({
    background: 'radial-gradient(1200px 600px at 70% 10%, rgba(56,189,248,.15), transparent 60%), radial-gradient(1000px 500px at 20% 0%, rgba(147,51,234,.12), transparent 60%), #070914',
  }), [])

  async function onGenerate() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND}/api/hyper-generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      if (!res.ok) throw new Error('Failed to generate')
      const json = await res.json()
      setData(json)
    } catch (e) {
      setError(e?.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Auto-run once on mount
    onGenerate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen text-white" style={bgStyle}>
      <div className="absolute inset-0 overflow-hidden">
        <div className="h-[60vh] w-full">
          <Spline scene="https://prod.spline.design/EF7JOSsHLk16Tlw9/scene.splinecode" style={{ width: '100%', height: '100%' }} />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-[#070914]/40 to-[#070914]" />
      </div>

      <header className="relative z-10 max-w-6xl mx-auto px-6 pt-8 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-md bg-gradient-to-br from-cyan-400 to-purple-600 shadow-lg" />
          <div>
            <h1 className="text-xl font-semibold tracking-wide">AI Power</h1>
            <p className="text-xs text-cyan-200/70 -mt-0.5">Gemini-style Hyper Generator</p>
          </div>
        </div>
        <div className="text-cyan-200/70 text-xs">Cosmic Dark</div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-6 pb-24">
        <section className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto] items-end">
          <div className="bg-[#0A0F1D]/70 border border-white/10 rounded-2xl p-4 backdrop-blur">
            <label className="text-xs text-cyan-200/80">Your Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="mt-1 w-full bg-transparent outline-none resize-none text-cyan-50 placeholder:text-cyan-200/40"
              placeholder="Describe what to generate..."
            />
          </div>
          <div className="flex md:justify-end">
            <CosmicButton loading={loading} onClick={onGenerate} />
          </div>
        </section>

        {error && (
          <div className="mt-4 text-rose-300 bg-rose-900/20 border border-rose-500/20 rounded-xl p-3">{error}</div>
        )}

        {data && (
          <section className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-7 space-y-6">
              <MediaCard title="Conversational Response">
                <p className="text-cyan-100/90 leading-relaxed">{data.text_response}</p>
              </MediaCard>

              <MediaCard title="Code Snippets">
                <div className="grid md:grid-cols-2 gap-4">
                  <CodeBlock title="Python" code={data.code_snippets?.python} />
                  <CodeBlock title="Kotlin" code={data.code_snippets?.kotlin} />
                </div>
              </MediaCard>

              <MediaCard title="Narrated Video (Plan)">
                <p className="text-cyan-100/80 text-sm">Duration: {data.video?.duration_sec}s</p>
                <p className="text-cyan-100/80 text-sm">Narration:</p>
                <p className="text-cyan-100/90 whitespace-pre-wrap">{data.video?.narration_text}</p>
                <div className="mt-3 text-cyan-200/70 text-xs">Storyboard:</div>
                <ul className="mt-1 space-y-1 text-cyan-100/70 text-sm">
                  {data.video?.storyboard?.map((f, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="text-cyan-300">{Math.round(f.t)}s</span>
                      <span className="font-medium">{f.title}</span>
                      <span className="opacity-70">— {f.description}</span>
                    </li>
                  ))}
                </ul>
              </MediaCard>
            </div>

            <div className="lg:col-span-5 space-y-6">
              <MediaCard title="High-Res Image">
                <div className="aspect-video w-full rounded-lg overflow-hidden border border-white/10 bg-black/40">
                  <iframe
                    title="Generated SVG"
                    srcDoc={data.image_svg}
                    className="w-full h-full"
                  />
                </div>
              </MediaCard>

              <MediaCard title="Podcast / Soundscape (Plan)">
                <p className="text-cyan-100/80 text-sm">Duration: {Math.floor((data.audio?.duration_sec || 0)/60)} min</p>
                <ul className="mt-2 space-y-1 text-cyan-100/70 text-sm">
                  {data.audio?.layers?.map((l, i) => (
                    <li key={i} className="flex items-center justify-between">
                      <span>{l.name}</span>
                      <span className="text-cyan-300/80 text-xs">{l.type}</span>
                    </li>
                  ))}
                </ul>
              </MediaCard>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
