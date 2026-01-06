# BuggyMart Angular - Chrome DevTools Skillathon Instructor Guide

## Overview
This Angular application contains **13 intentional bugs** designed to teach students how to use Chrome DevTools effectively. The bugs are categorized by which DevTools panel is best suited to find and fix them.

**Estimated Time:** 30 minutes
**Prerequisites:** Basic HTML/CSS/JavaScript/TypeScript knowledge
**Framework:** Angular 17 (Standalone Components)

---

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── header/              # Header with cart icon (Bug #1)
│   │   ├── search/              # Search input (Bug #2)
│   │   ├── filter/              # Category filter buttons
│   │   ├── product-card/        # Individual product display
│   │   ├── products-grid/       # Product grid layout (Bug #3)
│   │   ├── cart-item/           # Cart item display
│   │   ├── cart-sidebar/        # Sliding cart panel
│   │   ├── checkout-modal/      # Checkout form (Bug #4, #9)
│   │   ├── success-toast/       # Notification toast (Bug #5)
│   │   └── debug-panel/         # Debug buttons (Bugs #10-13)
│   ├── services/
│   │   ├── product.service.ts   # Product data (Bugs #6, #7, #10, #11)
│   │   ├── cart.service.ts      # Cart state (Bug #8)
│   │   ├── coupon.service.ts    # Coupon validation (Bug #9)
│   │   └── toast.service.ts     # Toast notifications
│   ├── models/
│   │   ├── product.model.ts     # Product interfaces
│   │   └── cart.model.ts        # Cart interfaces
│   ├── app.component.ts         # Root component
│   └── app.config.ts            # App configuration
└── styles.css                   # Global styles
```

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

> **Note:** This project uses pnpm. If you don't have it installed: `npm install -g pnpm`

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
4. Look at Computed styles → Notice `z-index: -1`

**How to Fix:**
```css
/* File: src/app/components/header/header.component.css:34 */
/* Change from */
z-index: -1;
/* To */
z-index: 1;
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
/* File: src/app/components/search/search.component.css:42-44 */
/* Delete or modify this rule */
.search-section button.btn.search-btn {
    background-color: #cccccc;
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
/* File: src/app/components/products-grid/products-grid.component.css:14 */
/* Change from */
flex-wrap: nowrap;
/* To */
flex-wrap: wrap;
```

---

### Bug #4: Modal Appears Behind Cart Sidebar
**Component:** `checkout-modal.component.css`
**Symptom:** When checkout modal opens with cart sidebar open, modal appears behind sidebar.

**How to Find:**
1. Add items to cart, open cart sidebar
2. Click "Checkout" button
3. Modal appears behind the sidebar
4. Inspect both elements, compare `z-index` values (modal: 500, sidebar: 1000)

**Teaching Point:** Demonstrate z-index stacking contexts!

**How to Fix:**
```css
/* File: src/app/components/checkout-modal/checkout-modal.component.css:10 */
/* Change from */
z-index: 500;
/* To */
z-index: 2000;
```

---

### Bug #5: Success Toast is Invisible
**Component:** `success-toast.component.css`
**Symptom:** When adding items to cart, the toast notification doesn't appear.

**How to Find:**
1. Add an item to cart
2. Quickly inspect the `.success-toast` element
3. Notice it has class `visible` but still invisible
4. Check computed styles → `opacity: 0`

**Teaching Point:** Show how to force element state and find conflicting styles.

**How to Fix:**
```css
/* File: src/app/components/success-toast/success-toast.component.css:18-20 */
.success-toast.visible {
  display: flex;
  opacity: 1;  /* ADD THIS LINE */
}
```

---

## Part 2: Sources/Debugger Panel (10 min)

### Bug #6: First Product Missing (Off-by-One Error)
**Service:** `product.service.ts`
**Symptom:** The first product (Wireless Headphones) never appears in the grid.

**How to Find:**
1. Open Sources panel → `src/app/services/product.service.ts`
2. Find `getFilteredProductList` method (line ~52)
3. Set a breakpoint on the `for` loop
4. Refresh and step through - notice `i` starts at 1

**Teaching Point:** Classic off-by-one error! Show watch expressions for `i` and `sourceProducts[i]`.

**How to Fix:**
```typescript
// File: src/app/services/product.service.ts:57
// Change from
for (let i = 1; i <= sourceProducts.length; i++) {
// To
for (let i = 0; i < sourceProducts.length; i++) {
```

---

### Bug #7: Search Only Finds Exact Matches
**Service:** `product.service.ts`
**Symptom:** Searching "headphones" returns nothing, but "Wireless Headphones" works.

**How to Find:**
1. Set breakpoint in `searchProducts` method (line ~76)
2. Search for "laptop"
3. Step through and watch the filter condition
4. Notice it uses `==` (equality) instead of `.includes()`

**Teaching Point:** Show difference between `==`, `===`, and string methods.

**How to Fix:**
```typescript
// File: src/app/services/product.service.ts:80
// Change from
return product.name.toLowerCase() == searchTerm;
// To
return product.name.toLowerCase().includes(searchTerm);
```

---

### Bug #8: Cart Total Shows NaN or Wrong Value
**Service:** `cart.service.ts`
**Symptom:** Cart total displays incorrectly (NaN or concatenated numbers).

**How to Find:**
1. Add several items to cart
2. Open Console, type `window.buggyMartCart.calculateTotal()`
3. Set breakpoint in `calculateTotal()` method
4. Watch the `total` variable - it's a string!

**Teaching Point:** Type coercion in JavaScript/TypeScript. Show the type of `total` in debugger.

**How to Fix:**
```typescript
// File: src/app/services/cart.service.ts:78
// Change from
let total: any = '';
// To
let total: number = 0;
```

---

### Bug #9: Coupon Gives Wrong Discount
**Service:** `coupon.service.ts`
**Symptom:** "SAVE10" coupon applies 9% discount instead of 10%.

**How to Find:**
1. Add items to cart, go to checkout
2. Enter coupon "SAVE10"
3. Set breakpoint in `validateCoupon()` method
4. Watch the discount calculation

**Teaching Point:** Simple arithmetic bug. Shows value of stepping through code.

**How to Fix:**
```typescript
// File: src/app/services/coupon.service.ts:40
// Change from
const discount = this.validCoupons[normalizedCode] - 1;
// To
const discount = this.validCoupons[normalizedCode];
```

---

### Bug #12: triggerConsoleError Crashes
**Component:** `debug-panel.component.ts`
**Symptom:** Clicking "Trigger Console Error" crashes with TypeError.

**How to Find:**
1. Click "Trigger Console Error" button
2. See error in Console
3. Click the error location link to jump to source
4. Or enable "Pause on exceptions" in Sources

**Teaching Point:** How to read stack traces and use "Pause on Exceptions"!

**How to Fix:**
```typescript
// File: src/app/components/debug-panel/debug-panel.component.ts:28
// Add null check
if (obj.details?.nested?.value) {
    console.log('Nested value:', obj.details.nested.value);
} else {
    console.log('Object structure:', obj);
}
```

---

### Bug #13: Slow Operation Shows "pending"
**Component:** `debug-panel.component.ts`
**Symptom:** Clicking "Slow Operation" immediately shows "pending" instead of waiting.

**How to Find:**
1. Click "Slow Operation"
2. Result shows "pending" immediately
3. Set breakpoint and step through
4. Notice the sync/async timing issue

**Teaching Point:** Async JavaScript! The code doesn't wait for setTimeout.

**How to Fix:**
```typescript
// File: src/app/components/debug-panel/debug-panel.component.ts:49-61
slowOperation(): void {
    this.debugOutput = 'Starting slow operation...';

    setTimeout(() => {
        const result = 'completed';
        this.debugOutput = `Operation result: ${result}`;
        console.log('Operation finished, result:', result);
    }, 2000);
}
```

---

## Part 3: Network Panel (5 min)

### Bug #10 & #11: Failed API Request
**Service:** `product.service.ts`
**Symptom:** Clicking "Fetch External Data" silently fails.

**How to Find:**
1. Open Network panel (filter by XHR/Fetch)
2. Click "Fetch External Data" button
3. See the failed request (red) in Network panel
4. Click it to see: wrong URL, 404 status
5. Notice NO error shown to user (missing error handler)

**Teaching Point:**
- How to read Network panel (Status codes, Headers, Response)
- Why error handling matters in Angular Observables

**How to Fix:**
```typescript
// File: src/app/services/product.service.ts:89-91
fetchExternalData(): Observable<any> {
    return this.http.get('https://jsonplaceholder.typicode.com/posts/1')
        .pipe(
            catchError(error => {
                console.error('Fetch failed:', error);
                return of({ error: 'Failed to fetch data' });
            })
        );
}

// Also update debug-panel.component.ts to handle errors
this.productService.fetchExternalData().subscribe({
    next: (data) => {
        this.debugOutput = 'Data received: ' + JSON.stringify(data, null, 2);
    },
    error: (err) => {
        this.debugOutput = 'Error: ' + err.message;
    }
});
```

---

## Bug Summary Table

| # | Bug | Panel | Component/Service | Difficulty |
|---|-----|-------|-------------------|------------|
| 1 | Cart count z-index | Elements | header.component.css:34 | Easy |
| 2 | Button specificity | Elements | search.component.css:42 | Medium |
| 3 | Flexbox nowrap | Elements | products-grid.component.css:14 | Easy |
| 4 | Modal z-index | Elements | checkout-modal.component.css:10 | Easy |
| 5 | Toast opacity | Elements | success-toast.component.css:18 | Medium |
| 6 | Loop off-by-one | Debugger | product.service.ts:57 | Medium |
| 7 | String == vs includes | Debugger | product.service.ts:80 | Medium |
| 8 | String concat total | Debugger | cart.service.ts:78 | Hard |
| 9 | Coupon calculation | Debugger | coupon.service.ts:40 | Easy |
| 10 | Wrong API endpoint | Network | product.service.ts:89 | Easy |
| 11 | Missing catchError | Network | product.service.ts:91 | Medium |
| 12 | Undefined property | Console | debug-panel.component.ts:28 | Easy |
| 13 | Async timing | Debugger | debug-panel.component.ts:49 | Hard |

---

## Angular-Specific DevTools Tips

### Component Explorer
- Use Angular DevTools extension for component inspection
- View component inputs/outputs in real-time
- Profile change detection cycles

### Source Maps
- Angular's source maps let you debug TypeScript directly
- Set breakpoints in `.ts` files, not compiled `.js`
- Use "Webpack://" in Sources panel to find original source

### RxJS Debugging
- Log Observable values with `tap()` operator
- Use `console.log` in `subscribe()` callbacks
- Check for unsubscribed subscriptions (memory leaks)

### Console Tips for Angular
```javascript
// Access services (we exposed them on window)
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
2. **Elements Panel (12 min)**: Fix bugs #1, #2, #5 (most visual)
3. **Debugger Panel (10 min)**: Fix bugs #6, #8 (most educational)
4. **Network Panel (4 min)**: Show bugs #10, #11
5. **Q&A / Free exploration (2 min)**

---

## Bonus: Let Students Find More

Challenge students to find other issues:
- Why does the cart count not update immediately sometimes?
- What happens with invalid email in checkout form?
- Can you find any accessibility issues?

Good luck with your presentation!
