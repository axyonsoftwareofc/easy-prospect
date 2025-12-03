const fs = require('fs');

console.log('Verificando estrutura após build...');

// Verifica se .next existe
if (fs.existsSync('.next')) {
  console.log('✅ .next/ existe');

  // Verifica conteúdo
  const files = fs.readdirSync('.next');
  console.log('Conteúdo de .next/:', files);

  // Verifica se tem static
  if (fs.existsSync('.next/static')) {
    console.log('✅ .next/static/ existe');
  }

  // Verifica se tem server
  if (fs.existsSync('.next/server')) {
    console.log('✅ .next/server/ existe');
  }
} else {
  console.log('❌ .next/ NÃO existe');
}