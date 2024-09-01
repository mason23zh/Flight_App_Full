// memlab.config.js

function url() {
    return "http://localhost:3000/map"; // Navigate to the /map route
}

async function action(page) {
    try {
        // Wait for the SVG button to be visible before interacting
        await page.waitForSelector("svg[viewBox=\"0 0 512 512\"].text-white.text-xl", {
            visible: true,
            timeout: 5000, // Wait up to 5 seconds for the element to appear
        });
        
        // Click the SVG button using the refined selector
        await page.click("svg[viewBox=\"0 0 512 512\"].text-white.text-xl");
        
        // Use native JavaScript setTimeout with await to delay after clicking
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
        
    } catch (error) {
        console.error("Failed to interact with the button:", error);
    }
}

async function back(page) {
    // Optional: Implement a back action if needed
}

module.exports = {
    action,
    back,
    url
};
