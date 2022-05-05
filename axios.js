import axios from 'axios';
import { config } from 'dotenv';
config();

const instance = axios.create({
  headers: {
    Accept: 'application/json',
    Authorization: `Bearer ${process.env.BEARERTOKEN}`,
  },
});

export default instance;
