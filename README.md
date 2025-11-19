# TaskFixerAI Chat Interface

A beautiful, responsive chat interface for embedding TaskFixerAI (Custom GPT by Creative Transformations Consulting) into the Lovable website.

## 🎯 Project Overview

This is a Next.js application designed to be deployed on Vercel and embedded via iframe into the client's Lovable website. It provides a seamless chat experience for interacting with TaskFixerAI without requiring users to have a ChatGPT account.

## ✨ Features

- **Modern, Responsive Design**: Inspired by mckaywrigley's chatbot-ui
- **Conversation History**: Sidebar showing all past conversations
- **Multiple Chats**: Create and switch between different conversations
- **Auto-Save**: Conversations persist in localStorage
- **Collapsible Sidebar**: Toggle sidebar on/off for more screen space
- **Mobile-Friendly**: Fully responsive from 300px to desktop widths
- **Iframe-Ready**: Configured to work seamlessly in iframes
- **Auto-Scroll**: Automatically scrolls to latest messages
- **Loading States**: Beautiful animated loading indicators
- **Mock Responses**: Currently using mock responses for UI testing
- **Delete Conversations**: Remove conversations with hover-to-show delete button

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Visit `http://localhost:3000` to see the chat interface.

### Build for Production

```bash
# Create production build
npm run build

# Start production server
npm start
```

## 📦 Deployment to Vercel

### Option 1: Via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

### Option 2: Via GitHub Integration

1. Push this code to a GitHub repository
2. Connect your GitHub repo to Vercel
3. Vercel will automatically deploy on every push

### Environment Variables

When ready to integrate the actual Custom GPT, add these to Vercel:

```env
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-4-turbo-preview
```

## 🔗 Embedding in Lovable

Once deployed to Vercel, your app is available at: `https://taskfixer.ai`

### Embed Code for Lovable

Add this to a Custom HTML block in Lovable:

```html
<iframe
  src="https://taskfixer.ai"
  width="100%"
  height="600px"
  style="border: none; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
  title="TaskFixerAI Chat"
></iframe>
```

### Responsive Iframe (Recommended)

For a better mobile experience:

```html
<div style="position: relative; width: 100%; padding-bottom: 75%; max-width: 800px; margin: 0 auto;">
  <iframe
    src="https://taskfixer.ai"
    style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: none; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);"
    title="TaskFixerAI Chat"
  ></iframe>
</div>
```

## 🔧 Customization

### Colors & Branding

Edit `/app/page.tsx` to customize:
- Brand colors (currently blue/indigo gradient)
- Logo/icon
- Header text
- Message bubble styling

### Mock Responses

Currently using mock responses at `app/page.tsx:40-45`. These will be replaced with actual Custom GPT integration.

## 📝 Next Steps (TODO)

- [ ] Integrate with client's existing Custom GPT
- [ ] Add OpenAI API key to Vercel environment
- [ ] Test with actual TaskFixerAI responses
- [ ] Add conversation history persistence (optional)
- [ ] Implement Memberstack + Stripe gating (if needed)

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (Serverless)
- **AI Integration**: Custom GPT (pending)

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🤝 Support

For questions or issues:
- Review the `CLAUDE.md` file for project context
- Check the Statement of Work PDF for requirements
- Contact Creative Transformations Consulting

## 📄 License

Proprietary - Creative Transformations Consulting

---

**Status**: Phase 2 (Proof of Concept) ✅
**Last Updated**: 2025-11-04
