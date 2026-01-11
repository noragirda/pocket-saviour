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

import { Task9List, Task9Proximity, Task9Adjust, Task9Confirm } from "./screens/task9.js";
import { Task10Active, Task10Mark, Task10Proof, Task10Submitted, Task10Feedback } from "./screens/task10.js";
import { Task11Queue, Task11Detail, Task11Docs, Task11Decision, Task11Success } from "./screens/task11.js";




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

    // Task 9: Manage Appointments
    "#/task9": () => router.navigate("#/task9/list"),
    "#/task9/list": () => Task9List({ mount, router }),
    "#/task9/proximity": () => Task9Proximity({ mount, router }),
    "#/task9/adjust": () => Task9Adjust({ mount, router }),
    "#/task9/confirm": () => Task9Confirm({ mount, router }),

    // Task 10: Complete Job
    "#/task10": () => router.navigate("#/task10/active"),
    "#/task10/active": () => Task10Active({ mount, router }),
    "#/task10/mark": () => Task10Mark({ mount, router }),
    "#/task10/proof": () => Task10Proof({ mount, router }),
    "#/task10/submitted": () => Task10Submitted({ mount, router }),
    "#/task10/feedback": () => Task10Feedback({ mount, router }),

    // Task 11: Verify Credentials
    "#/task11": () => router.navigate("#/task11/queue"),
    "#/task11/queue": () => Task11Queue({ mount, router }),
    "#/task11/detail": () => Task11Detail({ mount, router }),
    "#/task11/docs": () => Task11Docs({ mount, router }),
    "#/task11/decision": () => Task11Decision({ mount, router }),
    "#/task11/success": () => Task11Success({ mount, router }),

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
