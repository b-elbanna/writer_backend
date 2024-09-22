const baseDomain = process.env.NEXT_PUBLIC_BACKEND_DOMAIN || "127.0.0.1:8000";

let base = "";
let secure = false;

if (baseDomain === "127.0.0.1:8000") {
  base = `http://${baseDomain}`;
} else {
  if (secure) {
    base = `https://${baseDomain}`;
  } else {
    base = `http://${baseDomain}`;
  }
}

export const soketUrl = `${secure ? "wss://" : "ws://"}${baseDomain}/ws/`;

export const baseUrl = base;
