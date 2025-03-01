import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function checkWebcamAvailability(): Promise<{
  available: boolean;
  error?: string;
}> {
  try {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const hasWebcam = devices.some(device => device.kind === 'videoinput');

    if (!hasWebcam) {
      return {
        available: false,
        error: "No webcam found. Please connect a webcam to use eye tracking."
      };
    }

    // Test webcam access
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Clean up
      return { available: true };
    } catch (error) {
      return {
        available: false,
        error: "Webcam access denied. Please grant camera permissions to use eye tracking."
      };
    }
  } catch (error) {
    return {
      available: false,
      error: "Unable to detect webcam. Your browser might not support webcam access."
    };
  }
}

export function checkWebGLSupport(): {
  supported: boolean;
  error?: string;
} {
  // Try different WebGL contexts
  const contextNames = ['webgl2', 'webgl', 'experimental-webgl'];
  const canvas = document.createElement('canvas');

  for (const contextName of contextNames) {
    try {
      const gl = canvas.getContext(contextName);
      if (gl) {
        // Additional WebGL capability checks
        const extension = gl.getExtension('WEBGL_debug_renderer_info');
        if (extension) {
          const renderer = gl.getParameter(extension.UNMASKED_RENDERER_WEBGL);
          // Some software renderers might not be suitable for eye tracking
          if (renderer.toLowerCase().includes('swiftshader') || 
              renderer.toLowerCase().includes('software')) {
            return {
              supported: false,
              error: "Your device is using a software renderer which may not be suitable for eye tracking."
            };
          }
        }
        return { supported: true };
      }
    } catch (e) {
      console.error(`Failed to get ${contextName} context:`, e);
    }
  }

  return {
    supported: false,
    error: "WebGL is not supported by your browser or device. Eye tracking requires WebGL support."
  };
}

export async function checkEyeTrackingSupport(): Promise<{
  supported: boolean;
  error?: string;
  fallbackAvailable?: boolean;
}> {
  // Check WebGL first
  const webglSupport = checkWebGLSupport();
  if (!webglSupport.supported) {
    return {
      supported: false,
      error: webglSupport.error,
      fallbackAvailable: false
    };
  }

  // Check webcam
  const webcamSupport = await checkWebcamAvailability();
  if (!webcamSupport.available) {
    return {
      supported: false,
      error: webcamSupport.error,
      fallbackAvailable: false
    };
  }

  // Check WebGazer.js availability
  // @ts-ignore - WebGazer is loaded via CDN
  if (!window.webgazer) {
    return {
      supported: false,
      error: "Eye tracking library not loaded. Please refresh the page.",
      fallbackAvailable: false
    };
  }

  return { 
    supported: true,
    fallbackAvailable: true 
  };
}