// Update service details based on selection
function updateServiceDetails() {
    const service = document.getElementById("service");
    const selectedOption = service.options[service.selectedIndex];
    const description = selectedOption.getAttribute("data-description");
    document.getElementById("service-description").textContent = description;
}

// Calculate total price based on selected service and quantity
function calculatePrice() {
    const service = document.getElementById("service");
    const pricePerThousand = parseFloat(service.value); // Price per 1000 in Tsh
    const quantity = parseInt(document.getElementById("quantity").value, 10);

    if (!quantity || quantity <= 0) {
        alert("Please enter a valid quantity!");
        return;
    }

    const totalPrice = (pricePerThousand * quantity) / 1000;
    document.getElementById("total-price").textContent = totalPrice.toFixed(2);
}

// Place order and send email with screenshot and order details
function placeOrder() {
    const service = document.getElementById("service");
    const selectedService = service.options[service.selectedIndex].text;
    const quantity = document.getElementById("quantity").value;
    const totalPrice = document.getElementById("total-price").textContent;
    const paymentReference = document.getElementById("payment-reference").value;
    const screenshotFile = document.getElementById("payment-screenshot").files[0];

    if (!quantity || quantity <= 0 || !paymentReference || !screenshotFile) {
        alert("Please complete all fields before placing the order.");
        return;
    }

    const reader = new FileReader();
    reader.onloadend = function () {
        const base64Screenshot = reader.result.split(",")[1]; // Base64 image data

        // Prepare email parameters
        const emailParams = {
            customer_name: "Customer", // You can capture this dynamically
            service_name: selectedService,
            payment_reference: paymentReference,
            total_price: totalPrice,
            screenshot: base64Screenshot
        };

        // Send email using EmailJS (or any email service of your choice)
        emailjs.send("service_wf6xazn", "template_533lus7", emailParams, "user_id")
            .then(() => {
                alert("Order completed! An email confirmation has been sent.");
                // Reset form
                document.getElementById("orderForm").reset();
                document.getElementById("total-price").textContent = "0.00";
            })
            .catch((error) => {
                alert("Failed to place order. Please try again.");
                console.error("Error:", error);
            });
    };
    
    reader.readAsDataURL(screenshotFile); // Convert image to Base64
}

// Function to open the chatbot when user clicks the icon
function openChatbot() {
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotIcon = document.getElementById('chatbot-icon');

  // Show the chatbot and hide the icon
  chatbotContainer.style.display = 'flex';
  chatbotIcon.style.display = 'none'; // Hide the chatbot icon when the chatbot is open
}

// Function to close the chatbot when the close button is clicked
function closeChatbot() {
  const chatbotContainer = document.getElementById('chatbot-container');
  const chatbotIcon = document.getElementById('chatbot-icon');

  // Hide the chatbot and show the icon again
  chatbotContainer.style.display = 'none';
  chatbotIcon.style.display = 'block'; // Show the chatbot icon again
}

// Function to handle user input (enter key press or send button click)
function sendUserMessage() {
  const userInput = document.getElementById("user-input").value;

  if (userInput.trim() === "") return; // Don't send empty messages

  displayUserMessage(userInput); // Display the user's message
  processBotResponse(userInput); // Process and display the bot's response
  document.getElementById("user-input").value = ""; // Clear the input field after sending message
}

// Handle key press event (enter key) to send message
function handleUserInput(event) {
  if (event.key === "Enter") {
    sendUserMessage();
  }
}

// Function to display user's message
function displayUserMessage(message) {
  const messagesContainer = document.getElementById("chatbot-messages");

  // Create user message element
  const userMessageDiv = document.createElement("div");
  userMessageDiv.classList.add("message", "user-message");
  userMessageDiv.textContent = message;

  // Append user message to messages container
  messagesContainer.appendChild(userMessageDiv);

  // Ensure the messages container scrolls down to the latest message
  scrollToBottom();
}

// Function to process bot's response and display it
function processBotResponse(userMessage) {
  const botResponse = getBotResponse(userMessage);
  const messagesContainer = document.getElementById("chatbot-messages");

  // Create bot message element
  const botMessageDiv = document.createElement("div");
  botMessageDiv.classList.add("message", "bot-message");
  botMessageDiv.textContent = botResponse;

  // Append bot message to messages container
  messagesContainer.appendChild(botMessageDiv);

  // Ensure the messages container scrolls down to the latest message
  scrollToBottom();
}

// Function to automatically scroll to the bottom of the messages container
function scrollToBottom() {
  const messagesContainer = document.getElementById("chatbot-messages");
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll to the bottom
}

// Predefined bot responses based on user input
function getBotResponse(userMessage) {
  // Lowercase user message for easier comparison
  userMessage = userMessage.toLowerCase();

  // Responses based on keyword matches
  if (userMessage.includes("hello") || userMessage.includes("hi") || userMessage.includes("habari")) {
    return "Habari! Vipi? Naweza vipi kukusaidia leo?";
  } else if (userMessage.includes("bei") || userMessage.includes("price") || userMessage.includes("cost")) {
    return "Bei yetu inategemea huduma unayotaka. Tafadhali niambie ni huduma gani unayohitaji!";
  } else if (userMessage.includes("service") || userMessage.includes("huduma")) {
    return "Tunatoa huduma mbalimbali, ikiwa ni pamoja na: Likes, Followers, Comments na Shares kwa mitandao ya kijamii kama Instagram, Facebook, Twitter na TikTok.";
  } else if (userMessage.includes("thank you") || userMessage.includes("asante")) {
    return "Karibu sana! Ikiwa kuna jambo lingine, tafadhali niambie!";
  } else if (userMessage.includes("help") || userMessage.includes("msaada")) {
    return "Nipo hapa kukusaidia! Tafadhali niambie tatizo lako au maswali yako.";
  } else {
    return "Pole, sijaelewa vizuri. Tafadhali jaribu kuuliza tena kwa maneno tofauti.";
  }
}