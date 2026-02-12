import { env } from '../config/env';

export interface InviteEmail {
  to: string;
  inviteUrl: string;
  role: string;
}

/**
 * Stub mailer for MVP - logs invite URL to console
 */
export async function sendInviteEmail(data: InviteEmail): Promise<void> {
  console.log('=================================');
  console.log('📧 INVITE EMAIL (STUB)');
  console.log('=================================');
  console.log(`To: ${data.to}`);
  console.log(`Role: ${data.role}`);
  console.log(`Invite URL: ${data.inviteUrl}`);
  console.log('=================================');
}

export function buildInviteUrl(token: string): string {
  return `${env.FRONTEND_ORIGIN}/accept-invite?token=${token}`;
}

