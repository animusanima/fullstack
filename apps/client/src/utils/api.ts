export const api = {
  test: async () => {
    const response = await fetch("http://localhost:5000");
    const data: unknown = await response.json();
    console.log({ data });
    return data;
  }
};