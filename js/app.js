import { createRouter } from "./router.js";
import { HomeScreen } from "./screens/home.js";
import { 
    Task1Context, 
    Task1Category, 
    Task1Symptoms, 
    Task1UrgencyAddress, 
    Task1Providers, 
    Task1Confirm } 
  from "./screens/task1.js";
import {
  Task2Context,
  Task2SearchFilters,
  Task2Results,
  Task2CompareSaved,
  Task2Message,
  Task2Confirm
} from "./screens/task2.js";
import {
  Task3Context,
  Task3ApplianceIssue,
  Task3Schedule,
  Task3Providers,
  Task3Confirm,
  Task3Success
} from "./screens/task3.js";



const appEl = document.getElementById("app");

function mount(html) {
  appEl.innerHTML = html;
}

const router = createRouter({
  routes: {
    "#/home": () => HomeScreen({ mount, router }),
    "#/task1": () => router.navigate("#/task1/context"),
    "#/task1/context": () => Task1Context({ mount, router }),
    "#/task1/category": () => Task1Category({ mount, router }),
    "#/task1/symptoms": () => Task1Symptoms({ mount, router }),
    "#/task1/urgency": () => Task1UrgencyAddress({ mount, router }),
    "#/task1/providers": () => Task1Providers({ mount, router }),
    "#/task1/confirm": () => Task1Confirm({ mount, router }),

    "#/task2": () => router.navigate("#/task2/context"),
    "#/task2/context": () => Task2Context({ mount, router }),
    "#/task2/filters": () => Task2SearchFilters({ mount, router }),
    "#/task2/results": () => Task2Results({ mount, router }),
    "#/task2/compare": () => Task2CompareSaved({ mount, router }),
    "#/task2/message": () => Task2Message({ mount, router }),
    "#/task2/confirm": () => Task2Confirm({ mount, router }),
    
    "#/task3": () => router.navigate("#/task3/context"),
    "#/task3/context": () => Task3Context({ mount, router }),
    "#/task3/details": () => Task3ApplianceIssue({ mount, router }),
    "#/task3/schedule": () => Task3Schedule({ mount, router }),
    "#/task3/providers": () => Task3Providers({ mount, router }),
    "#/task3/confirm": () => Task3Confirm({ mount, router }),
    "#/task3/success": () => Task3Success({ mount, router }),

  },
  onNotFound: () => {
    mount(`
      <section class="screen">
        <div class="title">Page not found</div>
        <div class="body muted">This route doesn’t exist in the prototype.</div>
        <div class="sticky-actions">
          <a class="btn primary" href="#/home">Go home</a>
        </div>
      </section>
    `);
  }
});

router.render();
