// WhatsApp Privacy Blur Extension - Content Script
// Blurs WhatsApp Web content for privacy, reveals on hover

(function() {
  'use strict';
  // Configuration
  const CONFIG = {
    blurClass: 'privacy-blur',
    selectors: {
      // Chat list (sidebar)
      chatList: '#pane-side',
      chatItems: 'div[role="listitem"]',
      
      // Main chat area
      mainChat: '#main',
      messageContainer: 'div[data-testid="conversation-panel-body"]',
      messages: 'div[class*="message-"]',
    
      // Media elements
      images: 'img:not([src*="blob"])',
      videos: 'video',
      
      // Text content
      contactNames: 'span[dir="auto"]',
      messageText: 'span.selectable-text',
      
      // Headers and info
      chatHeader: 'header',
      profilePics: 'img[alt*="profile"], img[src*="photo"]'
    }
  };

  // Track processed elements to avoid reprocessing
  const processedElements = new WeakSet();

  /**
   * Apply blur to a single element
   */
  function applyBlur(element) {
    if (!element || processedElements.has(element)) {
      return;
    }

    // Skip if element is too small (likely an icon)
    const rect = element.getBoundingClientRect();
    if (rect.width < 20 || rect.height < 20) {
      return;
    }

    element.classList.add(CONFIG.blurClass);
    processedElements.add(element);
  }

  /**
   * Apply blur to all matching elements in a container
   */
  function blurContainer(container, selector) {
    if (!container) return;

    const elements = container.querySelectorAll(selector);
    elements.forEach(element => {
      applyBlur(element);
    });
  }

  /**
   * Main function to blur all WhatsApp content
   */
  function blurWhatsAppContent() {
    // Blur chat list sidebar
    const chatList = document.querySelector(CONFIG.selectors.chatList);
    if (chatList) {
      // Blur individual chat items
      blurContainer(chatList, CONFIG.selectors.chatItems);
      
      // Blur all text content in sidebar
      blurContainer(chatList, CONFIG.selectors.contactNames);
      
      // Blur profile pictures in sidebar
      blurContainer(chatList, CONFIG.selectors.profilePics);
    }

    // Blur main chat area
    const mainChat = document.querySelector(CONFIG.selectors.mainChat);
    if (mainChat) {
      // Blur chat header
      const header = mainChat.querySelector(CONFIG.selectors.chatHeader);
      if (header) {
        blurContainer(header, CONFIG.selectors.contactNames);
        blurContainer(header, CONFIG.selectors.profilePics);
      }

      // Blur message container
      const messageContainer = mainChat.querySelector(CONFIG.selectors.messageContainer);
      if (messageContainer) {
        // Blur all messages
        blurContainer(messageContainer, CONFIG.selectors.messages);
        
        // Blur all text content
        blurContainer(messageContainer, CONFIG.selectors.messageText);
        
        // Blur all images
        blurContainer(messageContainer, CONFIG.selectors.images);
        
        // Blur all videos
        blurContainer(messageContainer, CONFIG.selectors.videos);
      }
    }

    // Blur all images globally (catches profile pics and media)
    document.querySelectorAll(CONFIG.selectors.images).forEach(img => {
      if (img.naturalWidth > 20 && img.naturalHeight > 20) {
        applyBlur(img);
      }
    });

    // Blur all videos globally
    document.querySelectorAll(CONFIG.selectors.videos).forEach(video => {
      applyBlur(video);
    });
  }

  /**
   * Observer callback for DOM mutations
   */
  function handleMutations(mutations) {
    let shouldReblur = false;

    for (const mutation of mutations) {
      // Check if nodes were added
      if (mutation.addedNodes.length > 0) {
        shouldReblur = true;
        
        // Immediately blur newly added nodes
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // Blur the node itself if it matches
            if (node.matches && (
              node.matches(CONFIG.selectors.chatItems) ||
              node.matches(CONFIG.selectors.messages) ||
              node.matches('img') ||
              node.matches('video')
            )) {
              applyBlur(node);
            }

            // Blur children of the added node
            Object.values(CONFIG.selectors).forEach(selector => {
              try {
                const children = node.querySelectorAll(selector);
                children.forEach(child => applyBlur(child));
              } catch (e) {
                // Ignore invalid selectors
              }
            });
          }
        });
      }
    }

    // Debounced full reblur if needed
    if (shouldReblur) {
      clearTimeout(handleMutations.timer);
      handleMutations.timer = setTimeout(() => {
        blurWhatsAppContent();
      }, 100);
    }
  }

  /**
   * Initialize the extension
   */
  function init() {
    console.log('WhatsApp Privacy Blur: Initializing...');

    // Initial blur application
    // Wait for WhatsApp to load
    const waitForWhatsApp = setInterval(() => {
      const mainElement = document.querySelector('#app');
      if (mainElement) {
        clearInterval(waitForWhatsApp);
        
        // Apply initial blur
        setTimeout(() => {
          blurWhatsAppContent();
          console.log('WhatsApp Privacy Blur: Initial blur applied');
        }, 1000);

        // Set up MutationObserver for dynamic content
        const observer = new MutationObserver(handleMutations);
        
        observer.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: false,
          characterData: false
        });

        console.log('WhatsApp Privacy Blur: Observer started');

        // Periodic reblur to catch any missed elements
        setInterval(() => {
          blurWhatsAppContent();
        }, 5000);
      }
    }, 500);

    // Cleanup interval after 30 seconds if WhatsApp doesn't load
    setTimeout(() => {
      clearInterval(waitForWhatsApp);
    }, 30000);
  }

  // Start the extension when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Handle page visibility changes (e.g., tab switching)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      setTimeout(() => {
        blurWhatsAppContent();
      }, 500);
    }
  });

})();

//The End Folks
