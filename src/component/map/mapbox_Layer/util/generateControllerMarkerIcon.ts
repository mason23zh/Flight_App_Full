import { createCanvas, CanvasRenderingContext2D } from "canvas";

export const enum Services {
    ATIS = "ATIS",
    DEL = "DEL",
    TWR = "TWR",
    GND = "GND",
}

//TODO: Move this function into worker
//TODO: text out of bounds
function drawControllerIcon(
    ctx: CanvasRenderingContext2D,
    services: string[],
    includeIcao: boolean,
    icao?: string
) {
    // Define styles and dimensions
    const canvasWidth = 100;
    const canvasHeight = 60;
    const cornerRadius = 8;
    const iconColors: { [key: string]: string } = {
        ATIS: "#F59E0B",
        DEL: "#3B82F6",
        GND: "#10B981",
        TWR: "#EF4444",
    };
    const serviceLabels: { [key: string]: string } = {
        ATIS: "A",
        DEL: "D",
        GND: "G",
        TWR: "T",
    };
    const padding = 5;
    const availableWidth = canvasWidth - padding * 2;
    const iconWidth = availableWidth / services.length;
    const iconHeight = 25;
    const iconY = 30;
    const serviceCornerRadius = 5;

    // Set up canvas background
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    ctx.fillStyle = "rgba(75, 85, 99, 0.92)";
    ctx.beginPath();
    ctx.moveTo(cornerRadius, 0);
    ctx.arcTo(canvasWidth, 0, canvasWidth, canvasHeight, cornerRadius);
    ctx.arcTo(canvasWidth, canvasHeight, 0, canvasHeight, cornerRadius);
    ctx.arcTo(0, canvasHeight, 0, 0, cornerRadius);
    ctx.arcTo(0, 0, canvasWidth, 0, cornerRadius);
    ctx.closePath();
    ctx.fill();

    // Draw ICAO code if requested
    if (includeIcao && icao) {
        ctx.fillStyle = "#F3F4F6";
        ctx.font = "bold 18px Arial";
        ctx.textAlign = "center";
        ctx.fillText(icao, canvasWidth / 2, 20);
    }

    // Draw each service icon
    services.forEach((service, index) => {
        const iconX = padding + index * iconWidth;
        let radiusTopLeft = 0,
            radiusTopRight = 0,
            radiusBottomRight = 0,
            radiusBottomLeft = 0;

        if (services.length === 1) {
            radiusTopLeft =
                radiusTopRight =
                radiusBottomRight =
                radiusBottomLeft =
                    serviceCornerRadius;
        } else if (index === 0) {
            radiusTopLeft = radiusBottomLeft = serviceCornerRadius;
        } else if (index === services.length - 1) {
            radiusTopRight = radiusBottomRight = serviceCornerRadius;
        }

        ctx.beginPath();
        ctx.moveTo(iconX + radiusTopLeft, iconY);
        ctx.lineTo(iconX + iconWidth - radiusTopRight, iconY);
        ctx.quadraticCurveTo(iconX + iconWidth, iconY, iconX + iconWidth, iconY + radiusTopRight);
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

        ctx.fillStyle = iconColors[service] || "#FFFFFF";
        ctx.fill();
        ctx.fillStyle = "#FFFFFF";
        ctx.font = "bold 21px Arial";
        ctx.textAlign = "center";
        const textY = iconY + iconHeight / 2 + 7;
        ctx.fillText(serviceLabels[service], iconX + iconWidth / 2, textY);
    });
}

function generateControllerMarkerIconWithIcao(icao: string, services: string[]): string {
    const canvas = createCanvas(100, 60);
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    drawControllerIcon(ctx, services, true, icao);

    return canvas.toDataURL();
}

export { generateControllerMarkerIconWithIcao };
