# OpenAI Assistant Configuration Guide

## Problem
When users ask off-topic questions (like "what's the weather?"), the chatbot hangs, freezes, or times out instead of politely declining.

## Solution
Update your OpenAI Assistant's system instructions to include clear boundaries and guidelines for handling off-topic requests.

## Steps to Update Your Assistant

1. **Log into OpenAI Platform**
   - Go to https://platform.openai.com/assistants
   - Find your TaskFixerAI assistant (ID: `${process.env.OPENAI_ASSISTANT_ID}`)

2. **Update the Instructions**

   Add the following to your assistant's instructions (at the beginning for priority):

   ```
   ## Scope and Boundaries

   You are TaskFixerAI, an educational assistant specifically designed to help teachers:
   - Redesign assignments to be cheat-resistant and higher-order
   - Create new educational tasks and projects
   - Analyze and improve existing assessments
   - Integrate responsible AI use into learning activities
   - Provide rubrics, reflections, and implementation tips

   ## Handling Off-Topic Questions

   If a user asks about topics OUTSIDE your expertise (weather, sports, general knowledge, entertainment, current events, etc.), respond politely:

   "I'm TaskFixerAI, specialized in helping educators design better assignments and assessments. I can help you with:

   - Redesigning assignments to be more rigorous and cheat-resistant
   - Creating new project ideas
   - Developing rubrics and assessment criteria
   - Integrating AI literacy into your curriculum
   - Analyzing student work

   How can I help you improve your teaching materials today?"

   ## Important Guidelines

   - DO NOT try to answer questions about current events, weather, sports, etc.
   - ALWAYS redirect users back to your core educational mission
   - Respond quickly with the above message when detecting off-topic questions
   - Use only your training data and uploaded files - no external searches
   ```

3. **Configure Tools**

   Your assistant should have:
   - ✅ **File Search** - Enabled (for analyzing uploaded assignments and documents)
   - ✅ **Code Interpreter** - Optional (only if needed for data analysis)
   - ❌ **Web Search** - REMOVED (to keep assistant focused on training data)

   **IMPORTANT**: Make sure the `web_search` function is NOT listed in your assistant's tools.
   The assistant should rely solely on:
   - Its training data (knowledge cutoff)
   - Files uploaded by users
   - Built-in educational expertise

4. **Test the Changes**

   After updating, test with these prompts:
   - ✅ "What's the weather in Bridgeport?" → Should politely decline
   - ✅ "Who won the game last night?" → Should politely decline
   - ✅ "Help me redesign this essay assignment" → Should engage fully
   - ✅ "Create a cheat-proof math project" → Should engage fully

## Additional Recommendations

### Model Selection
- Use GPT-4 or GPT-4 Turbo for best results
- Avoid GPT-3.5 if you need complex reasoning about educational content

### Response Format
- Enable "Code Interpreter" only if needed for data analysis
- Keep "File Search" enabled for analyzing uploaded assignments
- Set temperature to 0.7-0.8 for balanced creativity

### Timeout Prevention
- Keep instructions concise but clear
- Avoid overly complex decision trees
- The code now has 60-second timeout protection as a safety net

## Monitoring

After deployment, monitor for:
- Response times > 30 seconds
- Timeout errors in server logs
- User reports of freezing/hanging
- Off-topic questions that slip through

## Environment Variable

Ensure your `.env` file has:
```
OPENAI_ASSISTANT_ID=asst_your_assistant_id_here
OPENAI_API_KEY=sk-your_api_key_here
```

## Support

If issues persist:
1. Check server logs for timeout errors
2. Verify assistant configuration in OpenAI platform
3. Test with simple on-topic questions first
4. Gradually test edge cases
