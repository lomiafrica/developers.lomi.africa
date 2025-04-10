/**
 * Utility for handling email-related functionality
 */

/**
 * Opens a mailto link in a way that's more compatible with various browsers and platforms.
 * This function handles Chrome's specific issues with mailto links.
 *
 * @param email - Recipient email address
 * @param subject - Email subject (optional)
 * @param body - Email body (optional)
 */
export function openMailto(
  email: string,
  subject?: string,
  body?: string,
): void {
  let mailtoLink = `mailto:${email}`;

  // Add subject and body if provided
  const params: string[] = [];
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (body) params.push(`body=${encodeURIComponent(body)}`);

  if (params.length > 0) {
    mailtoLink += `?${params.join("&")}`;
  }

  // Chrome-specific approach: try to open in a new small window which may have better success
  // triggering the mail handler
  const mailWindow = window.open(mailtoLink, "_blank", "width=700,height=600");

  // If window is blocked or mail client doesn't open automatically
  setTimeout(() => {
    if (mailWindow && mailWindow.closed) {
      // The window was opened and closed quickly, which means no mail client caught it
      fallbackAlert(email, subject);
    } else if (!mailWindow) {
      // Popup was blocked or other issue
      fallbackAlert(email, subject);
    } else {
      // Window might be open but no mail client taking over
      // Close it to avoid an empty window
      mailWindow.close();

      // Now use the direct approach as a backup
      const link = document.createElement("a");
      link.href = mailtoLink;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();

      setTimeout(() => {
        document.body.removeChild(link);
      }, 100);

      // Show helper message
      fallbackAlert(email, subject);
    }
  }, 500);
}

/**
 * Shows a minimalist modal with email information and a copy icon
 */
function fallbackAlert(email: string, subject?: string): void {
  // Detect dark mode
  const isDarkMode =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;
  const darkModeElement = document.documentElement.classList.contains("dark");
  const useDarkMode = isDarkMode || darkModeElement;

  const modal = document.createElement("div");
  modal.style.position = "fixed";
  modal.style.top = "50%";
  modal.style.left = "50%";
  modal.style.transform = "translate(-50%, -50%)";
  modal.style.backgroundColor = useDarkMode ? "#18181b" : "white"; // zinc-900 for dark mode
  modal.style.padding = "16px";
  modal.style.borderRadius = "8px";
  modal.style.boxShadow = useDarkMode
    ? "0 4px 10px rgba(0, 0, 0, 0.4)"
    : "0 4px 10px rgba(0, 0, 0, 0.2)";
  modal.style.zIndex = "9999";
  modal.style.maxWidth = "350px";
  modal.style.width = "90%";
  modal.style.display = "flex";
  modal.style.flexDirection = "column";
  modal.style.gap = "8px";
  modal.style.border = useDarkMode ? "1px solid #27272a" : "1px solid #e4e4e7"; // zinc-800/zinc-200 border

  // Create content container
  const contentContainer = document.createElement("div");
  contentContainer.style.display = "flex";
  contentContainer.style.alignItems = "center";
  contentContainer.style.justifyContent = "space-between";
  contentContainer.style.width = "100%";

  // Create email info container
  const emailInfo = document.createElement("div");
  emailInfo.style.flexGrow = "1";
  emailInfo.style.color = useDarkMode ? "#e4e4e7" : "#18181b"; // Text color - zinc-200 for dark, zinc-900 for light

  // Email row
  const emailRow = document.createElement("div");
  emailRow.style.margin = "0 0 4px 0";
  emailRow.innerHTML = `<span style="font-weight: 500;">Email:</span> ${email}`;

  emailInfo.appendChild(emailRow);

  // Subject row (if provided)
  if (subject) {
    const subjectRow = document.createElement("div");
    subjectRow.style.margin = "0";
    subjectRow.innerHTML = `<span style="font-weight: 500;">Subject:</span> ${subject}`;
    emailInfo.appendChild(subjectRow);
  }

  // Copy icon button
  const copyButton = document.createElement("button");
  copyButton.style.background = "none";
  copyButton.style.border = "none";
  copyButton.style.cursor = "pointer";
  copyButton.style.padding = "4px";
  copyButton.style.marginLeft = "8px";
  copyButton.style.display = "flex";
  copyButton.style.alignItems = "center";
  copyButton.style.justifyContent = "center";
  copyButton.style.color = "#4F46E5"; // indigo-600 (always visible in both themes)
  copyButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  `;

  // Assemble the modal
  contentContainer.appendChild(emailInfo);
  contentContainer.appendChild(copyButton);
  modal.appendChild(contentContainer);

  document.body.appendChild(modal);

  // Flag to prevent multiple close attempts
  let isClosing = false;

  // Define the click outside handler separately
  const handleClickOutside = (event: MouseEvent) => {
    if (isClosing) return; // Already closing

    // Check if the click is outside the modal AND if the modal is still in the body
    if (
      document.body.contains(modal) &&
      !modal.contains(event.target as Node)
    ) {
      isClosing = true; // Mark as closing
      document.body.removeChild(modal);
      // Remove the listener *only* after successfully removing the modal here
      document.removeEventListener("click", handleClickOutside);
    } else if (!document.body.contains(modal)) {
      // If the modal is already gone (removed by another process), just clean up the listener
      if (!isClosing) {
        // Check flag before marking
        isClosing = true;
        document.removeEventListener("click", handleClickOutside);
      }
    }
  };

  // Copy functionality
  copyButton.addEventListener("click", () => {
    if (isClosing) return; // Prevent action if already closing

    const textToCopy = subject ? `Email: ${email}\nSubject: ${subject}` : email;

    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        // Show copied indicator briefly
        copyButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      `;

        // Close the modal after showing the check mark
        setTimeout(() => {
          if (isClosing) return; // Already closing

          // Check if modal still exists before removing
          if (document.body.contains(modal)) {
            isClosing = true; // Mark as closing
            document.body.removeChild(modal);
            // Ensure the listener is removed
            document.removeEventListener("click", handleClickOutside);
          }
        }, 800);
      })
      .catch((err) => {
        console.error("Failed to copy:", err);
      });
  });

  // Auto-close functionality
  setTimeout(() => {
    if (isClosing) return; // Already closing

    if (document.body.contains(modal)) {
      isClosing = true; // Mark as closing
      document.body.removeChild(modal);
      // Ensure the listener is removed
      document.removeEventListener("click", handleClickOutside);
    }
  }, 6000); // Auto-close after 6 seconds

  // Close when clicking outside the modal
  // Use the named function handler
  document.addEventListener("click", handleClickOutside);
}
