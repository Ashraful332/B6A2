To use **TypeScript** in a **Node.js** project (as of 2025–2026), here are the most common and recommended approaches — from simplest/quickest to more production-oriented.

### 1. Fastest way (great for quick scripts / prototyping / 2025+ style)

Node.js v20.18+ / v22+ supports running **TypeScript** almost natively with flags (no build step needed for development).

```bash
# 1. Create project folder (if you haven't already)
mkdir my-ts-project
cd my-ts-project

# 2. Initialize npm project
npm init -y

# 3. Install TypeScript + Node types
npm install --save-dev typescript @types/node

# 4. (Optional but recommended) Create a minimal tsconfig.json
npx tsc --init --target ES2022 --module NodeNext --moduleResolution NodeNext
#   or even simpler minimal version:
echo '{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  }
}' > tsconfig.json
```

Now you can run TypeScript files **directly**:

```bash
# Option A — using built-in Node.js flag (cleanest, Node ≥22 recommended)
node --experimental-strip-types index.ts

# Option B — using excellent dev tool tsx (very popular in 2025)
npm install --save-dev tsx
npx tsx index.ts

# or add to package.json scripts:
# "dev": "tsx watch index.ts"
npm run dev
```

### 2. Classic / Most Common Setup (Build → dist folder) — still widely used

Especially good for production apps, Docker builds, etc.

```bash
# 1. Initialize project
mkdir my-api
cd my-api
npm init -y

# 2. Install core packages
npm install --save-dev typescript @types/node

# For Express example (optional)
npm install express
npm install --save-dev @types/express

# 3. Generate good starting tsconfig
npx tsc --init

# Recommended minimal tsconfig.json changes (edit compilerOptions):
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",           // or "nodenext"
    "moduleResolution": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

Folder structure example:

```
my-api/
├── src/
│   └── index.ts
├── tsconfig.json
├── package.json
└── node_modules/
```

`src/index.ts` example:

```ts
// src/index.ts
import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello TypeScript + Node.js!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
```

Add scripts to `package.json`:

```json
"type": "module",
"scripts": {
  "build": "tsc",
  "start": "node dist/index.js",
  "dev": "tsx watch src/index.ts"   // if you installed tsx
}
```

Run:

```bash
npm run build     # creates dist/ folder with .js files
npm start         # runs the built JS

# or just
npm run dev       # with tsx — no build needed
```

### Quick Summary Table — Choose Your Style (2025–2026)

| Style                        | Install command                              | Run command                          | Best for                     | Build step? |
|------------------------------|----------------------------------------------|--------------------------------------|------------------------------|-------------|
| Native Node flag             | `npm i -D typescript @types/node`            | `node --experimental-strip-types ...`| Quick scripts, tests         | No          |
| tsx (most popular dev tool)  | `npm i -D tsx typescript @types/node`       | `npx tsx` or `tsx watch`             | Fast dev, hot-reload         | No          |
| Classic tsc + build          | `npm i -D typescript @types/node`           | `tsc && node dist/index.js`          | Production, CI/CD, Docker    | Yes         |
| ts-node (older style)        | `npm i -D ts-node typescript @types/node`   | `npx ts-node`                        | Legacy projects              | No          |

**Most recommended right now (2025–2026)** → **tsx** for development + **tsc build** for production.

Let me know if you want:

- Express + TypeScript full boilerplate
- ESLint + Prettier setup
- Vitest / Jest testing setup
- ESM-only vs CommonJS decision
- Docker / deployment tips

Happy coding! 🚀