<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>github-streak — README</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;700&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet">
<style>
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }

  :root {
    --bg: #080b0f;
    --bg2: #0e1318;
    --bg3: #141b22;
    --border: rgba(255,255,255,0.07);
    --border2: rgba(255,255,255,0.12);
    --green: #23d18b;
    --green2: #1a9e6a;
    --green-glow: rgba(35,209,139,0.15);
    --amber: #f0a500;
    --blue: #4dabf7;
    --text: #e2e8f0;
    --muted: #64748b;
    --muted2: #94a3b8;
    --mono: 'JetBrains Mono', monospace;
    --display: 'Bebas Neue', sans-serif;
    --body: 'DM Sans', sans-serif;
  }

  html { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--body);
    line-height: 1.6;
    overflow-x: hidden;
  }

  /* ── GRID BACKGROUND ── */
  body::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(35,209,139,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(35,209,139,0.03) 1px, transparent 1px);
    background-size: 40px 40px;
    pointer-events: none;
    z-index: 0;
  }

  /* ── GLOW ORBS ── */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    z-index: 0;
  }
  .orb1 { width: 500px; height: 500px; top: -150px; right: -100px; background: radial-gradient(circle, rgba(35,209,139,0.08), transparent 70%); }
  .orb2 { width: 400px; height: 400px; bottom: 10%; left: -100px; background: radial-gradient(circle, rgba(77,171,247,0.06), transparent 70%); }

  /* ── LAYOUT ── */
  main { position: relative; z-index: 1; max-width: 860px; margin: 0 auto; padding: 0 24px 80px; }

  /* ── HEADER ── */
  header {
    padding: 80px 0 60px;
    border-bottom: 1px solid var(--border);
    margin-bottom: 60px;
    position: relative;
  }

  .repo-path {
    font-family: var(--mono);
    font-size: 12px;
    color: var(--green);
    letter-spacing: 1px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
    opacity: 0;
    animation: fadeUp 0.6s ease forwards;
  }

  .repo-path::before {
    content: '';
    width: 6px; height: 6px;
    background: var(--green);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--green);
    animation: blink 2s ease-in-out infinite;
  }

  @keyframes blink {
    0%,100% { opacity: 1; box-shadow: 0 0 10px var(--green); }
    50% { opacity: 0.4; box-shadow: 0 0 4px var(--green); }
  }

  h1 {
    font-family: var(--display);
    font-size: clamp(64px, 10vw, 100px);
    line-height: 0.9;
    letter-spacing: 2px;
    color: #fff;
    opacity: 0;
    animation: fadeUp 0.6s 0.1s ease forwards;
  }

  h1 .accent { color: var(--green); }

  .tagline {
    font-size: 16px;
    color: var(--muted2);
    margin-top: 20px;
    max-width: 480px;
    line-height: 1.7;
    opacity: 0;
    animation: fadeUp 0.6s 0.2s ease forwards;
  }

  .badges {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 28px;
    opacity: 0;
    animation: fadeUp 0.6s 0.3s ease forwards;
  }

  .badge {
    font-family: var(--mono);
    font-size: 11px;
    padding: 5px 12px;
    border-radius: 3px;
    border: 1px solid;
    letter-spacing: 0.5px;
  }

  .badge-green { background: rgba(35,209,139,0.08); border-color: rgba(35,209,139,0.3); color: var(--green); }
  .badge-blue  { background: rgba(77,171,247,0.08); border-color: rgba(77,171,247,0.3); color: var(--blue); }
  .badge-amber { background: rgba(240,165,0,0.08); border-color: rgba(240,165,0,0.3); color: var(--amber); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── SECTIONS ── */
  section { margin-bottom: 56px; }

  .sec-label {
    font-family: var(--mono);
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: var(--green);
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .sec-label::after { content: ''; flex: 1; height: 1px; background: var(--border2); }

  h2 {
    font-family: var(--display);
    font-size: 38px;
    letter-spacing: 1px;
    color: #fff;
    margin-bottom: 20px;
  }

  /* ── HOW IT WORKS ── */
  .steps { display: flex; flex-direction: column; gap: 2px; }

  .step {
    display: grid;
    grid-template-columns: 56px 1fr;
    gap: 0;
    position: relative;
  }

  .step-left {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-top: 4px;
  }

  .step-icon {
    width: 36px; height: 36px;
    border-radius: 8px;
    background: var(--bg3);
    border: 1px solid var(--border2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 700;
    color: var(--green);
    flex-shrink: 0;
    transition: all 0.3s;
    position: relative;
    z-index: 1;
  }

  .step:hover .step-icon {
    background: var(--green-glow);
    border-color: var(--green);
    box-shadow: 0 0 16px var(--green-glow);
  }

  .step-line {
    width: 1px;
    flex: 1;
    background: var(--border);
    margin: 4px 0;
    min-height: 24px;
  }

  .step:last-child .step-line { display: none; }

  .step-body {
    padding: 4px 0 32px 16px;
  }

  .step-title {
    font-size: 15px;
    font-weight: 500;
    color: #fff;
    margin-bottom: 5px;
  }

  .step-desc {
    font-size: 13px;
    color: var(--muted2);
    line-height: 1.6;
  }

  .code-tag {
    display: inline-block;
    font-family: var(--mono);
    font-size: 11px;
    background: rgba(35,209,139,0.06);
    border: 1px solid rgba(35,209,139,0.2);
    color: var(--green);
    padding: 3px 10px;
    border-radius: 4px;
    margin-top: 8px;
  }

  /* ── SETUP ── */
  .setup-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 12px;
  }

  .setup-card {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 20px;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }

  .setup-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--green-glow), transparent);
    opacity: 0;
    transition: opacity 0.3s;
  }

  .setup-card:hover { border-color: rgba(35,209,139,0.3); transform: translateY(-3px); }
  .setup-card:hover::before { opacity: 1; }

  .setup-num {
    font-family: var(--mono);
    font-size: 28px;
    font-weight: 700;
    color: rgba(35,209,139,0.2);
    line-height: 1;
    margin-bottom: 10px;
  }

  .setup-card h4 { font-size: 14px; font-weight: 500; color: #fff; margin-bottom: 6px; }
  .setup-card p  { font-size: 12px; color: var(--muted2); line-height: 1.5; }

  /* ── CODE BLOCK ── */
  .code-block {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 10px;
    overflow: hidden;
  }

  .code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-bottom: 1px solid var(--border);
    background: var(--bg3);
  }

  .code-header span {
    font-family: var(--mono);
    font-size: 11px;
    color: var(--muted2);
  }

  .code-dots { display: flex; gap: 6px; }
  .code-dots i { width: 10px; height: 10px; border-radius: 50%; }
  .d1 { background: #ff5f57; }
  .d2 { background: #ffbd2e; }
  .d3 { background: #28ca42; }

  pre {
    font-family: var(--mono);
    font-size: 12px;
    line-height: 1.9;
    padding: 20px;
    overflow-x: auto;
    color: var(--muted2);
  }

  .k  { color: #c792ea; }
  .v  { color: var(--green); }
  .s  { color: var(--amber); }
  .c  { color: #3d5166; font-style: italic; }
  .cmd{ color: var(--blue); }

  /* ── FOLDER STRUCTURE ── */
  .tree {
    font-family: var(--mono);
    font-size: 13px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 24px;
    line-height: 2.2;
  }

  .tree-line { display: flex; align-items: center; gap: 8px; color: var(--muted2); }
  .tree-line.folder { color: var(--amber); }
  .tree-line.file-yml { color: var(--green); }
  .tree-line.file-txt { color: var(--blue); }
  .tree-line.file-md  { color: #e879f9; }

  /* ── MANUAL TRIGGER ── */
  .trigger-box {
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 28px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    flex-wrap: wrap;
  }

  .trigger-box h4 { font-size: 16px; font-weight: 500; margin-bottom: 5px; }
  .trigger-box p  { font-size: 13px; color: var(--muted2); }

  .btn {
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 1px;
    padding: 12px 24px;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    text-decoration: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.2s;
    white-space: nowrap;
  }

  .btn-green {
    background: var(--green);
    color: #000;
  }

  .btn-green:hover { background: #1ff098; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(35,209,139,0.3); }

  .btn-outline {
    background: transparent;
    color: var(--muted2);
    border: 1px solid var(--border2);
  }

  .btn-outline:hover { border-color: var(--green); color: var(--green); transform: translateY(-2px); }

  /* ── PERMISSION NOTE ── */
  .note {
    display: flex;
    gap: 12px;
    background: rgba(240,165,0,0.05);
    border: 1px solid rgba(240,165,0,0.2);
    border-radius: 8px;
    padding: 16px 18px;
    margin-top: 16px;
  }

  .note-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }
  .note p    { font-size: 13px; color: var(--muted2); line-height: 1.6; }
  .note strong { color: var(--amber); font-weight: 500; }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid var(--border);
    padding-top: 40px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: gap;
    gap: 16px;
  }

  footer p { font-family: var(--mono); font-size: 11px; color: var(--muted); }
  footer p span { color: var(--green); }

  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 28px; }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--border2); border-radius: 3px; }

  /* ── ANIMATIONS on scroll ── */
  .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.6s ease, transform 0.6s ease; }
  .reveal.visible { opacity: 1; transform: none; }
</style>
</head>
<body>

<div class="orb orb1"></div>
<div class="orb orb2"></div>

<main>

  <!-- HEADER -->
  <header>
    <div class="repo-path">thilak / github-streak</div>
    <h1>GITHUB<br><span class="accent">STREAK</span></h1>
    <p class="tagline">Automated GitHub contribution streak maintainer — keeps your green squares alive every single day without lifting a finger.</p>
    <div class="badges">
      <span class="badge badge-green">● active</span>
      <span class="badge badge-blue">cron: 0 0 * * *</span>
      <span class="badge badge-amber">ubuntu-latest</span>
      <span class="badge badge-green">main branch</span>
    </div>
    <div class="btn-row">
      <a href="https://github.com" class="btn btn-green">★ Star on GitHub</a>
      <a href="https://github.com" class="btn btn-outline">Fork →</a>
    </div>
  </header>

  <!-- HOW IT WORKS -->
  <section class="reveal">
    <div class="sec-label">mechanism</div>
    <h2>How It Works</h2>
    <div class="steps">
      <div class="step">
        <div class="step-left">
          <div class="step-icon">01</div>
          <div class="step-line"></div>
        </div>
        <div class="step-body">
          <div class="step-title">Daily Schedule Trigger</div>
          <div class="step-desc">GitHub Actions fires automatically every day at midnight UTC via a cron schedule expression.</div>
          <div class="code-tag">cron: '0 0 * * *'</div>
        </div>
      </div>
      <div class="step">
        <div class="step-left">
          <div class="step-icon">02</div>
          <div class="step-line"></div>
        </div>
        <div class="step-body">
          <div class="step-title">Spin Up Runner</div>
          <div class="step-desc">GitHub provisions a fresh temporary Ubuntu server and checks out your repository code onto it.</div>
          <div class="code-tag">runs-on: ubuntu-latest</div>
        </div>
      </div>
      <div class="step">
        <div class="step-left">
          <div class="step-icon">03</div>
          <div class="step-line"></div>
        </div>
        <div class="step-body">
          <div class="step-title">Append to streak.txt</div>
          <div class="step-desc">A shell command writes the current date and timestamp as a new line to <code style="font-family:'JetBrains Mono',monospace;color:var(--amber);font-size:12px">streak.txt</code>.</div>
          <div class="code-tag">echo "Streak updated on $(date)" >> streak.txt</div>
        </div>
      </div>
      <div class="step">
        <div class="step-left">
          <div class="step-icon">04</div>
          <div class="step-line"></div>
        </div>
        <div class="step-body">
          <div class="step-title">Commit & Push to main</div>
          <div class="step-desc">The built-in bot commits the changed file and pushes to <code style="font-family:'JetBrains Mono',monospace;color:var(--amber);font-size:12px">main</code>. GitHub counts this as a daily contribution — green square unlocked.</div>
          <div class="code-tag">chore: update GitHub streak</div>
        </div>
      </div>
    </div>
  </section>

  <!-- SETUP -->
  <section class="reveal">
    <div class="sec-label">getting started</div>
    <h2>Setup in 3 Steps</h2>
    <div class="setup-grid">
      <div class="setup-card">
        <div class="setup-num">01</div>
        <h4>Fork this repo</h4>
        <p>Click the Fork button on GitHub to copy this repository to your account.</p>
      </div>
      <div class="setup-card">
        <div class="setup-num">02</div>
        <h4>Enable Actions</h4>
        <p>Go to Settings → Actions → General and make sure Actions are enabled.</p>
      </div>
      <div class="setup-card">
        <div class="setup-num">03</div>
        <h4>Set write perms</h4>
        <p>Under Workflow permissions, select "Read and write" so the bot can push commits.</p>
      </div>
    </div>
    <div class="note">
      <div class="note-icon">⚠</div>
      <p><strong>Important:</strong> Without write permissions the workflow will fail on the push step. Go to <strong>Settings → Actions → General → Workflow permissions → Read and write access</strong> and save.</p>
    </div>
  </section>

  <!-- FILE STRUCTURE -->
  <section class="reveal">
    <div class="sec-label">repository layout</div>
    <h2>File Structure</h2>
    <div class="tree">
      <div class="tree-line folder">📁 github-streak/</div>
      <div class="tree-line folder" style="padding-left:20px">📁 .github/</div>
      <div class="tree-line folder" style="padding-left:40px">📁 workflows/</div>
      <div class="tree-line file-yml" style="padding-left:60px">📄 streak.yml &nbsp;<span style="color:var(--muted);font-size:11px">← the automation engine</span></div>
      <div class="tree-line file-txt" style="padding-left:20px">📄 streak.txt &nbsp;<span style="color:var(--muted);font-size:11px">← gets a new line every day</span></div>
      <div class="tree-line file-md" style="padding-left:20px">📄 README.md</div>
    </div>
  </section>

  <!-- WORKFLOW YAML -->
  <section class="reveal">
    <div class="sec-label">source</div>
    <h2>Workflow File</h2>
    <div class="code-block">
      <div class="code-header">
        <div class="code-dots"><i class="d1"></i><i class="d2"></i><i class="d3"></i></div>
        <span>.github/workflows/streak.yml</span>
        <span>YAML</span>
      </div>
<pre><span class="c"># GitHub Streak Automator</span>
<span class="k">name:</span> <span class="v">GitHub Streak Automator</span>

<span class="k">on:</span>
  <span class="k">schedule:</span>
    <span class="c"># Fires every day at midnight UTC</span>
    - <span class="k">cron:</span> <span class="s">'0 0 * * *'</span>
  <span class="k">workflow_dispatch:</span>  <span class="c"># allows manual trigger</span>

<span class="k">jobs:</span>
  <span class="k">streak:</span>
    <span class="k">runs-on:</span> <span class="v">ubuntu-latest</span>

    <span class="k">steps:</span>
      - <span class="k">name:</span> <span class="v">Checkout repository</span>
        <span class="k">uses:</span> <span class="v">actions/checkout@v4</span>

      - <span class="k">name:</span> <span class="v">Update streak file</span>
        <span class="k">run:</span> <span class="cmd">echo "Streak updated on $(date)" >> streak.txt</span>

      - <span class="k">name:</span> <span class="v">Commit and push</span>
        <span class="k">run:</span> |
          <span class="cmd">git config user.name "github-actions[bot]"</span>
          <span class="cmd">git config user.email "github-actions[bot]@users.noreply.github.com"</span>
          <span class="cmd">git add streak.txt</span>
          <span class="cmd">git commit -m "chore: update GitHub streak"</span>
          <span class="cmd">git push</span></pre>
    </div>
  </section>

  <!-- MANUAL TRIGGER -->
  <section class="reveal">
    <div class="sec-label">manual override</div>
    <h2>Run Anytime</h2>
    <div class="trigger-box">
      <div>
        <h4>Force an immediate commit</h4>
        <p>Don't wait until midnight — trigger the workflow manually right now from the Actions tab.</p>
        <p style="font-size:12px;color:var(--muted);margin-top:8px;font-family:'JetBrains Mono',monospace">Actions → GitHub Streak Automator → Run workflow</p>
      </div>
      <a href="https://github.com" class="btn btn-green">▶ &nbsp;Run workflow</a>
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="reveal">
    <p>built by <span>thilak</span> · powered by GitHub Actions · MIT License</p>
    <p style="font-family:'JetBrains Mono',monospace;font-size:11px;color:var(--muted)">last commit: <span style="color:var(--green)" id="ts"></span></p>
  </footer>

</main>

<script>
  document.getElementById('ts').textContent = new Date().toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' });

  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 80);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
</script>
</body>
</html>
