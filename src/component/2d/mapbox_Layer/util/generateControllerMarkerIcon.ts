import { createCanvas, CanvasRenderingContext2D } from "canvas";

export const enum Services {
    ATIS = "ATIS",
    DEL = "DEL",
    TWR = "TWR",
    GND = "GND"
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
    console.log(iconURL);
    return iconURL;
}

 
export default generateControllerMarkerIcon;