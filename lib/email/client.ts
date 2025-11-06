import { Resend } from 'resend'

// Lazy initialization of Resend client
let resendClient: Resend | null = null

function getClient(): Resend {
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

// Export with getter for backward compatibility
export const resend = {
  get emails() {
    return getClient().emails
  }
}