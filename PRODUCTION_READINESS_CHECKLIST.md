# Production Readiness Checklist: Zeste Enterprise

Critical milestones required to transition the Zeste application from development to a stable, production-ready environment.

---

## 🛠️ 1. Core Technical Health
*Objective: Ensure a stable, bug-free, and maintainable codebase.*

- [x] **Production Build**: Confirm `ng build` completes without errors (Current: PASS).
- [ ] **Zero Warning Build**: Resolve all `NG8107` (optional chaining) and selector warnings in templates.
- [ ] **Tests Green**: Reach 100% pass rate on unit tests (Current: 92 FAILED). 
- [ ] **Naming Consistency**: Standardize file names (e.g., `breadcrum` vs `breadcrumb`).
- [ ] **Error Boundaries**: Implement a global error handler to catch and log production crashes without breaking the UI.

---

## 🛡️ 2. Security & Compliance
*Objective: Protect sensitive tenant and owner data.*

- [ ] **Environment Variables**: Move all API keys and backend URLs from `environment.ts` to `environment.prod.ts`.
- [ ] **Authentication Audit**: Verify `authGuard` is strictly applied to all `/core`, `/uam`, and `/features/config` routes.
- [ ] **HTTPS/SSL**: Ensure the production server is configured with a valid SSL certificate.
- [ ] **XSS Prevention**: Audit custom HTML injection points to ensure proper sanitization.
- [ ] **Encryption Service**: Verify that sensitive session data is being correctly encrypted/decrypted using `EncryptionService`.

---

## 🚀 3. Performance & Optimization
*Objective: High-speed experience for users on all connection types.*

- [ ] **Lazy Loading Verification**: Confirm that large modules (Inventory, Core, UAM) are actually lazy-loaded in production.
- [ ] **Asset Optimization**: Compress all images in `assets/Images` to reduce initial load weight.
- [ ] **Bundle Size**: Review initial chunk sizes to ensure they remain under the 1MB threshold for fast mobile parsing.
- [ ] **Production-Mode Toggle**: Ensure `enableProdMode()` is correctly invoked in `main.ts`.

---

## 🎨 4. UX & Design Excellence
*Objective: Maintain the "Premium" feel across every device.*

- [ ] **Design Token Audit**: Ensure 100% of components are using CSS variables instead of hardcoded hex codes.
- [ ] **Responsive Polish**: Verified layouts on iPhone SE (small) and Desktop Pro (large) screens.
- [ ] **Empty States**: Verify every table has a designed "No Records" view.
- [ ] **Skeleton Loaders**: Replace all spinners with shimmering skeleton placeholders for a high-end feel.

---

## 📱 5. PWA & Mobile Experience
*Objective: A seamless "Native App" feel for tenants.*

- [x] **Manifest configuration**: Scope and start_url are correctly set (Current: PASS).
- [x] **Service Worker**: PWA service worker is registered and functioning.
- [ ] **Offline UI**: Design a "No Internet" banner for the PWA.
- [ ] **Haptic Feedback**: (Optional) Add subtle vibrations for mobile interactions on success/error.

---

## 🧪 6. Critical Functional Flows (Smoke Test)
*These must work 100% of the time before launch:*

- [ ] **Tenant Flow**: Onboarding -> Login -> View Menu -> Pay Rent.
- [ ] **Owner Flow**: Client Creation -> Staff Onboarding -> Inventory Adjustment.
- [ ] **Maintenance Flow**: Report Issue -> Update Status -> Resolve.
- [ ] **Auth Flow**: Login -> Forgot Password (Email sent) -> Logout.

---

## 📈 7. Logging & Analytics
*Objective: Understand app usage and performance.*

- [ ] **Usage Tracking**: Integrate Google Analytics or similar to track user engagement.
- [ ] **Crash Logging**: Sentry or LogRocket integration to track production errors in real-time.
- [ ] **API Health Check**: Verify that backend health checks are monitored.
