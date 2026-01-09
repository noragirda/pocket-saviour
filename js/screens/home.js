export function HomeScreen({ mount }) {
  mount(`
    <section class="screen">
      <div class="title">PocketSaviour</div>
      <div class="body muted">High-fidelity coded prototype (mock data)</div>

      <div class="card">
        <div class="subtitle">Client tasks</div>
        <div class="divider"></div>

        <div class="grid">
          <a class="card" href="#/task1" style="text-decoration:none; color:inherit;">
            <div class="subtitle" style="font-size:16px;">Task 1</div>
            <div class="body muted">Power outage → request electrician</div>
          </a>

          <a class="card" href="#/task2" style="text-decoration:none; color:inherit;">
            <div class="subtitle" style="font-size:16px;">Task 2</div>
            <div class="body muted">Search & compare plumbers</div>
          </a>

          <a class="card" href="#/task3" style="text-decoration:none; color:inherit;">
            <div class="subtitle" style="font-size:16px;">Task 3</div>
            <div class="body muted">Schedule appliance repair visit</div>
          </a>
        </div>
      </div>

      <div class="sticky-actions">
        <a class="btn ghost" href="#" onclick="localStorage.clear(); alert('Demo reset (cleared localStorage).'); return false;">
          Reset demo
        </a>
      </div>
    </section>
  `);
}
