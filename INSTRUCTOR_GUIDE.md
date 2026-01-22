# BuggyMart Angular - Chrome DevTools Skillathon Instructor Guide

## Overview

This Angular application contains **9 intentional bugs** designed to teach students how to use Chrome DevTools effectively. The bugs are organized into two sections:

- **Inspector (Elements Panel):** 4 CSS bugs (#1-3 required, #4 optional)
- **Debugger (Sources Panel):** 5 JavaScript bugs (#5-9), each showcasing a different debugger feature

**Estimated Time:** 30 minutes
**Prerequisites:** Basic HTML/CSS/JavaScript/TypeScript knowledge
**Framework:** Angular 17 (Standalone Components)

---

## Quick Setup

```bash
# Install dependencies
pnpm install

# Start development server
pnpm start

# Open in browser
# http://localhost:4200
```

Then open Chrome DevTools with `F12` or `Cmd+Option+I` (Mac) / `Ctrl+Shift+I` (Windows)

---

## Part 1: Elements/Inspector Panel (15 min)

### Bug #1: Cart Count Badge Hidden

**Component:** `header.component.css`
**Symptom:** The red cart count badge doesn't appear when items are added.

**How to Find:**

1. Add an item to cart
2. Open Elements panel
3. Find the `.cart-count` element in the header
4. Look at Computed styles - notice `z-index: -1`

**How to Fix:**

```css
/* Change z-index from -1 to 1 */
.cart-count {
  z-index: 1;
}
```

---

### Bug #2: Search Button Wrong Color

**Component:** `search.component.css`
**Symptom:** The search button appears gray instead of purple.

**How to Find:**

1. Select the Search button in Elements panel
2. Look at Styles pane - notice there are TWO rules for `.btn`
3. See that `.search-section button.btn.search-btn` has higher specificity

**Teaching Point:** Explain CSS specificity! The strikethrough shows which rules are overridden.

**How to Fix:**

```css
/* Delete or change the color in this rule */
.search-section button.btn.search-btn {
  background-color: #667eea; /* Change from #cccccc */
}
```

---

### Bug #3: Products Don't Wrap (Flexbox Bug)

**Component:** `products-grid.component.css`
**Symptom:** Products scroll horizontally instead of wrapping to new rows.

**How to Find:**

1. Inspect the `.products-grid` container
2. Look at the `display: flex` styles
3. Notice `flex-wrap: nowrap`

**Teaching Point:** Show the Flexbox visualizer in DevTools!

**How to Fix:**

```css
.products-grid {
  flex-wrap: wrap; /* Change from nowrap */
}
```

---

### Bug #4 (Optional): Success Toast is Invisible

**Component:** `success-toast.component.css`
**Symptom:** When adding items to cart, the toast notification doesn't appear.

**How to Find:**

1. Add an item to cart
2. Quickly inspect the `.success-toast` element
3. Notice it has class `visible` but still invisible
4. Check computed styles - `opacity: 0`

**How to Fix:**

```css
.success-toast.visible {
  display: flex;
  opacity: 1; /* ADD THIS LINE */
}
```

---

## Part 2: Sources/Debugger Panel (15 min)

Each bug in this section is designed to showcase a **specific Chrome Debugger feature** that has significant advantages over `console.log` statements.

---

### Bug #5: First Product Missing (Conditional Breakpoints)

**Service:** `product.service.ts` - `getFilteredProductList()` method
**Symptom:** The first product (Wireless Headphones) never appears in the grid.
**Debugger Feature:** **Conditional Breakpoints**

**Why Conditional Breakpoints?**
The loop processes 12 products. Stepping through each iteration is tedious. A conditional breakpoint lets you pause only when a specific condition is true.

**How to Find:**

1. Open Sources panel - find `product.service.ts`
2. Find the `for` loop in `getFilteredProductList()`
3. Right-click the line number inside the loop - select "Add conditional breakpoint"
4. Enter condition: `i === 0`
5. Refresh the page
6. **The breakpoint never triggers!** This proves `i` never equals 0

**Teaching Point:** The loop starts at `i = 1` instead of `i = 0`, skipping the first product.

**How to Fix:**

```typescript
// Change the loop initialization
for (let i = 0; i < sourceProducts.length; i++) {
```

---

### Bug #6: Cart Total Shows Wrong Value (Watch Expressions)

**Service:** `cart.service.ts` - `calculateTotal()` method
**Symptom:** Cart total displays incorrectly (shows first price only, or NaN).
**Debugger Feature:** **Watch Expressions**

**Why Watch Expressions?**
You need to monitor the `typeof total` as it changes through iterations. Watch expressions let you track multiple values simultaneously without modifying code.

**How to Find:**

1. Add 2-3 items to cart
2. Open Sources panel - find `cart.service.ts`
3. Set a breakpoint inside the `for` loop in `calculateTotal()`
4. In the Watch panel, add these expressions:
   - `typeof total`
   - `total`
   - `item.price * item.quantity`
5. Step through the loop and watch the values

**Teaching Point:** `total` starts as an empty string `""`. When you do `"" + 79.99`, JavaScript concatenates instead of adding! Watch `typeof total` show "string" instead of "number".

**How to Fix:**

```typescript
// Change initialization from string to number
let total: number = 0;
```

---

### Bug #7: Coupon Gives Wrong Discount (Call Stack Navigation)

**Service:** `coupon.service.ts` - `validateCoupon()` method
**Symptom:** "SAVE10" coupon applies 9% discount instead of 10%.
**Debugger Feature:** **Call Stack Navigation**

**Why Call Stack?**
The discount passes through multiple functions. The call stack lets you trace the value through each function call and find exactly where it gets corrupted.

**How to Find:**

1. Add items to cart, open checkout modal
2. Set a breakpoint at the start of `validateCoupon()`
3. Enter coupon "SAVE10" and click Apply
4. Use the **Call Stack** panel to trace the flow:
   - `validateCoupon()` - baseDiscount = 10 (correct)
   - `processDiscount()` - passes through
   - `applyFees()` - **returns amount - 1!**
5. Click each frame in the call stack to inspect variables at that level

**Teaching Point:** The bug is buried in a nested helper function. Call stack navigation reveals the exact function corrupting the value.

**How to Fix:**

```typescript
// In applyFees(), remove the subtraction
private applyFees(amount: number): number {
  return amount; // Was: return amount - 1;
}
```

---

### Bug #8: User Profile Crashes (Exception Breakpoints)

**Component:** `debug-panel.component.ts` - `triggerExceptionError()` method
**Symptom:** Clicking "Load User Profile" crashes with TypeError.
**Debugger Feature:** **Exception Breakpoints (Pause on Exceptions)**

**Why Exception Breakpoints?**
Instead of guessing where an error occurs or adding try/catch everywhere, enable "Pause on uncaught exceptions" to stop exactly at the crash point.

**How to Find:**

1. Open Sources panel
2. In the Breakpoints section, check **"Pause on uncaught exceptions"**
3. Click the "Load User Profile" button in the Debug Panel
4. DevTools pauses exactly on the line: `userData.profile.settings.displayName`
5. Hover over `userData` to see it has no `profile` property

**Teaching Point:** The debugger shows you the exact line AND lets you inspect the object state at crash time.

**How to Fix:**

```typescript
// Add optional chaining or null checks
const userName = userData?.profile?.settings?.displayName ?? 'Guest';
```

---

### Bug #9: Data Fetch Race Condition (Logpoints)

**Component:** `debug-panel.component.ts` - `triggerRaceCondition()` method
**Symptom:** Clicking "Fetch User Data" always shows "Error: Data not ready yet!"
**Debugger Feature:** **Logpoints**

**Why Logpoints?**
This is a **race condition**. If you set a normal breakpoint and pause, you give the async operation time to complete - the bug disappears! Logpoints let you observe without affecting timing.

**How to Find:**

1. **First, try a regular breakpoint** (to show it masks the bug):
   - Set breakpoint on the `if (this.dataReady)` line
   - Click "Fetch User Data"
   - While paused, the async operation completes
   - Continue - it works! (Bug hidden)

2. **Now use Logpoints:**
   - Remove the breakpoint
   - Right-click the line number - select "Add logpoint"
   - Enter: `dataReady = ${this.dataReady}`
   - Add another logpoint in `loadDataAsync()` after the setTimeout callback: `async complete, dataReady = ${this.dataReady}`
   - Click "Fetch User Data"
   - Check Console - you'll see `dataReady = false` happens BEFORE the async completes

**Teaching Point:** Race conditions are timing-sensitive. Regular breakpoints change timing. Logpoints observe without interfering.

**How to Fix:**

```typescript
// Move the check inside the async callback (see triggerRaceConditionFixed)
triggerRaceCondition(): void {
  this.loadDataAsync();
  // Check should happen AFTER data loads, not immediately
}
```

---

## Bug Summary Table

| # | Bug | DevTools Feature | Location | Difficulty |
|---|-----|------------------|----------|------------|
| 1 | Cart count z-index | Elements - Computed Styles | header.component.css | Easy |
| 2 | Button specificity | Elements - Styles (specificity) | search.component.css | Medium |
| 3 | Flexbox nowrap | Elements - Flexbox inspector | products-grid.component.css | Easy |
| 4 | Toast opacity (Optional) | Elements - Computed Styles | success-toast.component.css | Medium |
| 5 | Loop off-by-one | **Conditional Breakpoints** | product.service.ts | Medium |
| 6 | String concat total | **Watch Expressions** | cart.service.ts | Hard |
| 7 | Coupon calculation | **Call Stack Navigation** | coupon.service.ts | Medium |
| 8 | Undefined property | **Exception Breakpoints** | debug-panel.component.ts | Easy |
| 9 | Race condition | **Logpoints** | debug-panel.component.ts | Hard |

---

## Debugger Features Summary

| Feature | When to Use | Advantage over console.log |
|---------|-------------|---------------------------|
| **Conditional Breakpoints** | Loops, frequent function calls | Pause only on specific conditions without stepping through hundreds of iterations |
| **Watch Expressions** | Tracking values over time | Monitor multiple expressions simultaneously, persists across debugging sessions |
| **Call Stack** | Multi-function flows | See entire execution path, inspect variables at any level |
| **Exception Breakpoints** | Crashes, errors | Find exact crash location without try/catch or guessing |
| **Logpoints** | Timing-sensitive bugs, race conditions | Observe without affecting execution timing |

---

## Console Tips for Angular

```javascript
// Access services (exposed on window)
window.buggyMart.cartService.getCartItemsSnapshot()
window.buggyMart.productService

// Pretty print arrays
console.table(window.buggyMart.cartService.getCartItemsSnapshot())

// Check valid coupons
window.buggyMartCoupons
```

---

## Recommended Presentation Flow

1. **Intro (2 min)**: Show the app, demonstrate it's broken
2. **Elements Panel (10 min)**: Fix bugs #1, #2, #3 (most visual)
3. **Debugger Panel (15 min)**:
   - Bug #5: Conditional Breakpoints
   - Bug #6: Watch Expressions
   - Bug #8: Exception Breakpoints (quick demo)
   - Bug #9: Logpoints (race condition - most impressive)
4. **Q&A / Free exploration (3 min)**

---

## Key Teaching Points

1. **Conditional Breakpoints** - "Don't step through 100 iterations, let DevTools find the interesting one"
2. **Watch Expressions** - "See types change in real-time without adding console.log everywhere"
3. **Call Stack** - "Find where your data got corrupted by walking back through the execution"
4. **Exception Breakpoints** - "Let DevTools catch errors for you"
5. **Logpoints** - "When breakpoints change the behavior, use logpoints to observe without interfering"

Good luck with your presentation!
