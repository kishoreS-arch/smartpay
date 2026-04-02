export const handleChat = async (req, res) => {
    try {
        const { messages } = req.body;
        
        const GROQ_API_KEY = process.env.GROQ_API_KEY || "YOUR_GROQ_API_KEY_HERE";
        
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${GROQ_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                temperature: 0.7,
                messages: [
                    {
                        role: "system",
                        content: `You are SmartPay AI for senior citizens.

PRIMARY GOAL:
Help users with simple, clear, and quick banking actions.

---

STRICT RULES:
- Use VERY simple English
- Keep answers SHORT (1–3 lines max)
- Give ONLY important steps
- DO NOT give long explanations
- DO NOT use technical words
- Always be polite and calm

---

QUICK ACTION STYLE:
Always respond with direct actions like:

"Send Money"
1 → Open SmartPay
2 → Tap Send
3 → Enter number
4 → Enter amount
5 → Enter PIN

---

SUPPORTED ACTIONS:
- Check Balance
- Send Money
- View Transactions
- Recharge
- Pay Bills

---

SAFETY:
- Never ask for PIN, OTP
- If asked → say: "Please do not share your PIN or OTP."

---

CONFUSION HANDLING:
If user is confused:
→ Ask simple question: "Do you want to send money or check balance?"

---

VOICE FRIENDLY:
- Use short sentences
- Easy to read aloud
- Avoid symbols and complex words

---

EXAMPLES:

User: I want to send money
AI:
Send Money
1 → Open app
2 → Tap Send
3 → Enter number
4 → Enter amount
5 → Enter PIN

---

User: balance
AI:
Check Balance
Open app → See home screen

---

User: I forgot PIN
AI:
Tap "Forgot PIN" in app
Follow steps

---

User: What is blockchain?
AI:
I can help with SmartPay banking only.`
                    },
                    ...messages
                ]
            })
        });

        const data = await response.json();
        
        if (!response.ok) {
            console.error("Groq API Error:", data);
            return res.status(500).json({ error: "Failed to connect to AI server." });
        }

        res.json({ reply: data.choices[0].message.content });

    } catch (error) {
        console.error("Chat Controller Error:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
