import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { MAX_COOKIES_AGE } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * 
 * @param cname 
 * @returns 
 */
export const getCookie = (cname: string) => {
  try {
    const value = typeof window !== "undefined" ? `; ${document.cookie}` : "";
    const parts = value.split(`; ${cname}=`);
    if (parts.length === 2) {
      const part = parts.pop()?.split(";").shift();
      return part ? decodeURIComponent(part) : null;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

/**
 * @param cname
 * @param cvalue
 */
export const setCookie = (cname: string, cvalue: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `${cname}=${encodeURIComponent(
      cvalue
    )};max-age=${MAX_COOKIES_AGE};Secure;SameSite=Strict;path=/`;
  }
};

/**
 * @param cname
 */
export const expireCookie = (cname: string) => {
  if (typeof window !== "undefined") {
    document.cookie = `${cname}=;max-age=0;Secure;SameSite=Strict;path=/`;
  }
};

export const handleLogoutRedirect = () => {
  if (typeof window !== "undefined") {
    expireCookie("_tk");
    window.location.replace("/sign-in");
  }
};
