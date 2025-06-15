const API_BASE = import.meta.env.VITE_API_BASE;

export const uploadFile = async (password: string, file: File) => {
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

export const downloadFile = async (password: string, link: string) => {
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
