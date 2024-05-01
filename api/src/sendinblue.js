const fetch = require("node-fetch");

const { SENDINBLUE_API_KEY } = require("./config");

//https://my.sendinblue.com/lists/add-attributes

const api = async (path, options = {}) => {
  const res = await fetch(`https://api.sendinblue.com/v3${path}`, {
    ...options,
    headers: {
      "api-key": SENDINBLUE_API_KEY,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!res.ok) throw res;
  const contentType = res.headers.raw()["content-type"];

  if (contentType && contentType.length && contentType[0].includes("application/json")) {
    return await res.json();
  }

  return await res.text();
};

function splitEmailAndName(email) {
  // format : "name, email"
  const regex = /(.*), (.*)/;
  const match = email.match(regex);
  if (match) {
    return { name: match[1], email: match[match.length - 1] };
  }
  return { email };
}

// https://developers.sendinblue.com/reference#sendtransacemail
async function sendEmail(htmlContent, { subject, sender, emailTo = [], attachment = null, params = null, tags = [], cc = [], replyTo }) {
  const body = { to: emailTo.map((email) => splitEmailAndName(email)), sender, htmlContent, subject };
  if (params) body.params = params;
  if (attachment) body.attachment = attachment;
  if (tags.length) body.tags = tags;
  if (cc.length) body.cc = cc.map((email) => splitEmailAndName(email));
  if (replyTo) body.replyTo = { email: replyTo };
  const response = await api("/smtp/email", { method: "POST", body: JSON.stringify(body) });

  return response;
}

// https://developers.sendinblue.com/reference#sendtransacemail
async function sendTemplate(id, { params, emailTo, cc, bcc, attachment } = {}) {
  // try {
  const body = { templateId: parseInt(id) };
  if (emailTo) body.to = emailTo.map((email) => ({ email }));
  if (cc?.length) body.cc = cc;
  if (bcc?.length) body.bcc = bcc;
  if (params) body.params = params;
  if (attachment) body.attachment = attachment;
  const mail = await api("/smtp/email", { method: "POST", body: JSON.stringify(body) });
  return mail;
  // } catch (e) {
  //   console.log("Erreur in sendTemplate", e);
  //   capture(e);
  // }
}

/**
 * https://api.sendinblue.com/v3/contacts
 * @param email {string}
 * @param attributes {object}
 * @param emailBlacklisted {boolean}
 * @param smsBlacklisted {boolean}
 * @param listIds {integer[]}
 * @param updateEnabled {boolean}
 * @param smtpBlacklistSender {string[]}
 * @returns {Promise<void>}
 */
async function createContact({ email, attributes, emailBlacklisted, smsBlacklisted, listIds, updateEnabled, smtpBlacklistSender } = {}) {
  const body = {
    email,
    attributes,
    emailBlacklisted,
    smsBlacklisted,
    listIds,
    updateEnabled,
    smtpBlacklistSender,
  };

  return await api("/contacts", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/**
 * https://developers.sendinblue.com/reference#deletecontact
 * @param id {string|number} Email (urlencoded) OR ID of the contact
 * @returns {Promise<void>}
 */
async function deleteContact(id) {
  const identifier = typeof id === "string" ? encodeURIComponent(id) : id;

  return await api(`/contacts/${identifier}`, {
    method: "DELETE",
  });
}

/**
 * https://developers.sendinblue.com/reference#updatecontact
 * @param id {string|number} Email (urlencoded) OR ID of the contact
 * @param attributes {object}
 * @param emailBlacklisted {boolean}
 * @param smsBlacklisted {boolean}
 * @param listIds {integer[]}
 * @param unlinkListIds {integer[]}
 * @param smtpBlacklistSender {string[]}
 * @returns {Promise<void>}
 */
async function updateContact(id, { attributes, emailBlacklisted, smsBlacklisted, listIds, unlinkListIds, smtpBlacklistSender } = {}) {
  const identifier = typeof id === "string" ? encodeURIComponent(id) : id;

  const body = {
    attributes,
    emailBlacklisted,
    smsBlacklisted,
    listIds,
    unlinkListIds,
    smtpBlacklistSender,
  };

  return await api(`/contacts/${identifier}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

async function sync(obj, type) {
  // if (process.env.NODE_ENV !== "production") return;

  try {
    const user = JSON.parse(JSON.stringify(obj));

    if (!user) {
      console.log("ERROR WITH ", obj);
    }

    const email = user.email;

    const attributes = {};
    for (let i = 0; i < Object.keys(user).length; i++) {
      const key = Object.keys(user)[i];
      if (key.indexOf("_at") !== -1) {
        if (user[key]) {
          if (typeof user[key] === "string") {
            attributes[key.toUpperCase()] = user[key].slice(0, 10);
          } else {
            console.log("WRONG", user[key]);
          }
        }
      } else {
        attributes[key.toUpperCase()] = user[key];
      }
    }

    // TO CHANGE
    attributes.FIRSTNAME && (attributes.PRENOM = attributes.FIRSTNAME);
    attributes.LASTNAME && (attributes.NOM = attributes.LASTNAME);
    attributes.TYPE = type.toUpperCase();
    attributes.REGISTRED = !!attributes.REGISTRED_AT;

    let listIds = attributes.TYPE === "USER" ? [8] : [20];

    delete attributes.EMAIL;
    delete attributes.PASSWORD;
    delete attributes.__V;
    delete attributes._ID;
    delete attributes.LASTNAME;
    delete attributes.FIRSTNAME;

    const ok = await updateContact(email, { attributes, listIds });
    if (!ok) await createContact({ email, attributes, listIds });
  } catch (e) {
    console.log("error", e);
  }
}

async function unsync(obj) {
  try {
    await deleteContact(obj.email);
  } catch (e) {
    console.log("Can't delete in sendinblue", obj.email);
  }
}

module.exports = { sync, unsync, sendEmail, sendTemplate, createContact, updateContact, deleteContact };
