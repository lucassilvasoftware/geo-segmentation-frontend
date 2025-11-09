const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface HealthResponse {
  status: string;
}

export interface ModelInfo {
  model_name?: string;
  version?: string;
  [key: string]: any;
}

/**
 * Verifica se o backend de segmentação está disponível
 */
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) return false;
    
    const data: HealthResponse = await response.json();
    return data.status === 'ok';
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

/**
 * Obtém informações do modelo de segmentação
 */
export const getModelInfo = async (): Promise<ModelInfo | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/info`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) return null;
    
    return await response.json();
  } catch (error) {
    console.error('Failed to get model info:', error);
    return null;
  }
};

/**
 * Envia uma imagem para segmentação e retorna a máscara como blob
 */
export const segmentImage = async (file: File): Promise<Blob> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE_URL}/segment`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`Segmentation failed: ${response.status} - ${errorText}`);
  }

  const contentType = response.headers.get('content-type');
  if (!contentType?.includes('image/png')) {
    throw new Error('Invalid response format. Expected image/png.');
  }

  return await response.blob();
};
