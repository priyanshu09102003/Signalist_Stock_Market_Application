import { getNews } from "../actions/finnhub.actions";
import { getAllUsersForNewsEmail } from "../actions/users.actions";
import { getWatchlistSymbolsByEmail } from "../actions/watchlist.actions";
import { sendNewsSummaryEmail, sendWelcomeEmail } from "../nodemailer";
import { getFormattedTodayDate } from "../utils";
import { inngest } from "./client";
import { NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT } from "./prompts";
import { GoogleGenAI } from "@google/genai";

export const sendSignUpEmail = inngest.createFunction(
    { 
        id: 'sign-up-email',
        retries: 3,
    },
    { event: 'app/user.created' },
    async ({ event, step }) => {
        // Add initial delay to avoid rate limits when multiple signups happen quickly
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
        
        const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `;

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile);

        // Generate personalized intro with retry logic using Google GenAI SDK
        const introText = await step.run('generate-welcome-intro', async () => {
            const maxRetries = 1; // Reduced retries to avoid rate limit spam
            let lastError;

            for (let i = 0; i < maxRetries; i++) {
                try {
                    // Initialize the Google GenAI client
                    const ai = new GoogleGenAI({
                        apiKey: process.env.GEMINI_API_KEY
                    });

                    // Generate content using the SDK
                    const response = await ai.models.generateContent({
                        model: "gemini-2.5-flash",
                        contents: prompt,
                    });

                    const generatedText = response.text;

                    if (!generatedText) {
                        throw new Error('No text generated from Gemini API');
                    }

                    // Clean up the response - remove any markdown artifacts
                    let cleanedText = generatedText.trim();
                    
                    // Remove markdown code blocks if present
                    cleanedText = cleanedText.replace(/```html\n?/g, '');
                    cleanedText = cleanedText.replace(/```\n?/g, '');
                    
                    // Remove any extra whitespace
                    cleanedText = cleanedText.trim();

                    return cleanedText;

                } catch (error) {
                    lastError = error;
                    console.error(`Attempt ${i + 1} failed:`, error);

                    // If rate limited, wait with exponential backoff
                    if (i < maxRetries - 1) {
                        const waitTime = Math.pow(2, i) * 5000; // 5s, 10s, 20s
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    }
                }
            }

            // Fallback if all retries fail - still sends email!
            console.error('All Gemini retries failed, using fallback text:', lastError);
            return '<p class="mobile-text" style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #CCDADC;">Thanks for joining Signalist! You now have the tools to track the market and make smarter investment decisions. Let\'s get started on your investing journey together.</p>';
        });

        // Send the welcome email
        await step.run('send-welcome-email', async () => {
            const { data: { email, name } } = event;
            return await sendWelcomeEmail({
                email, 
                name, 
                intro: introText
            });
        });

        return {
            success: true,
            message: 'Welcome email sent successfully'
        };
    }
);


export const sendDailyNewsSummary = inngest.createFunction(
    {id: 'daily-news-summary'},
    [{event: 'app/send.daily.news'}, {cron: '0 12 * * *'}],
    
    async ({step}) => {
        //Step 1: Get all users for news delivery
        const users = await step.run('get-all-users', getAllUsersForNewsEmail)

        if(!users || users.length === 0)
            return{success: false, message: 'No users found for news email'}


        //Step 2: Fetch personalized news for each user

            const results = await step.run('fetch-user-news', async () => {
            const perUser: Array<{ user: UserForNewsEmail; articles: MarketNewsArticle[] }> = [];
            for (const user of users as UserForNewsEmail[]) {
                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols);
                    // Enforce max 6 articles per user
                    articles = (articles || []).slice(0, 6);
                    // If still empty, fallback to general
                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                        articles = (articles || []).slice(0, 6);
                    }
                    perUser.push({ user, articles });
                } catch (e) {
                    console.error('daily-news: error preparing user news', user.email, e);
                    perUser.push({ user, articles: [] });
                }
            }
            return perUser;
        });



        //Step 3: Summarize these news via AI for each user

         const userNewsSummaries: { user: UserForNewsEmail; newsContent: string | null }[] = [];

        for (const { user, articles } of results) {
                try {
                    const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace('{{newsData}}', JSON.stringify(articles, null, 2));

                    const response = await step.ai.infer(`summarize-news-${user.email}`, {
                        model: step.ai.models.gemini({ model: 'gemini-2.5-flash' }),
                        body: {
                            contents: [{ role: 'user', parts: [{ text:prompt }]}]
                        }
                    });

                    const part = response.candidates?.[0]?.content?.parts?.[0];
                    const newsContent = (part && 'text' in part ? part.text : null) || 'No market news.'

                    userNewsSummaries.push({ user, newsContent });
                } catch (e) {
                    console.error('Failed to summarize news for : ', user.email);
                    userNewsSummaries.push({ user, newsContent: null });
                }
            }

        //Step 4: Send out the emails

          await step.run('send-news-emails', async () => {
                await Promise.all(
                    userNewsSummaries.map(async ({ user, newsContent}) => {
                        if(!newsContent) return false;

                        return await sendNewsSummaryEmail({ email: user.email, date: getFormattedTodayDate(), newsContent })
                    })
                )
            })

        return { success: true, message: 'Daily news summary emails sent successfully' }
    }
)