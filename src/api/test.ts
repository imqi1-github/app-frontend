export const testApi = async (): Promise<boolean> => {
  return (await fetch(import.meta.env.VITE_API_URL)).ok;
}