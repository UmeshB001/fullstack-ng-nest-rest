
<img width="1588" height="802" alt="Screenshot 2026-02-27 at 11 13 50 PM" src="https://github.com/user-attachments/assets/e59ee245-d641-4044-bee3-ff818a11a6fb" />

## 🛡️ Task Vault POC: Step-by-Step Implementation Guide

This document tracks the senior-level architectural decisions and implementation steps taken to build the **Task Vault** using Angular 19 and NestJS.

---

## 1. Project Initialization & Base Setup
* **Backend (NestJS):** * Set up a NestJS REST API with Mongoose for MongoDB integration.
    * Implemented `Task` Schema with `title`, `description`, and `status`.
    * Configured **Passport JWT** for secure authentication.
* **Frontend (Angular 19):**
    * Initialized a standalone component architecture.
    * Integrated **Tailwind CSS** for the "Vault" (dark-themed) UI.
    * Configured `HttpClient` with a **Functional Interceptor** for JWT injection.

---

## 2. Security & Global Error Handling
* **The Auth Interceptor:**
    * Created a functional interceptor to automatically attach the Bearer token from `localStorage`.
    * Added logic to catch `401 Unauthorized` errors globally, triggering an automatic logout and redirect if the session expires.
* **Auth Guards:**
    * Implemented a functional `canActivate` guard to protect the `/tasks` route from unauthenticated users.



---

## 3. Reactive State with Angular Signals
* **Migration to Signals:** Replaced traditional variables with `signal()` to enable fine-grained reactivity.
* **Computed Signals:** * Created `completedCount()` to track finished tasks.
    * Created `completionPercentage()` to drive a real-time progress bar.
* **Signal-based Inputs/Outputs:**
    * Updated the `TaskCardComponent` to use the modern `input()`, `input.required()`, and `output()` API.
    * Implemented **OnPush Change Detection** for 60fps performance.



---

## 4. High-Performance List Management
* **CDK Virtual Scrolling:**
    * Integrated `cdk-virtual-scroll-viewport` to handle potential list growth without degrading performance.
    * Optimized buffering (`minBufferPx`/`maxBufferPx`) to ensure smooth scrolling while items expand and collapse.
* **Optimization Strategies:**
    * Implemented `trackBy` to prevent DOM re-creation.
    * Optimized `localStorage` sync using the `effect()` primitive.



---

## 5. Advanced UI/UX: The Exclusive Accordion
* **Lifting State Up:** * Moved the `expandedTaskId` state to the parent `TaskList` to ensure only one card can be expanded at a time.
* **Toggle Logic:**
    * Implemented a "Switch and Toggle" behavior: clicking a new card opens it and closes the old one; clicking the same card toggles it shut.
* **Interactive Toggles:** * Created a custom icon-based toggle for "Complete/Undo" actions using Tailwind transitions and conditional SVG rendering.

---

## 6. Interaction Refinement (Anti-Lag & Loaders)
* **Debounced Interactions:** * Used RxJS `Subject` and `debounceTime` to handle rapid "spam clicking," preventing the UI state from becoming inconsistent.
* **Contextual Loading States:**
    * Added a local `isProcessing` signal per card.
    * Implemented a glass-morphism loader overlay that dims only the specific card undergoing a server-side update.
* **Event Handling:** * Utilized `$event.stopPropagation()` and `preventDefault()` to ensure nested button clicks don't trigger the accordion expansion.



---

## 7. Custom Directives & Pipes
* **StatusColorPipe:** Decoupled styling logic from the template by creating a pipe that returns Tailwind classes based on task status.
* **HoverShadowDirective:** Created a reusable attribute directive to apply "Hardware Accelerated" elevation effects on hover.

---

## 🛠️ Summary of Topics Covered
1.  **NestJS REST API** & JWT Security.
2.  **Angular Interceptors** & Guards.
3.  **Signals Architecture** (Writable, Computed, Effects).
4.  **Modern Component Communication** (input/output).
5.  **Performance Optimization** (OnPush, Virtual Scroll, trackBy).
6.  **UX Polish** (Debouncing, Accordions, Local Loaders).

---
