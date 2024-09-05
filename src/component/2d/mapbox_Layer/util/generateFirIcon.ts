import { createCanvas, CanvasRenderingContext2D } from "canvas"; // Ensure you have the `canvas` package installed.

function generateFirIcon(icao: string, isFss: boolean): string {
    // Fixed dimensions for the canvas
    const canvasWidth = 160;  // Fixed width for Deck.gl IconLayer compatibility
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
    ctx.font = "bold 24px Arial";  // Updated font size for ICAO
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";  // Vertically center the text
    ctx.fillText(icao, canvasWidth / 2, icaoY + icaoHeight / 2);  // Center ICAO text vertically

    ctx.restore(); // Restore the context state

    // Convert the canvas to a base64-encoded image (data URL)
    const iconURL = canvas.toDataURL();
    return iconURL;
}


export default generateFirIcon;