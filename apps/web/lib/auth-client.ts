import { createAuthClient } from "better-auth/react"

const isServer = typeof window === "undefined";

const noopStorage: Storage = {
    length: 0,
    clear() {},
    getItem() { return null; },
    key() { return null; },
    removeItem() {},
    setItem() {},
};

export const authClient = createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL as string || "http://localhost:3000",
    storage: isServer ? noopStorage : localStorage,
    onSignOut: () => {
        if (!isServer) window.location.replace("/signin");
    }
});