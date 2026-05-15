export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  // Esto recibe los datos limpios desde el formulario
  const { email, nombre, telefono, unique_id, nombre_grupo } = req.body;
  
  // Esto jala la clave secreta desde Vercel de forma segura
  const apiKey = process.env.BREVO_API_KEY;

  try {
    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        email: email,
        attributes: {
          NOMBRE_COMPLETO: nombre,
          TELEFONO: telefono,
          UNIQUE_ID: unique_id,
          NOMBRE_GRUPO: nombre_grupo
        },
        listIds: [130], // <-- CAMBIA ESTE NÚMERO por el ID de tu lista en Brevo
        updateEnabled: true 
      })
    });

    if (response.ok) {
      return res.status(200).json({ message: '¡Inscripción exitosa!' });
    } else {
      const errorData = await response.json();
      return res.status(400).json(errorData);
    }
  } catch (error) {
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}