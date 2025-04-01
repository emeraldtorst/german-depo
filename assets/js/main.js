document.addEventListener('DOMContentLoaded', () => {

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    const html = document.documentElement;

    // Function to set theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    };

    // Initialize theme based on localStorage or system preference
    const currentTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (currentTheme) {
        setTheme(currentTheme);
    } else {
        setTheme(prefersDark ? 'dark' : 'light');
    }

    // Theme toggle button event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = html.classList.contains('dark');
            setTheme(isDark ? 'light' : 'dark');
        });
    }

    // Mobile menu toggle
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = mobileMenuButton.getAttribute('aria-expanded') === 'true';
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });
    }

    // Smooth scrolling for navigation links & close mobile menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            // Ensure it's a valid internal link
            if (href && href !== '#' && href.startsWith('#')) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open and it's a nav link click
                    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                       mobileMenu.classList.add('hidden');
                       if(mobileMenuButton) mobileMenuButton.setAttribute('aria-expanded', 'false');
                    }
                }
            }
        });
    });

    // Loading screen
    const loadingScreen = document.querySelector('.page-transition');
    if (loadingScreen) {
         // Use setTimeout to ensure minimum display time, even if loading is fast
         setTimeout(() => {
            loadingScreen.classList.add('hidden');
         }, 500); // Adjust time as needed (e.g., 500ms)

         // Fallback in case load event doesn't fire quickly
         window.addEventListener('load', () => {
            setTimeout(() => {
                 if (!loadingScreen.classList.contains('hidden')) {
                     loadingScreen.classList.add('hidden');
                 }
            }, 500); // Same delay as above
         });
    }


    // Back to top button
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('hidden');
            } else {
                backToTopButton.classList.add('hidden');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Chatbot toggle
    const chatbotButton = document.getElementById('chatbot-button');
    const chatbotWindow = document.getElementById('chatbot-window');

    if (chatbotButton && chatbotWindow) {
        chatbotButton.addEventListener('click', () => {
            chatbotWindow.classList.toggle('active');
            // Toggle aria-expanded for accessibility
             const isExpanded = chatbotButton.getAttribute('aria-expanded') === 'true';
             chatbotButton.setAttribute('aria-expanded', !isExpanded);
             chatbotWindow.setAttribute('aria-hidden', isExpanded); // Toggle hidden state
        });

        // Optional: Close chatbot if clicking outside
        document.addEventListener('click', (event) => {
            if (!chatbotWindow.contains(event.target) && !chatbotButton.contains(event.target) && chatbotWindow.classList.contains('active')) {
                chatbotWindow.classList.remove('active');
                chatbotButton.setAttribute('aria-expanded', 'false');
                chatbotWindow.setAttribute('aria-hidden', 'true');
            }
        });
    }

    // Animate on scroll
    const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');

    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    // Optional: unobserve after animation to save resources
                    // observer.unobserve(entry.target);
                }
                // Optional: remove class if scrolling back up
                // else {
                //     entry.target.classList.remove('is-visible');
                // }
            });
        }, {
            threshold: 0.1 // Trigger when 10% of the element is visible
        });

        animateOnScrollElements.forEach(element => {
            observer.observe(element);
        });
    } else {
        // Fallback for browsers without IntersectionObserver (optional)
        // Simply make them visible immediately or use a scroll event listener (less performant)
        animateOnScrollElements.forEach(element => element.classList.add('is-visible'));
    }


    // Simple chatbot responses
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatInput = document.querySelector('.chatbot-input input');
    const chatSendButton = document.querySelector('.chatbot-input button');

    if (chatMessagesContainer && chatInput && chatSendButton) {
        const responses = {
            'concert': 'Bernadette\'s next concert is on June 15th at the Vienna Philharmonic Summer Night Concert in Schönbrunn Palace. You can find more details and ticket links in the <a href="#concerts" class="text-accent hover:underline">Concerts section</a>.',
            'lesson': 'Bernadette offers private lessons for various levels. Please visit the <a href="#lessons" class="text-accent hover:underline">Lessons section</a> to learn more about options and request a consultation.',
            'album': 'Bernadette\'s latest album "Nocturnes" is featured in the <a href="#music" class="text-accent hover:underline">Music section</a> with links to major streaming platforms like Apple Music and Spotify.',
            'hello': 'Hello there! How can I assist you today? Ask me about concerts, lessons, albums, or anything else related to Bernadette.',
            'thank': 'You\'re very welcome! Let me know if there\'s anything else.',
            'bye': 'Goodbye! Have a wonderful day and enjoy the music!'
        };

        function addMessage(message, isUser = false) {
            const messageDiv = document.createElement('div');
            messageDiv.classList.add('mb-4', 'flex', isUser ? 'justify-end' : 'justify-start');

            const bubbleDiv = document.createElement('div');
            bubbleDiv.classList.add('rounded-lg', 'p-3', 'max-w-[85%]', 'text-sm'); // Adjusted max-width and text size
            bubbleDiv.classList.add(
                isUser ? 'bg-accent' : 'bg-gray-100',
                isUser ? 'text-white' : 'text-gray-800', // Ensure text color contrast
                'dark:text-white', // Dark mode text color for user
                !isUser ? 'dark:bg-gray-700' : '' // Dark mode background for bot
            );


            bubbleDiv.innerHTML = message; // Use innerHTML to render links
            messageDiv.appendChild(bubbleDiv);
            chatMessagesContainer.appendChild(messageDiv);

            // Scroll to bottom smoothly
            chatMessagesContainer.scrollTo({
                top: chatMessagesContainer.scrollHeight,
                behavior: 'smooth'
            });
        }

        function getChatbotResponse(message) {
            const lowerMessage = message.toLowerCase();
            let response = "I'm sorry, I couldn't quite understand that. Could you please rephrase? You can ask about concerts, lessons, or music albums."; // Default response

            // Check for keywords
            if (lowerMessage.includes('concert') || lowerMessage.includes('performance') || lowerMessage.includes('ticket') || lowerMessage.includes('event')) {
                response = responses['concert'];
            } else if (lowerMessage.includes('lesson') || lowerMessage.includes('teach') || lowerMessage.includes('learn') || lowerMessage.includes('masterclass') || lowerMessage.includes('instruct')) {
                response = responses['lesson'];
            } else if (lowerMessage.includes('album') || lowerMessage.includes('music') || lowerMessage.includes('record') || lowerMessage.includes('discography') || lowerMessage.includes('listen')) {
                response = responses['album'];
            } else if (lowerMessage.includes('hi') || lowerMessage.includes('hello') || lowerMessage.includes('hey') || lowerMessage.includes('greetings')) {
                response = responses['hello'];
            } else if (lowerMessage.includes('thank') || lowerMessage.includes('appreciate')) {
                response = responses['thank'];
            } else if (lowerMessage.includes('bye') || lowerMessage.includes('goodbye') || lowerMessage.includes('see you')) {
                response = responses['bye'];
            } else if (lowerMessage.includes('book') || lowerMessage.includes('hire') || lowerMessage.includes('engage')) {
                 response = 'For booking inquiries, please use the contact form in the <a href="#contact" class="text-accent hover:underline">Contact section</a> or reach out via the provided email/phone.';
            } else if (lowerMessage.includes('about') || lowerMessage.includes('who is') || lowerMessage.includes('biography')) {
                 response = 'You can read about Bernadette\'s journey and career milestones in the <a href="#about" class="text-accent hover:underline">About section</a>.';
            }

            return response;
        }

        function handleChatSubmit() {
             const message = chatInput.value.trim();
             if (message) {
                 addMessage(message, true);
                 chatInput.value = ''; // Clear input after sending

                 // Simulate bot thinking time
                 setTimeout(() => {
                     const response = getChatbotResponse(message);
                     addMessage(response); // Add bot response
                 }, 750); // Delay in milliseconds
             }
        }

        // Event listener for send button
        chatSendButton.addEventListener('click', handleChatSubmit);

        // Event listener for Enter key in input field
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                 handleChatSubmit();
            }
        });
    }


    // Basic Audio player 'simulation' functionality (adjust as needed if using a real audio library)
    const playPauseButton = document.getElementById('play-pause-button');
    const audioProgressBar = document.getElementById('audio-progress-bar');
    let isPlaying = false;
    let progressInterval; // To store the interval ID

    if (playPauseButton && audioProgressBar) {
        playPauseButton.addEventListener('click', () => {
            const playIcon = playPauseButton.querySelector('i');

            isPlaying = !isPlaying; // Toggle state

            if (isPlaying) {
                playIcon.classList.remove('fa-play');
                playIcon.classList.add('fa-pause');
                animateProgressBar();
            } else {
                playIcon.classList.remove('fa-pause');
                playIcon.classList.add('fa-play');
                clearInterval(progressInterval); // Stop the animation
            }
        });

        function animateProgressBar() {
            let width = parseFloat(audioProgressBar.style.width) || 0; // Get current width or start at 0
            const durationSeconds = 4 * 60 + 32; // 4:32 in seconds
            const updateIntervalMs = 100; // Update every 100ms for smoother animation
            const increment = (100 / (durationSeconds * 1000 / updateIntervalMs)); // Calculate % increment per interval

            // Clear any existing interval before starting a new one
            clearInterval(progressInterval);

            progressInterval = setInterval(() => {
                if (!isPlaying) { // Check if paused
                    clearInterval(progressInterval);
                    return;
                }

                width += increment;

                if (width >= 100) {
                    width = 100; // Cap at 100%
                    clearInterval(progressInterval);
                    // Reset button to 'play' state when finished
                    const playIcon = playPauseButton.querySelector('i');
                    playIcon.classList.remove('fa-pause');
                    playIcon.classList.add('fa-play');
                    isPlaying = false;
                     // Optional: Reset progress bar visually after a short delay
                     setTimeout(() => { audioProgressBar.style.width = '0%'; }, 500);
                }

                audioProgressBar.style.width = width + '%';

            }, updateIntervalMs);
        }

        // Initialize progress bar width visually if needed (e.g., if it wasn't 0 initially)
         if(!audioProgressBar.style.width) {
             audioProgressBar.style.width = '0%';
         }
    }

    // Active Navigation Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function changeNavOnScroll() {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Check if scroll position is within the section bounds (adjust offset as needed)
            if (pageYOffset >= sectionTop - sectionHeight / 3) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active'); // Remove active class from all
            // Add active class if the link's href matches the current section
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', changeNavOnScroll);
    changeNavOnScroll(); // Initial check on page load


}); // End DOMContentLoaded
