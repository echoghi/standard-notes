export function getCookie(name: string): string | null {
    let cookieArray: string[] = [];

    try {
        // Get all cookies as a single string
        const allCookies = document.cookie;

        // Split the string into individual cookies
        cookieArray = allCookies.split(';');
    } catch (error) {}

    // Loop through the array of cookies
    for (const cookie of cookieArray) {
        // Check if the cookie starts with the name we're looking for, followed by an equals sign
        if (cookie.startsWith(`${name}=`)) {
            // If it does, split the cookie into its name and value parts
            const cookieParts = cookie.split('=');

            // Return the value part of the cookie
            return cookieParts[1];
        }
    }

    // If we didn't find the cookie, return null
    return null;
}

export function setCookie(name: string, value: string, expiration: number = 7): void {
    try {
        // set default expiration to 7 days
        const date = new Date();
        date.setTime(date.getTime() + expiration * 24 * 60 * 60 * 1000);
        const expires = `expires=${date.toUTCString()}`;

        // Set the cookie with the given name and value
        document.cookie = `${name}=${value}; SameSite=strict ${expires}}; path=/`;
    } catch (e) {
        throw new Error('Unable to set cookie');
    }
}

export function removeCookie(name: string): void {
    // remove cookie by setting expiration to -1
    setCookie(name, '', -1);
}
