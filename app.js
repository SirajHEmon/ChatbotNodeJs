const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

// Enable parsing of json bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Define the updated chat flow
const chatFlow = [
    { bot_message: "🌟 Hello and welcome to Model Scouters! I'm thrilled to guide you through the first steps of launching your modeling career. Let's start by getting to know a bit about you!", user_prompt: "First things first, what's your full name?" },
    { bot_message: "Great! Thank you for providing your name.", user_prompt: "How old are you? Just a number, please—anywhere from 3 to 99 works for us!" },
    { bot_message: "Thanks! How about your gender?", user_prompt: "What gender do you identify with? You can choose 'Female' or 'Male'." },
    { bot_message: "Got it! Now for contact details.", user_prompt: "What’s your email address? We'll use it to keep you updated with all the exciting opportunities." },
    { bot_message: "Thank you for the email address.", user_prompt: "Can I have your phone number? If you're under 18, please provide a parent’s number instead." },
    { bot_message: "Perfect! Let’s get your address details now.", user_prompt: "What’s your street address? We’d love to know where our future star lives!" },
    { bot_message: "Nice place!", user_prompt: "Which city do you call home?" },
    { bot_message: "Interesting!", user_prompt: "And what state is that in? Just pick from the dropdown list." },
    { bot_message: "Almost done!", user_prompt: "Lastly, your ZIP code would help us a lot." },
    { bot_message: "Last step!", user_prompt: "Now, let's see your star potential! Please upload a clear photo of yourself—just make sure it’s without any filters or emojis." },
    { bot_message: "Thank you for sharing your photo!", user_prompt: "Just to be clear, Model Scouters isn’t a modeling agency but a launchpad to your modeling career. Type 'Yes' if you understand and are excited to proceed!" }
];

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

app.post('/chat', upload.single('photo'), (req, res) => {
    const step = parseInt(req.body.step || "0");
    let response = {};

    if (req.file) {
        // When a photo is uploaded, move to the last step confirmation.
        response = chatFlow[10];
    } else if (step < chatFlow.length) {
        response = chatFlow[step];
    } else {
        response = { bot_message: "Thank you for all your information!", user_prompt: null };
    }

    res.json(response);
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});