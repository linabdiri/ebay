import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.log('Usage: node hashPassword.js <ton_mot_de_passe>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\n✅ Copie cette ligne dans ton fichier .env :\n');
console.log(`ADMIN_PASSWORD_HASH=${hash}\n`);