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
import {
  Task4Context,
  Task4CaptureMedia,
  Task4AttachToRequest,
  Task4Clarify,
  Task4AwaitAck
} from "./screens/task4.js";
import {
  Task8Context,
  Task8ReviewSummary,
  Task8PushNotification,
  Task8DecideAvailability,
  Task8AIAdjustCalendar,
  Task8AwaitConfirmation
} from "./screens/task8.js";
import {
  Task12Context,
  Task12OpenCases,
  Task12ClaimDetails,
  Task12ContactParties,
  Task12EvaluateResolution,
  Task12NotifyUsers
} from "./screens/task12.js";



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

    "#/task4": () => router.navigate("#/task4/context"),
    "#/task4/context": () => Task4Context({ mount, router }),
    "#/task4/capture": () => Task4CaptureMedia({ mount, router }),
    "#/task4/attach": () => Task4AttachToRequest({ mount, router }),
    "#/task4/clarify": () => Task4Clarify({ mount, router }),
    "#/task4/await": () => Task4AwaitAck({ mount, router }),

    "#/task8": () => router.navigate("#/task8/context"),
    "#/task8/context": () => Task8Context({ mount, router }),
    "#/task8/review": () => Task8ReviewSummary({ mount, router }),
    "#/task8/notification": () => Task8PushNotification({ mount, router }),
    "#/task8/availability": () => Task8DecideAvailability({ mount, router }),
    "#/task8/calendar": () => Task8AIAdjustCalendar({ mount, router }),
    "#/task8/await": () => Task8AwaitConfirmation({ mount, router }),

    "#/task12": () => router.navigate("#/task12/context"),
    "#/task12/context": () => Task12Context({ mount, router }),
    "#/task12/cases": () => Task12OpenCases({ mount, router }),
    "#/task12/details": () => Task12ClaimDetails({ mount, router }),
    "#/task12/contact": () => Task12ContactParties({ mount, router }),
    "#/task12/evaluate": () => Task12EvaluateResolution({ mount, router }),
    "#/task12/notify": () => Task12NotifyUsers({ mount, router })

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
