export const getFollowedMessage = (name, small) => {
  let mess;

  if (!small) {
    mess = `@${name} Thank you for the follow! Hope to see you #keepupthegoodwork & working on your #100DaysOfCode challenge again`;
  } else {
    mess = `@${name} Thank you!. Hope to see you #keepupthegoodwork & working on your #100DaysOfCode challenge again.`;
  }

  if (mess.length > 144) {
    getFollowedMessage(name, true);
  }
  return mess;
}
