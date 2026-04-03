const SERVER_ORIGIN = "http://localhost:4000";

export function getImageUrl(imagePath) {
    if (!imagePath) return "";
    if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
        return imagePath;
    }
    return `${SERVER_ORIGIN}${imagePath}`;
}