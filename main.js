const sendChatBtn = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn = document.querySelector(".close-btn");

let userMessage;
let API_KEY = "AIzaSyCjtxkmCiz_7Qu3O5Kw_LBqeNS7PLpJJdE";

const createChatli = (message , className) => {
    const chatLi = document.createElement("LI");
    chatLi.className = `chat ${className}`;  
    let chatContent = className === "outgoing" ? `<p></p>` : `<span class="material-symbols-outlined">smart_toy</span><p></p>`
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
}

const generateResponse = (incomingChatLi) => {
    const API_URL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
    const messageElement = incomingChatLi.querySelector("p");

    const requestOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
        },
        body : JSON.stringify({ contents: [{ role: "user", parts: [{ text: userMessage }] }] }), 
        // body: JSON.stringify({
        //     model: "gpt-3.5-turbo",
        //     messages: [{role: "user", content: userMessage}],
        // })
    }
    fetch(API_URL , requestOptions).then(res => res.json()).then(data =>{
        messageElement.textContent = data.candidates[0].content.parts[0].text;
        // messageElement.textContent = data.choices[0].message.content;
    }).catch((error) => {
        messageElement.textContent = "Oops! something went wrong. please try again."  
    }).finally(() => chatbox.scrollTo(0 , chatbox.scrollHeight));
}

const handleChat = () => {
    userMessage = chatInput.value.trim();
    if(!userMessage) return;
    chatInput.value = "";

    chatbox.appendChild(createChatli(userMessage , "outgoing"));
    chatbox.scrollTo(0 , chatbox.scrollHeight);

    setTimeout(() => {
        // const incomingChatLi = createChatli("Thinking..." , "incoming") 
        const incomingChatLi = createChatli("Waiting..." , "incoming") 
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0 , chatbox.scrollHeight);
    generateResponse(incomingChatLi);
    },600);

}

chatbotToggler.addEventListener("click" , () => document.body.classList.toggle("show-chatbot"));
chatbotCloseBtn.addEventListener("click" , () => document.body.classList.remove("show-chatbot"));
sendChatBtn.addEventListener("click" , handleChat);

