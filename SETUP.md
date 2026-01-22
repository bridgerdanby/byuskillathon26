# BuggyMart Setup Instructions

Follow these steps to get the demo running on your machine.

---

## Step 1: Install Node.js

Download and install Node.js (LTS version):

**Windows / Mac:**

1. Go to https://nodejs.org
2. Download the **LTS** version (recommended)
3. Run the installer, accept all defaults

**Linux (Ubuntu/Debian):**

```bash
sudo apt install nodejs
```

**Verify installation:**

```bash
node --version
# Should show v18.x.x or higher
```

---

## Step 2: Install pnpm

Open a terminal (Command Prompt, PowerShell, or Terminal) and run:

**Windows (PowerShell):**

```powershell
iwr https://get.pnpm.io/install.ps1 -useb | iex
```

**Mac / Linux:**

```bash
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

**Or if you already have npm:**

```bash
npm install -g pnpm
```

**Verify installation:**

```bash
pnpm --version
# Should show 8.x.x or higher
```

> **Note:** You may need to restart your terminal after installing pnpm.

---

## Step 3: Install Git (if needed)

**Windows:**

1. Download from https://git-scm.com/download/win
2. Run installer, accept defaults

**Mac:**

```bash
xcode-select --install
```

**Linux:**

```bash
sudo apt-get install git
```

---

## Step 4: Clone the Repository

```bash
git clone https://github.com/USERNAME/byuskillathon26.git
cd byuskillathon26
```

> Replace `USERNAME` with the actual GitHub username.

**Alternative: Download ZIP**

1. Go to the GitHub repo page
2. Click the green "Code" button
3. Click "Download ZIP"
4. Extract the ZIP file
5. Open a terminal in that folder

---

## Step 5: Install Dependencies

```bash
pnpm install
```

This will download all required packages. It may take 1-2 minutes.

---

## Step 6: Start the Application

```bash
pnpm start
```

Wait for the message:

```
** Angular Live Development Server is listening on localhost:4200 **
```

---

## Step 7: Open in Chrome

1. Open **Google Chrome** (required for this workshop)
2. Go to: **http://localhost:4200**
3. You should see the BuggyMart shopping app

---

## Step 8: Open Chrome DevTools

Use one of these methods:

- Press **F12**
- Press **Ctrl+Shift+I** (Windows/Linux) or **Cmd+Option+I** (Mac)
- Right-click anywhere on the page → "Inspect"

---

## Troubleshooting

### "pnpm: command not found"

- Restart your terminal after installing pnpm
- Try: `npm install -g pnpm`

### "ng: command not found"

- Run `pnpm install` again
- Use `pnpm start` instead of `ng serve`

### Port 4200 already in use

```bash
pnpm start -- --port 4300
```

Then open http://localhost:4300

### Permission errors (Mac/Linux)

```bash
sudo chown -R $(whoami) ~/.pnpm-store
```

### Node version too old

- Make sure you have Node.js 18 or higher
- Download latest LTS from https://nodejs.org

---

## Quick Reference

| Command        | What it does         |
| -------------- | -------------------- |
| `pnpm install` | Install dependencies |
| `pnpm start`   | Start the dev server |
| `Ctrl+C`       | Stop the server      |
| `F12`          | Open DevTools        |

---

## You're Ready!

Once you see the BuggyMart app in Chrome with DevTools open, you're all set for the workshop.

The app has **intentional bugs** that we'll find and fix using Chrome DevTools!
