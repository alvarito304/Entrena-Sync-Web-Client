const {
  API_URL
} = process.env;


export const environment = {
  production: true,
  apiUrl: API_URL || 'http://localhost',
}
