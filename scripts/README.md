# Multi-Agent Email Scripts

Quick reference for testing and previewing generated emails.

## 🧪 Test Multi-Agent System

Test the multi-agent email generation with 5 different prompts:

```bash
npm run test:multi-agent
# or
npx tsx scripts/test-multi-agent.ts
```

**What it does:**
- Generates 5 different email types
- Shows cost and time for each
- Saves TSX files to `emails/generated/`
- Displays success rate and averages

**Expected results:**
- Cost: ~$0.0034 per email
- Time: 60-90 seconds per email
- Success rate: 100%

---

## 🎨 Preview Generated Emails

Render and view generated emails in your browser:

```bash
# Preview most recent email
npm run preview:email

# Preview specific email
npm run preview:email Email_1765894863775_welcome_email.tsx

# or use directly
npx tsx scripts/render-and-preview.ts
npx tsx scripts/render-and-preview.ts [filename]
```

**What it does:**
- Uses React Email renderer to convert TSX → HTML
- Wraps in a beautiful preview page
- Opens automatically in your browser
- Saves HTML to `emails/previews/`

**Preview features:**
- Shows email metadata (date, size, system)
- Email-accurate viewport (600px)
- Beautiful gradient wrapper
- Responsive design

---

## 📁 File Locations

```
joltibase-platform/
├── emails/
│   ├── generated/          # TSX files from multi-agent
│   │   └── Email_*.tsx
│   └── previews/           # Rendered HTML previews
│       └── Email_*.html
└── scripts/
    ├── test-multi-agent.ts     # Test suite
    └── render-and-preview.ts   # Preview generator
```

---

## 🚀 Quick Workflow

```bash
# 1. Generate test emails
npm run test:multi-agent

# 2. Preview the latest one
npm run preview:latest

# 3. Preview a specific one
npm run preview:email Email_1234567890_newsletter.tsx
```

---

## 💡 Tips

**View all generated emails:**
```bash
ls -lt emails/generated/
```

**Clean up old files:**
```bash
rm emails/generated/Email_*.tsx
rm emails/previews/Email_*.html
```

**Use React Email dev server** (alternative to preview script):
```bash
npx react-email dev
# Opens http://localhost:3000
# Browse to emails/generated/ folder
```

**Check costs:**
The test script shows detailed cost breakdown. Average per email:
- Layout Agent: $0.0011
- Content Agent: $0.0007  
- Code Agent: $0.0014
- **Total: ~$0.0034**

---

## 🐛 Troubleshooting

**"No generated emails found"**
- Run `npm run test:multi-agent` first

**"API key error"**
- Check `.env.local` has `GOOGLE_GENERATIVE_AI_API_KEY`
- Key should start with `AIza...`

**"Render failed"**
- Check TSX file exists in `emails/generated/`
- Try running React Email dev server as alternative

**Browser doesn't open**
- Preview script will show file path
- Open manually: `open emails/previews/Email_*.html`

---

## 📊 Example Output

```
🚀 Multi-Agent Email Preview Generator
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📨 Found 5 generated email(s):

  1. Email_1765894863775_welcome_email.tsx
     📅 12/16/2024, 2:07:43 PM
     📦 8.8 KB

📧 Rendering most recent: Email_1765894863775_welcome_email.tsx

🎨 Rendering Email_1765894863775_welcome_email.tsx...
✅ Rendered successfully!
📂 Saved to: emails/previews/Email_1765894863775_welcome_email.html
🌐 Opened in browser!

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Done! Email preview opened in browser
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## 🎯 Next Steps

Once you're happy with the results:

1. **Enable in production:**
   ```bash
   # In .env.local or .env.production
   USE_MULTI_AGENT=true
   ```

2. **Test via UI:**
   - Go to your dashboard
   - Generate an email
   - It will use the multi-agent system

3. **Monitor costs:**
   - Check the logs for actual token usage
   - Compare with estimates
   - Adjust if needed

Happy email generating! 🚀


