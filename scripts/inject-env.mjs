// Gera src/js/data/env.js a partir de variáveis de ambiente.
// Roda no build da Vercel e em `npm run dev` localmente.
// Localmente: crie .env.local (formato CHAVE=valor). No Vercel, use Settings > Environment Variables.
import fs from 'node:fs';

if (fs.existsSync('.env.local')) {
  for (const l of fs.readFileSync('.env.local', 'utf8').split('\n')) {
    const m = l.match(/^\s*([A-Z0-9_]+)\s*=\s*"?([^"\n]*)"?\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2];
  }
}

const cartoKey = (process.env.CARTO_API_KEY || '').trim();
if (!cartoKey) {
  console.warn('Aviso: CARTO_API_KEY não definida. Os tiles CARTO vão funcionar com limitações de taxa e sem chave de acesso.');
}

fs.writeFileSync(
  'src/js/data/env.js',
  '// Gerado por scripts/inject-env.mjs. Não edite: o valor vem de CARTO_API_KEY.\nconst ENV = ' + JSON.stringify({ cartoKey }) + ';\n'
);

console.log('src/js/data/env.js gerado (' + (cartoKey ? 'chave CARTO presente' : 'sem chave CARTO — modo demo') + ').');
