/**
 * AgentFlow — Circle Entity Secret Generator
 * 
 * Generates a 32-byte entity secret, encrypts it with Circle's
 * RSA public key, registers it, and saves to .env.local.
 * 
 * Fully automated — no user input needed.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '.env.local');

function loadEnv() {
  if (!fs.existsSync(envPath)) return {};
  const content = fs.readFileSync(envPath, 'utf-8');
  const vars = {};
  content.split('\n').forEach(line => {
    const match = line.match(/^([^#=]+)=(.+)$/);
    if (match) vars[match[1].trim()] = match[2].trim();
  });
  return vars;
}

function saveEntitySecret(secret) {
  let content = fs.readFileSync(envPath, 'utf-8');
  if (content.includes('CIRCLE_ENTITY_SECRET=')) {
    content = content.replace(/CIRCLE_ENTITY_SECRET=.*/, `CIRCLE_ENTITY_SECRET=${secret}`);
  } else {
    content += `\nCIRCLE_ENTITY_SECRET=${secret}\n`;
  }
  fs.writeFileSync(envPath, content);
}

async function main() {
  const env = loadEnv();
  
  // Skip if entity secret already exists
  if (env.CIRCLE_ENTITY_SECRET && env.CIRCLE_ENTITY_SECRET.length >= 32) {
    console.log('  Entity secret already configured - skipping.');
    return;
  }

  const apiKey = env.CIRCLE_API_KEY;
  if (!apiKey) {
    console.log('  No Circle API key - skipping entity secret.');
    return;
  }

  // Generate 32-byte secret
  const entitySecret = crypto.randomBytes(32).toString('hex');
  console.log('  Generated 32-byte entity secret.');

  // Try to fetch public key and register
  try {
    const pkRes = await fetch('https://api.circle.com/v1/w3s/config/entity/publicKey', {
      headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    });

    if (pkRes.ok) {
      const pkData = await pkRes.json();
      const publicKeyPem = pkData.data?.publicKey;

      if (publicKeyPem) {
        // Encrypt
        const encrypted = crypto.publicEncrypt(
          { key: publicKeyPem, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
          Buffer.from(entitySecret, 'hex')
        );
        const ciphertext = encrypted.toString('base64');

        // Register
        const regRes = await fetch('https://api.circle.com/v1/w3s/config/entity/entitySecret', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ entitySecretCiphertext: ciphertext }),
        });

        if (regRes.ok || regRes.status === 409) {
          console.log('  Entity secret registered with Circle.');
        } else {
          console.log('  Could not register with Circle (will work in demo mode).');
        }
      }
    } else {
      console.log('  Could not reach Circle API (will work in demo mode).');
    }
  } catch (err) {
    console.log('  Circle API unreachable (will work in demo mode).');
  }

  // Always save locally
  saveEntitySecret(entitySecret);
  console.log('  Entity secret saved to .env.local');
}

main().catch(() => {
  console.log('  Entity secret setup skipped (will work in demo mode).');
});
