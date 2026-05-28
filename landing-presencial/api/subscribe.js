import https from 'https';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { email, nombre, telefono, unique_id, nombre_grupo } = req.body;
  const apiKey = process.env.BREVO_API_KEY;

  const datosBrevo = JSON.stringify({
    email: email,
    attributes: {
      NOMBRE_COMPLETO: nombre,
      TELEFONO: telefono,
      UNIQUE_ID: unique_id,
      NOMBRE_GRUPO: nombre_grupo
    },
    listIds: [133], // ID ESPECÍFICO DO EVENTO PRESENCIAL
    updateEnabled: true
  });

  const opciones = {
    hostname: 'api.brevo.com',
    port: 443,
    path: '/v3/contacts',
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': apiKey,
      'Content-Length': Buffer.byteLength(datosBrevo)
    }
  };

  return new Promise((resolve) => {
    const request = https.request(opciones, (response) => {
      let dados = '';
      response.on('data', (chunk) => { dados += chunk; });
      response.on('end', () => {
        if (response.statusCode >= 200 && response.statusCode < 300) {
          res.status(200).json({ message: '¡Inscripción exitosa!' });
          resolve();
        } else {
          res.status(response.statusCode).json({ error: dados });
          resolve();
        }
      });
    });

    request.on('error', (error) => {
      res.status(500).json({ error: error.message });
      resolve();
    });

    request.write(datosBrevo);
    request.end();
  });
}