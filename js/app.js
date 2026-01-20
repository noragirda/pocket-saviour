import { createRouter } from "./router.js";
import { store } from "./store.js"; 
import { toast } from "./ui.js";
import { HomeScreen } from "./screens/home.js";

import { Task1Context, Task1Category, Task1Symptoms, Task1UrgencyAddress, Task1Providers, Task1Confirm } from "./screens/task1.js";
import { Task2Context, Task2SearchFilters, Task2Results, Task2CompareSaved, Task2Message, Task2Confirm } from "./screens/task2.js";
import { Task3Context, Task3ApplianceIssue, Task3Schedule, Task3Providers, Task3Confirm, Task3Success } from "./screens/task3.js";

import { Task4Context, Task4CaptureMedia, Task4AttachToRequest, Task4Clarify, Task4AwaitAck } from "./screens/task4.js";
import { Task8Context, Task8ReviewSummary, Task8PushNotification, Task8DecideAvailability, Task8AIAdjustCalendar, Task8AwaitConfirmation } from "./screens/task8.js";
import { Task12Context, Task12OpenCases, Task12ClaimDetails, Task12ContactParties, Task12EvaluateResolution, Task12NotifyUsers } from "./screens/task12.js";

import { Task5JobList, Task5Reflect, Task5Rating, Task5Feedback, Task5Success } from "./screens/task5.js";
import { Task6History, Task6Form, Task6Resolution, Task6Success } from "./screens/task6.js";
import { Task7Identity, Task7Credentials, Task7Services, Task7Schedule, Task7Success } from "./screens/task7.js";

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

    "#/task4": () => Task4Context({ mount, router }),
    "#/task4/context": () => Task4Context({ mount, router }),
    "#/task4/capture": () => Task4CaptureMedia({ mount, router }),
    "#/task4/attach": () => Task4AttachToRequest({ mount, router }),
    "#/task4/clarify": () => Task4Clarify({ mount, router }),
    "#/task4/await": () => Task4AwaitAck({ mount, router }),

    "#/task5": () => Task5JobList({ mount, router }),
    "#/task5/reflect": () => Task5Reflect({ mount, router }),
    "#/task5/rate": () => Task5Rating({ mount, router }),
    "#/task5/feedback": () => Task5Feedback({ mount, router }),
    "#/task5/success": () => Task5Success({ mount, router }),

    "#/task6": () => Task6History({ mount, router }),
    "#/task6/form": () => Task6Form({ mount, router }),
    "#/task6/resolution": () => Task6Resolution({ mount, router }),
    "#/task6/success": () => Task6Success({ mount, router }),

    "#/task7": () => router.navigate("#/task7/identity"),
    "#/task7/identity": () => Task7Identity({ mount, router }),
    "#/task7/credentials": () => Task7Credentials({ mount, router }),
    "#/task7/services": () => Task7Services({ mount, router }),
    "#/task7/schedule": () => Task7Schedule({ mount, router }),
    "#/task7/success": () => Task7Success({ mount, router }),

    "#/task8": () => Task8Context({ mount, router }),
    "#/task8/context": () => Task8Context({ mount, router }),
    "#/task8/review": () => Task8ReviewSummary({ mount, router }),
    "#/task8/notification": () => Task8PushNotification({ mount, router }),
    "#/task8/availability": () => Task8DecideAvailability({ mount, router }),
    "#/task8/calendar": () => Task8AIAdjustCalendar({ mount, router }),
    "#/task8/await": () => Task8AwaitConfirmation({ mount, router }),

    "#/task9": () => Task9List({ mount, router }),
    "#/task9/list": () => Task9List({ mount, router }),
    "#/task9/proximity": () => Task9Proximity({ mount, router }),
    "#/task9/adjust": () => Task9Adjust({ mount, router }),
    "#/task9/confirm": () => Task9Confirm({ mount, router }),

    "#/task10": () => Task10Active({ mount, router }),
    "#/task10/active": () => Task10Active({ mount, router }),
    "#/task10/mark": () => Task10Mark({ mount, router }),
    "#/task10/proof": () => Task10Proof({ mount, router }),
    "#/task10/submitted": () => Task10Submitted({ mount, router }),
    "#/task10/feedback": () => Task10Feedback({ mount, router }),

    "#/task11": () => Task11Queue({ mount, router }),
    "#/task11/queue": () => Task11Queue({ mount, router }),
    "#/task11/detail": () => Task11Detail({ mount, router }),
    "#/task11/docs": () => Task11Docs({ mount, router }),
    "#/task11/decision": () => Task11Decision({ mount, router }),
    "#/task11/success": () => Task11Success({ mount, router }),

    "#/task12": () => Task12Context({ mount, router }),
    "#/task12/context": () => Task12Context({ mount, router }),
    "#/task12/cases": () => Task12OpenCases({ mount, router }),
    "#/task12/details": () => Task12ClaimDetails({ mount, router }),
    "#/task12/contact": () => Task12ContactParties({ mount, router }),
    "#/task12/evaluate": () => Task12EvaluateResolution({ mount, router }),
    "#/task12/notify": () => Task12NotifyUsers({ mount, router }),
  },
  onNotFound: () => {
    mount(`<div class="screen"><div class="title">404</div><div class="body">Page not found</div><a class="btn primary" href="#/home">Home</a></div>`);
  }
});

window.addEventListener("keydown", (e) => {
  if (!e.shiftKey) return;

  const code = e.code; 

  if (code === "Digit1") {
    store.set("user.activeRole", "client");
    store.set("ui.activeHomeTab", "services");
    toast("Switched to Client Mode");
    refreshHome();
  } else if (code === "Digit2") {
    store.set("user.activeRole", "provider");
    store.set("ui.activeHomeTab", "dashboard");
    toast("Switched to Provider Mode");
    refreshHome();
  } else if (code === "Digit3") {
    store.set("user.activeRole", "admin");
    toast("Switched to Admin Mode");
    refreshHome();
  } else if (code === "KeyR") {
    if(confirm("Reset Prototype Data?")) {
      store.reset();
      location.reload();
    }
  }
});

function refreshHome() {
  if (location.hash === "#/home" || location.hash === "") {
    HomeScreen({ mount, router });
  } else {
    router.navigate("#/home");
  }
}

router.render();