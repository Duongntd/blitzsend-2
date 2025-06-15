const API_BASE = import.meta.env.VITE_API_BASE;
const password = sessionStorage.getItem("password") || "";

export const uploadFile = async (file: File) => {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    headers: { "X-Password": password },
    body: form,
  });

  if (!res.ok) {
    throw new Error("Upload failed: " + (await res.text()));
  }
  const { download_url } = await res.json();
  return download_url;
};

export const downloadFile = async (link: string) => {
  const res = await fetch(API_BASE + link, {
    method: "GET",
    headers: { "X-Password": password },
  });
  if (!res.ok) {
    throw new Error("Download failed: " + (await res.text()));
  }
  const blob = await res.blob();
  let filename = "downloaded_file";
  const disp = res.headers.get("content-disposition");
  if (disp && disp.includes("filename=")) {
    filename = disp.split("filename=")[1].replace(/"/g, "").trim();
  }
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
};

export const listFiles = async () => {
  const [filesRes, textsRes] = await Promise.all([
    fetch(`${API_BASE}/list`, {
      method: "GET",
      headers: { "X-Password": password },
    }),
    fetch(`${API_BASE}/texts`, {
      method: "GET",
      headers: { "X-Password": password },
    }),
  ]);

  if (!filesRes.ok) {
    throw new Error("List files failed: " + (await filesRes.text()));
  }
  if (!textsRes.ok) {
    throw new Error("List texts failed: " + (await textsRes.text()));
  }
  const files = await filesRes.json();
  const texts = await textsRes.json();
  return { files: files.files, texts: texts.texts };
};

export const authenticate = async (pw: string) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password: pw }),
  });
  if (!res.ok) {
    throw new Error("Authentication failed: " + (await res.text()));
  }
  return await res.json();
};

export const uploadText = async (text: string) => {
  const res = await fetch(`${API_BASE}/text`, {
    method: "POST",
    headers: {
      "X-Password": password,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (!res.ok) {
    throw new Error("Upload text failed: " + (await res.text()));
  }
  return await res.json();
};

export const getText = async (id: string): Promise<{ text: string }> => {
  const res = await fetch(`${API_BASE}/text/${id}`, {
    method: "GET",
    headers: { "X-Password": password },
  });
  if (!res.ok) {
    throw new Error("Get text failed: " + (await res.text()));
  }
  return await res.json();
};
