# 📁 Project Architecture

Ecoh uses a **Clean Feature-Driven Architecture** built on top of **Expo Router**, designed for scalability, modularity, and long-term clarity.  
Each layer has a clear responsibility, following the flow:

> **UI → Application → Domain → Infrastructure**

---

<details>
<summary><strong>🧭 Folder Structure Overview</strong></summary>

```plaintext
-app/                        # Expo Router entry points (navigation, layouts)
│   ├── (auth)/                 # Route groups for features
│   ├── (dashboard)/
│   ├── _layout.tsx
│   └── +not-found.tsx
│
-src/
│
├── features/                   # Core business domains (authentication, feed, etc.)
│   ├── authentication/
│   │   ├── api/                # HTTP / React Query logic
│   │   ├── components/         # Feature-specific UI (forms, modals, lists)
│   │   ├── hooks/              # Business logic hooks
│   │   ├── store/              # Local feature store (Zustand/Jotai)
│   │   ├── lib/                # Feature-only utilities or transformers
│   │   ├── types/              # Local enums & interfaces
│   │   └── index.ts
│   ├── feed/
│   └── profile/
│
├── components/                 # Global reusable UI system
│   ├── ui/                     # Inputs, buttons, modals, layout primitives
│   ├── forms/                  # Shared form elements (e.g., DatePicker)
│   └── animations/             # Reanimated helpers and effects
│
├── shared/                     # Cross-cutting infrastructure and global contracts
│   ├── adapters/               # Framework bridges (e.g., FormikEcohInput)
│   ├── enums/                  # Global enums used by multiple domains
│   ├── interfaces/             # Global interfaces (User, Media, etc.)
│   ├── lib/                    # Pure reusable utility functions
│   ├── services/               # Singleton service clients (HTTP, Storage, etc.)
│   ├── store/                  # App-wide Zustand/Jotai stores
│   ├── types/                  # Root types shared across domains
│   └── utils/                  # Small reusable helpers
│
├── theme/                      # Theming system and design tokens
│   ├── colors.ts
│   ├── typography.ts
│   └── ThemeContext.tsx
│
├── hooks/                      # App-level composable hooks (cross-feature)
│   ├── useTheme.ts
│   ├── useKeyboard.ts
│   └── useNetworkStatus.ts
```
