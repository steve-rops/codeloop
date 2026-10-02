import { Resend } from "resend";
import { CONTACT_EMAIL } from "./site";

const FROM = "codeloop <no-reply@forms.codeloop.gr>";

type Submission = {
  subject: string;
  /** The visitor's address, so replying to the notification reaches them. */
  replyTo: string;
  text: string;
};

/**
 * Delivers a form submission to the studio inbox.
 *
 * Reports failure instead of throwing, so the actions can hand the form a
 * state it knows how to render. The client is built per call because the
 * constructor throws without RESEND_API_KEY, and that belongs in the same
 * failure path rather than at module load.
 */
export async function sendSubmission({
  subject,
  replyTo,
  text,
}: Submission): Promise<boolean> {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({
      from: FROM,
      to: CONTACT_EMAIL,
      replyTo,
      // Subjects are built from user input; keep them on one line.
      subject: subject.replace(/\s+/g, " "),
      text,
    });

    if (error) {
      console.error("[mail]", error);
      return false;
    }
    return true;
  } catch (error) {
    console.error("[mail]", error);
    return false;
  }
}
