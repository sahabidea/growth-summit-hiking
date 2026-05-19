# Project Guidelines & Memory

## Deployment & Git Push Rules
1. **Netlify Free Tier Limitations:** The project is deployed on Netlify using a free tier which has strict build and deployment limits.
2. **No Automatic Commits/Pushes:** Do NOT automatically run `git commit` or `git push` in short intervals. 
3. **Explicit Deployments Only:** Only push changes to the repository (which triggers a Netlify build) when the user EXPLICITLY requests a deployment. Group changes together in longer intervals to conserve build minutes.

## Known Infrastructure Issues
- **Netlify Edge Function Timeouts:** Due to the free tier and Next.js architecture, Edge functions (like `middleware.ts` which connects to Supabase) may occasionally crash or time out. This is a known limitation of running Next.js with Supabase on Netlify's free tier.
