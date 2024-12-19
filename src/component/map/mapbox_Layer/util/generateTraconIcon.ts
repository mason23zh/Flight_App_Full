import { createCanvas, CanvasRenderingContext2D } from "canvas";

function generateTraconIcon(traconLabel: string): string {
    // Fixed dimensions for the canvas
    const canvasWidth = 130;  // Fixed width for Deck.gl IconLayer compatibility
    const canvasHeight = 50;  // Fixed height for the icon
    const cornerRadius = 6;  // Rounded corner radius for the label background

    // Create the canvas element with fixed width and height
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // Set canvas background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Measure the width of the text to adjust background size
    ctx.font = "bold 25px Arial";
    const textWidth = ctx.measureText(traconLabel).width;

    // Calculate background dimensions
    const backgroundWidth = Math.min(textWidth + 20, canvasWidth); // Add some padding, max width as canvas width
    const backgroundHeight = canvasHeight - 10;  // Slightly less than full canvas height for padding
    const backgroundX = (canvasWidth - backgroundWidth) / 2;  // Center background
    const backgroundY = (canvasHeight - backgroundHeight) / 2;  // Center background vertically

    // Function to draw a rounded rectangle with all corners rounded
    function drawRoundedRect(ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
    }

    // Draw the rounded rectangle to create the background
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(ctx, backgroundX, backgroundY, backgroundWidth, backgroundHeight, cornerRadius);
    ctx.clip();
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background for the label
    ctx.fillStyle = "rgba(96, 165, 250, 0.8)"; // Blue color for the background
    drawRoundedRect(ctx, backgroundX, backgroundY, backgroundWidth, backgroundHeight, cornerRadius);
    ctx.fill(); // Fill the clipped area

    // Draw the Tracon label text with adjusted padding to center it
    ctx.fillStyle = "#000000"; // Black color for text
    ctx.textAlign = "center"; // Center the text horizontally
    ctx.textBaseline = "middle"; // Vertically center the text
    ctx.fillText(traconLabel, canvasWidth / 2, canvasHeight / 2); // Center Tracon label text vertically and horizontally

    ctx.restore(); // Restore the context state

    // Convert the canvas to a base64-encoded image (data URL)
    const iconURL = canvas.toDataURL();
    return iconURL;
}

export default generateTraconIcon;