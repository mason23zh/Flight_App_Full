import * as Comlink from "comlink";
import { createCanvas, CanvasRenderingContext2D } from "canvas"; // Ensure you have the `canvas` package installed.

function generateFirIcon(icao: string, isFss: boolean): string {
    // Fixed dimensions for the canvas
    const canvasWidth = 130;  // Fixed width for Deck.gl IconLayer compatibility
    const canvasHeight = 70;  // Fixed height to accommodate both ICAO and FSS consistently
    const cornerRadius = 8;  // Rounded corner radius for sections
    const minTextPadding = 10;  // Minimum padding for text in the background
    const maxBackgroundWidth = canvasWidth - 20;  // Max background width with padding

    // Create the canvas element with fixed width and height
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // Set canvas background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Function to draw a rounded rectangle with specific corners rounded
    function drawCustomRoundedRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number,
        roundTopLeft: boolean,
        roundTopRight: boolean,
        roundBottomRight: boolean,
        roundBottomLeft: boolean
    ) {
        ctx.beginPath();
        ctx.moveTo(x + (roundTopLeft ? radius : 0), y);
        ctx.lineTo(x + width - (roundTopRight ? radius : 0), y);
        if (roundTopRight) {
            ctx.arcTo(x + width, y, x + width, y + radius, radius);
        } else {
            ctx.lineTo(x + width, y);
        }

        ctx.lineTo(x + width, y + height - (roundBottomRight ? radius : 0));
        if (roundBottomRight) {
            ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
        } else {
            ctx.lineTo(x + width, y + height);
        }

        ctx.lineTo(x + (roundBottomLeft ? radius : 0), y + height);
        if (roundBottomLeft) {
            ctx.arcTo(x, y + height, x, y + height - radius, radius);
        } else {
            ctx.lineTo(x, y + height);
        }

        ctx.lineTo(x, y + (roundTopLeft ? radius : 0));
        if (roundTopLeft) {
            ctx.arcTo(x, y, x + radius, y, radius);
        } else {
            ctx.lineTo(x, y);
        }

        ctx.closePath();
    }

    // Calculate text width and adjust background width dynamically
    ctx.font = "bold 25px Arial";  // Font for calculating text width
    const icaoTextWidth = Math.min(ctx.measureText(icao).width + minTextPadding * 2, maxBackgroundWidth);
    const fssTextWidth = Math.min(ctx.measureText("FSS").width + minTextPadding * 2, maxBackgroundWidth);
    const backgroundWidth = Math.max(icaoTextWidth, fssTextWidth);

    // Center align the backgrounds on the canvas
    const backgroundX = (canvasWidth - backgroundWidth) / 2;

    // Draw the FSS section with rounded top corners if isFss is true
    if (isFss) {
        const fssHeight = 30; // Fixed height for FSS section
        ctx.save();
        ctx.beginPath();
        drawCustomRoundedRect(ctx, backgroundX, 0, backgroundWidth, fssHeight, cornerRadius, true, true, false, false);
        ctx.clip();
        ctx.clearRect(backgroundX, 0, backgroundWidth, fssHeight);

        // Set FSS background color and draw
        ctx.fillStyle = "rgba(59, 130, 246, 0.8)"; // Blue color for FSS (Tailwind: blue-500)
        drawCustomRoundedRect(ctx, backgroundX, 0, backgroundWidth, fssHeight, cornerRadius, true, true, false, false);
        ctx.fill();

        // Draw FSS Text
        ctx.fillStyle = "#000000"; // Text color for FSS
        ctx.font = "bold 24px Arial";  // Font size for FSS
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";  // Vertically center the text
        ctx.fillText("FSS", canvasWidth / 2, fssHeight / 2);  // Center FSS text vertically
        ctx.restore();
    }

    // Draw the ICAO section background with rounded bottom corners if FSS is present, otherwise all corners rounded
    const icaoY = isFss ? 30 : 20; // Adjust starting Y position for ICAO section based on FSS presence
    const icaoHeight = canvasHeight - icaoY; // Adjust height based on FSS presence
    ctx.save();
    ctx.beginPath();
    if (isFss) {
        drawCustomRoundedRect(ctx, backgroundX, icaoY, backgroundWidth, icaoHeight, cornerRadius, false, false, true, true);
    } else {
        drawCustomRoundedRect(ctx, backgroundX, icaoY, backgroundWidth, icaoHeight, cornerRadius, true, true, true, true);
    }
    ctx.clip();
    ctx.clearRect(backgroundX, icaoY, backgroundWidth, icaoHeight);

    // Draw ICAO background color
    ctx.fillStyle = "rgba(255, 251, 235, 0.8)"; // Amber background color for ICAO section (Tailwind: amber-50)
    if (isFss) {
        drawCustomRoundedRect(ctx, backgroundX, icaoY, backgroundWidth, icaoHeight, cornerRadius, false, false, true, true);
    } else {
        drawCustomRoundedRect(ctx, backgroundX, icaoY, backgroundWidth, icaoHeight, cornerRadius, true, true, true, true);
    }
    ctx.fill();

    // Draw ICAO Code in the center of the remaining area
    ctx.fillStyle = "#000000"; // Black color for ICAO text
    ctx.font = "bold 25px Arial";  // Updated font size for ICAO
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";  // Vertically center the text
    ctx.fillText(icao, canvasWidth / 2, icaoY + icaoHeight / 2);  // Center ICAO text vertically

    ctx.restore(); // Restore the context state

    // Convert the canvas to a base64-encoded image (data URL)
    const iconURL = canvas.toDataURL();
    return iconURL;
}


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

function generateControllerMarkerIcon(icao: string, services: string[]): string {
    // Create a canvas element
    const canvas = createCanvas(100, 60); //width and height
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    // Set canvas background to transparent
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Function to draw a rounded rectangle
    function drawRoundedRect(
        ctx: CanvasRenderingContext2D,
        x: number,
        y: number,
        width: number,
        height: number,
        radius: number
    ) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.arcTo(x + width, y, x + width, y + height, radius);
        ctx.arcTo(x + width, y + height, x, y + height, radius);
        ctx.arcTo(x, y + height, x, y, radius);
        ctx.arcTo(x, y, x + width, y, radius);
        ctx.closePath();
    }

    // Draw the rounded rectangle to create the background
    const cornerRadius = 8; // Rounded corner radius for the overall icon
    ctx.save(); // Save the context state
    ctx.beginPath();
    drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, cornerRadius);
    ctx.clip(); // Clip to this rounded rectangle

    // Clear any outside area to ensure transparency
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background for the marker
    ctx.fillStyle = "rgba(75, 85, 99, 0.92)";
    drawRoundedRect(ctx, 0, 0, canvas.width, canvas.height, cornerRadius);
    ctx.fill(); // Fill the clipped area

    // Draw ICAO Code at the top
    ctx.fillStyle = "#F3F4F6"; // Light Gray color for text
    ctx.font = "bold 18px Arial";
    ctx.textAlign = "center";
    ctx.fillText(icao, canvas.width / 2, 20);

    // Draw service icons
    const iconColors: { [key: string]: string } = {
        ATIS: "#F59E0B", // Yellow for ATIS
        DEL: "#3B82F6", // Blue for DEL
        GND: "#10B981", // Green for GND
        TWR: "#EF4444", // Red for TWR
    };

    const serviceLabels: { [key: string]: string } = {
        ATIS: "A",
        DEL: "D",
        GND: "G",
        TWR: "T",
    };

    // Padding around the entire icon area
    const padding = 5;
    const availableWidth = canvas.width - padding * 2; // Total available width for icons
    const iconWidth = availableWidth / services.length; // Width of each icon to eliminate gaps
    const iconHeight = 25; // Fixed height for service icons
    const iconY = 30; // Fixed Y position for service icons
    const serviceCornerRadius = 5; // Rounded corner radius for the service icons

    // Draw each service icon horizontally with connected rounded edges
    services.forEach((service, index) => {
        const iconX = padding + index * iconWidth; // Calculate X position for each icon

        // Determine the rounded corners based on position
        let radiusTopLeft = 0,
            radiusTopRight = 0,
            radiusBottomRight = 0,
            radiusBottomLeft = 0;
        if (services.length === 1) {
            // Only one service, all corners are rounded
            radiusTopLeft = radiusTopRight = radiusBottomRight = radiusBottomLeft = serviceCornerRadius;
        } else if (index === 0) {
            // First service, round top-left and bottom-left corners
            radiusTopLeft = radiusBottomLeft = serviceCornerRadius;
        } else if (index === services.length - 1) {
            // Last service, round top-right and bottom-right corners
            radiusTopRight = radiusBottomRight = serviceCornerRadius;
        }

        // Draw rectangular icon background with rounded corners
        ctx.beginPath();
        ctx.moveTo(iconX + radiusTopLeft, iconY);
        ctx.lineTo(iconX + iconWidth - radiusTopRight, iconY);
        ctx.quadraticCurveTo(
            iconX + iconWidth,
            iconY,
            iconX + iconWidth,
            iconY + radiusTopRight
        );
        ctx.lineTo(iconX + iconWidth, iconY + iconHeight - radiusBottomRight);
        ctx.quadraticCurveTo(
            iconX + iconWidth,
            iconY + iconHeight,
            iconX + iconWidth - radiusBottomRight,
            iconY + iconHeight
        );
        ctx.lineTo(iconX + radiusBottomLeft, iconY + iconHeight);
        ctx.quadraticCurveTo(
            iconX,
            iconY + iconHeight,
            iconX,
            iconY + iconHeight - radiusBottomLeft
        );
        ctx.lineTo(iconX, iconY + radiusTopLeft);
        ctx.quadraticCurveTo(iconX, iconY, iconX + radiusTopLeft, iconY);
        ctx.closePath();

        // Fill the background for the service icon
        ctx.fillStyle = iconColors[service] || "#FFFFFF";
        ctx.fill();

        // Draw the letter inside the icon
        ctx.fillStyle = "#FFFFFF"; // Text color (white)
        ctx.font = "bold 21px Arial";
        ctx.textAlign = "center";
        const textY = iconY + iconHeight / 2 + 7; // Adjust text placement to be vertically centered
        ctx.fillText(serviceLabels[service], iconX + iconWidth / 2, textY);
    });

    ctx.restore(); // Restore the context state

    // Convert the canvas to a base64-encoded image (data URL)
    const iconURL = canvas.toDataURL();
    return iconURL;
}

const workerAPI = {
    generateControllerMarkerIcon,
    generateFirIcon,
    generateTraconIcon
};

Comlink.expose(workerAPI);

