const shortlistTemplate = (candidateName, jobTitle, companyName) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #1a1a2e; padding: 2rem; text-align: center;">
    <h1 style="color: white; margin: 0;">Congratulations!</h1>
  </div>
  <div style="padding: 2rem; background: #f9f9f9;">
    <p style="font-size: 1.1rem;">Dear <strong>${candidateName}</strong>,</p>
    <p>We are pleased to inform you that you have been <strong style="color: #2e7d32;">shortlisted</strong> for the position of:</p>
    <div style="background: white; border-left: 4px solid #2e7d32; padding: 1rem; margin: 1.5rem 0; border-radius: 4px;">
      <h2 style="margin: 0; color: #1a1a2e;">${jobTitle}</h2>
      <p style="margin: 0.3rem 0 0; color: #666;">${companyName}</p>
    </div>
    <p>Our HR team will be in touch shortly with the next steps.</p>
    <p style="color: #666;">Best regards,<br/><strong>HR Team — ${companyName}</strong></p>
  </div>
  <div style="background: #1a1a2e; padding: 1rem; text-align: center;">
    <p style="color: #888; font-size: 0.8rem; margin: 0;">This is an automated message from the ATS Portal</p>
  </div>
</div>
`;

const interviewTemplate = (candidateName, jobTitle, date, time, message, companyName) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #0f3460; padding: 2rem; text-align: center;">
    <h1 style="color: white; margin: 0;">Interview Scheduled</h1>
  </div>
  <div style="padding: 2rem; background: #f9f9f9;">
    <p style="font-size: 1.1rem;">Dear <strong>${candidateName}</strong>,</p>
    <p>You have been invited for an interview for the position of <strong>${jobTitle}</strong>.</p>
    <div style="background: white; border-left: 4px solid #0f3460; padding: 1rem; margin: 1.5rem 0; border-radius: 4px;">
      <p style="margin: 0 0 0.5rem;"><strong>Date:</strong> ${date}</p>
      <p style="margin: 0 0 0.5rem;"><strong>Time:</strong> ${time}</p>
      <p style="margin: 0;"><strong>Position:</strong> ${jobTitle}</p>
    </div>
    ${message ? `<div style="background: #e3f2fd; padding: 1rem; border-radius: 4px; margin-bottom: 1rem;"><p style="margin: 0;"><strong>Message from HR:</strong></p><p style="margin: 0.5rem 0 0;">${message}</p></div>` : ''}
    <p>Please confirm your attendance by replying to this email.</p>
    <p style="color: #666;">Best regards,<br/><strong>HR Team — ${companyName}</strong></p>
  </div>
  <div style="background: #0f3460; padding: 1rem; text-align: center;">
    <p style="color: #888; font-size: 0.8rem; margin: 0;">This is an automated message from the ATS Portal</p>
  </div>
</div>
`;

const rejectionTemplate = (candidateName, jobTitle, companyName) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #1a1a2e; padding: 2rem; text-align: center;">
    <h1 style="color: white; margin: 0;">Application Update</h1>
  </div>
  <div style="padding: 2rem; background: #f9f9f9;">
    <p style="font-size: 1.1rem;">Dear <strong>${candidateName}</strong>,</p>
    <p>Thank you for applying for the position of <strong>${jobTitle}</strong> at ${companyName}.</p>
    <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
    <div style="background: white; border-left: 4px solid #c62828; padding: 1rem; margin: 1.5rem 0; border-radius: 4px;">
      <p style="margin: 0; color: #555;">We appreciate the time you invested and encourage you to apply for future openings.</p>
    </div>
    <p>We wish you all the best in your job search.</p>
    <p style="color: #666;">Best regards,<br/><strong>HR Team — ${companyName}</strong></p>
  </div>
  <div style="background: #1a1a2e; padding: 1rem; text-align: center;">
    <p style="color: #888; font-size: 0.8rem; margin: 0;">This is an automated message from the ATS Portal</p>
  </div>
</div>
`;

const customTemplate = (candidateName, message, companyName) => `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <div style="background-color: #533483; padding: 2rem; text-align: center;">
    <h1 style="color: white; margin: 0;">Message from HR</h1>
  </div>
  <div style="padding: 2rem; background: #f9f9f9;">
    <p style="font-size: 1.1rem;">Dear <strong>${candidateName}</strong>,</p>
    <div style="background: white; border-left: 4px solid #533483; padding: 1rem; margin: 1.5rem 0; border-radius: 4px;">
      <p style="margin: 0; line-height: 1.6;">${message}</p>
    </div>
    <p style="color: #666;">Best regards,<br/><strong>HR Team — ${companyName}</strong></p>
  </div>
  <div style="background: #533483; padding: 1rem; text-align: center;">
    <p style="color: #888; font-size: 0.8rem; margin: 0;">This is an automated message from the ATS Portal</p>
  </div>
</div>
`;

module.exports = { shortlistTemplate, interviewTemplate, rejectionTemplate, customTemplate };
