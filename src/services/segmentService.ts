// Base da API — usa variável de ambiente VITE_API_BASE_URL ou localhost:8000
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const API_KEY = import.meta.env.VITE_API_KEY;

export interface HealthResponse {
  status: string;
}

export interface ModelInfo {
  model_name?: string;
  version?: string;
  [key: string]: any;
}

export interface SegmentClassStat {
  class_id: number;
  class_name: string;
  pixels: number;
  percent: number;
}

export interface SegmentFullResponse {
  mask_png_base64: string;
  stats: SegmentClassStat[];
}

/**
 * Headers com autenticação incluída automaticamente
 */
const withAuthHeaders = (extra?: HeadersInit): HeadersInit => {
  const headers: HeadersInit = {
    Accept: "application/json",
    ...extra,
  };

  if (API_KEY) {
    (headers as any)["x-api-key"] = API_KEY;
  }

  return headers;
};

/**
 * Verifica se o backend está disponível
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: "GET",
      headers: withAuthHeaders(),
    });

    if (!response.ok) return false;

    const data: HealthResponse = await response.json();
    return data.status === "ok";
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
};

/**
 * Obtém informações do modelo
 */
export const getModelInfo = async (): Promise<ModelInfo | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/info`, {
      method: "GET",
      headers: withAuthHeaders(),
    });

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error("Failed to get model info:", error);
    return null;
  }
};

/**
 * Segmentação simples (retorna só a máscara PNG)
 */
export const segmentImage = async (file: File): Promise<Blob> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/segment`, {
    method: "POST",
    headers: withAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(`Segmentation failed: ${response.status} - ${errorText}`);
  }

  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("image/png")) {
    throw new Error("Invalid response format. Expected image/png.");
  }

  return await response.blob();
};

/**
 * Segmentação completa (/segment-full)
 * Retorna máscara + estatísticas
 */
export const segmentImageFull = async (
  file: File
): Promise<{ segmentedUrl: string; stats: SegmentClassStat[] }> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/segment-full`, {
    method: "POST",
    headers: withAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "Unknown error");
    throw new Error(
      `Segmentation failed (/segment-full): ${response.status} - ${errorText}`
    );
  }

  const data = (await response.json()) as SegmentFullResponse;

  if (!data.mask_png_base64 || !Array.isArray(data.stats)) {
    throw new Error("Invalid /segment-full response format.");
  }

  const segmentedUrl = `data:image/png;base64,${data.mask_png_base64}`;
  return { segmentedUrl, stats: data.stats };
};
