import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

if (process.env.NODE_ENV === 'production' && !process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET es obligatorio en producción.');
}

export const JWT_SECRET = process.env.JWT_SECRET || 'mi_clave_secreta_arservicios';
