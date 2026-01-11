import { store } from "../store.js";

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

          <a class="card" href="#/task4" style="text-decoration:none; color:inherit;">
            <div class="subtitle" style="font-size:16px;">Task 4</div>
            <div class="body muted">Share media of the problem</div>
          </a>
        </div>
      </div>

      <div class="card">
        <div class="subtitle">Provider tasks</div>
        <div class="divider"></div>

        <div class="grid">
          <a class="card" href="#/task8" style="text-decoration:none; color:inherit;">
            <div class="subtitle" style="font-size:16px;">Task 8</div>
            <div class="body muted">Respond to new job request</div>
          </a>
        </div>
      </div>

      <div class="card">
        <div class="subtitle">Admin tasks</div>
        <div class="divider"></div>

        <div class="grid">
          <a class="card" href="#/task12" style="text-decoration:none; color:inherit;">
            <div class="subtitle" style="font-size:16px;">Task 12</div>
            <div class="body muted">Moderate disputes between users</div>
          </a>
        </div>
      </div>

      <div class="sticky-actions">
        <button class="btn ghost" id="resetBtn">
          Reset demo
        </button>
      </div>
    </section>
  `);

  document.getElementById("resetBtn").addEventListener("click", () => {
    store.reset();
    alert('Demo reset! All data cleared.');
    window.location.reload();
  });
}
