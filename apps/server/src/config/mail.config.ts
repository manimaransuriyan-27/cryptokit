import nodemailer from 'nodemailer';
import { env } from '@/config/env.config';

const { MAILTRAP_HOST, MAILTRAP_PORT, MAILTRAP_USER, MAILTRAP_PASS } = env;

export const transporter = nodemailer.createTransport({
  host: MAILTRAP_HOST,
  port: Number(MAILTRAP_PORT),
  secure: false,
  auth: {
    user: MAILTRAP_USER,
    pass: MAILTRAP_PASS,
  },
});
