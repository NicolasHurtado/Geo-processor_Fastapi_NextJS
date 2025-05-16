import { ProcessRequest, ProcessResponse } from '../types/geo';

export async function processCoordinates(
  apiUrl: string,
  payload: ProcessRequest
): Promise<ProcessResponse> {
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  // Try parse JSON even if !response.ok, since the backend could send an error JSON.
  let data;
  try {
    data = await response.json();
  } catch (_e) {
    // If parsing fails and the response was not ok, throw an error with the statusText.
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}: ${response.statusText || 'Failed to fetch'}`);
    }
    // If parsing fails but the response was ok (rare for JSON APIs), it could be a problem.
    throw new Error('Failed to parse JSON response even though status was OK.');
  }

  if (!response.ok) {
    const errorMessage = data?.message || `Error: ${response.status}`;
    throw new Error(Array.isArray(errorMessage) ? errorMessage.join(', ') : String(errorMessage));
  }

  return data as ProcessResponse;
} 