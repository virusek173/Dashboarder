import { TabConfig } from "@/types";

export const tabsConfig: TabConfig[] = [
  {
    id: "displays",
    label: "Displays",
    rows: [
      {
        id: "example-feature-1",
        label: "Example Feature 1",
        jiraLabels: ["feature-1"],
        deadline: "2026-06-30",
      },
      {
        id: "example-feature-2",
        label: "Example Feature 2",
        jiraLabels: ["feature-2", "ui"],
        requireAllLabels: true, // Requires BOTH labels
        deadline: "2026-07-15",
      },
      {
        id: "example-feature-3",
        label: "Example Feature 3",
        jiraLabels: ["feature-3"],
        excludeLabels: ["deprecated"], // Must NOT have 'deprecated' label
        deadline: "2026-08-01",
      },
    ],
  },
  {
    id: "features",
    label: "Features",
    rows: [
      {
        id: "backend-api",
        label: "Backend API",
        jiraLabels: ["backend", "api"],
        deadline: "2026-09-01",
      },
      {
        id: "frontend-ui",
        label: "Frontend UI",
        jiraLabels: ["frontend", "ui"],
        deadline: "2026-09-15",
      },
    ],
  },
];
