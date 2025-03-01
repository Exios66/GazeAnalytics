import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function checkWebcamAvailability(): Promise<boolean> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    return devices.some(device => device.kind === 'videoinput');
  } catch (error) {
    console.error('Error checking webcam availability:', error);
    return false;
  }
}

export function checkWebGLSupport(): boolean {
  const canvas = document.createElement('canvas');
  let gl = null;

  try {
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  } catch (error) {
    return false;
  }

  return gl !== null;
}

export async function checkEyeTrackingSupport(): Promise<{
  supported: boolean;
  error?: string;
}> {
  const hasWebGL = checkWebGLSupport();
  if (!hasWebGL) {
    return {
      supported: false,
      error: "WebGL is not supported in your browser. Eye tracking requires WebGL support.",
    };
  }

  const hasWebcam = await checkWebcamAvailability();
  if (!hasWebcam) {
    return {
      supported: false,
      error: "No webcam detected. Please connect a webcam to use eye tracking.",
    };
  }

  return { supported: true };
}