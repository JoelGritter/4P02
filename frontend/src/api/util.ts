import urlJoin from 'url-join';
import { getToken } from './auth';
const { REACT_APP_API_BASE }: any = process.env;

export function apiJoin(...parts: string[]) {
  return urlJoin(REACT_APP_API_BASE, ...parts);
}

export const fetcher = (url: string) =>
  fetch(url, {
    headers: {
      Authorization: getToken() ?? '',
    },
  }).then(async (r) => {
    if (r.ok) {
      return r.json();
    } else {
      const error: any = new Error('Error occurred while fetching the data.');
      error.status = r.status;
      try {
        error.info = r.json();
      } catch (e) {
        error.info = 'Error getting error info';
      }
      throw error;
    }
  });

export async function post(path: string, data: any) {
  try {
    const response = await fetch(apiJoin(path), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken() ?? '',
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return {
      success:
        response.status === 200 || response.status === 201 || json?.success,
      ...json,
    };
  } catch (e) {
    return { success: false };
  }
}

export async function postFile(file: any) {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('filename', file.name);
    const response = await fetch(apiJoin('files'), {
      method: 'POST',
      headers: {
        Authorization: getToken() ?? '',
      },
      body: formData,
    });
    const json = await response.json();
    return {
      success:
        response.status === 200 || response.status === 201 || json?.success,
      ...json,
    };
  } catch (e) {
    return { success: false };
  }
}

export async function put(path: string, data: any) {
  try {
    const response = await fetch(apiJoin(path), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken() ?? '',
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return { success: response.status === 200 || json?.success, ...json };
  } catch (e) {
    return { success: false };
  }
}

export async function update(path: string, data: any) {
  try {
    const response = await fetch(apiJoin(path), {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken() ?? '',
      },
      body: JSON.stringify(data),
    });
    const json = await response.json();
    return { success: response.status === 200 || json?.success, ...json };
  } catch (e) {
    return { success: false };
  }
}

export async function del(path: string, data?: any) {
  try {
    const params: RequestInit = {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: getToken() ?? '',
      },
    };

    if (data) {
      params.body = JSON.stringify(data);
    }

    const response = await fetch(apiJoin(path), params);
    const json = await response.json();
    return { success: response.status === 200, ...json };
  } catch (e) {
    return { success: false };
  }
}
