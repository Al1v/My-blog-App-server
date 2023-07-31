import { join } from 'path';
import { hostname } from 'os';

export default function getFileUrl(file) {
  return join(__dirname, '..', '..', 'uploads', file.filename);
}
