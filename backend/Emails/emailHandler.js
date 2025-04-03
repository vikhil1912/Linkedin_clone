import { client, sender } from "../lib/mailtrap.js";
import {
  createWelcomeEmailTemplate,
  createCommentNotificationEmailTemplate,
} from "./emailTemplates.js";

export const sendWelcomeEmail = async (name, sendWelcomeEmail, profileUrl) => {
  try {
    const recipients = [
      {
        email: "vikhil1912@gmail.com",
      },
    ];
    client.send({
      from: sender,
      to: recipients,
      subject: "You are awesome!",
      html: createWelcomeEmailTemplate(name, profileUrl),
      category: "Welcome Email",
    });
  } catch (error) {
    throw error;
  }
};

export const sendCommentNotificationEmail = async (
  recipientName,
  commenterName,
  postUrl,
  content
) => {
  try {
    const recipients = [
      {
        email: "vikhil1912@gmail.com",
      },
    ];
    client.send({
      from: sender,
      to: recipients,
      subject: "New comment on your post",
      html: createCommentNotificationEmailTemplate(
        recipientName,
        commenterName,
        postUrl,
        content
      ),
      category: "comment_notification",
    });
    console.log("comment email sent successfully");
  } catch (error) {
    throw error;
  }
};
