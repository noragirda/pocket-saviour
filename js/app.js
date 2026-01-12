import { createRouter } from "./router.js";
import { HomeScreen } from "./screens/home.js";

import { Task1Context, Task1Category, Task1Symptoms, Task1UrgencyAddress, Task1Providers, Task1Confirm } from "./screens/task1.js";
import { Task2Context, Task2SearchFilters, Task2Results, Task2CompareSaved, Task2Message, Task2Confirm } from "./screens/task2.js";
import { Task3Context, Task3ApplianceIssue, Task3Schedule, Task3Providers, Task3Confirm, Task3Success } from "./screens/task3.js";

import { Task5JobList, Task5Reflect, Task5Rating, Task5Feedback, Task5Success } from "./screens/task5.js";
import { Task6History, Task6Form, Task6Resolution, Task6Success } from "./screens/task6.js";
import { Task7Identity, Task7Credentials, Task7Services, Task7Schedule, Task7Success } from "./screens/task7.js";

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
  },
  onNotFound: () => {
    mount(`<div class="screen"><div class="title">404</div><a class="btn primary" href="#/home">Home</a></div>`);
  }
});

router.render();