function escapeRegExp(str = "") {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function createTemplateFromHtml(html, user) {
  let templated = html;
  console.log("user: ", user);

  const fullName = `${user.firstName} ${user.lastName}`.trim();

  const scalarMapping = {
    [fullName]: "[[fullName]]",
    [user.firstName]: "[[firstName]]",
    [user.lastName]: "[[lastName]]",
    [user.email]: "[[email]]",
    [user.mobileNumber]: "[[mobileNumber]]",
    [user.address]: "[[address]]",
    [user.portfolio]: "[[portfolio]]",
    [user.summary]: "[[summary]]",
  };

  Object.entries(scalarMapping)
    .filter(([value]) => !!value)
    .sort((a, b) => b[0].length - a[0].length)
    .forEach(([value, placeholder]) => {
      const regex = new RegExp(escapeRegExp(value), "g");
      templated = templated.replace(regex, placeholder);
    });

  if (user.email) {
    const mailtoValue = `mailto:${user.email}`;
    const regex = new RegExp(escapeRegExp(mailtoValue), "g");
    templated = templated.replace(regex, "mailto:[[email]]");
  }

  return templated;
}

module.exports = createTemplateFromHtml;
