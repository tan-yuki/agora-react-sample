import axios from "axios";

const baseUrl = `${process.env.REACT_APP_API_SERVER_URL}/v1`;

export async function callGetApi<P, R>(path: string, params: P): Promise<R> {
  const response = await axios.get<R>(`${baseUrl}${path}`, {
    params,
  });

  return response.data;
}

export async function callPostApi<P, R>(path: string, params: P): Promise<R> {
  const response = await axios.post<R>(`${baseUrl}${path}`, params);

  return response.data;
}
