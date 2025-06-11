const fs = require('fs');

console.log('🔧 Generando environment.prod.ts...');

const envContent = `export const environment = {
  production: true,
  apiUrl: '${process.env.API_URL || 'http://localhost'}',
  apiKey: '${process.env.API_KEY || ''}',
  databaseUrl: '${process.env.DATABASE_URL || ''}'
};
`;

fs.writeFileSync('./environments/environment.ts', envContent);
console.log('✅ Environment generado correctamente');
