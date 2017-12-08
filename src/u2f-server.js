import u2f from "u2f";

const APP_ID = "https://localhost:3000/";

export const registration = (req, res) => {
  // 1. Check that the user is logged in.

  // 2. Generate a registration request and save it in the session.
  const registrationRequest = u2f.request(APP_ID);
  req.session.registrationRequest = registrationRequest;

  // 3. Send the registration request to the client, who will use the Javascript U2F API to sign
  // the registration request, and send it back to the server for verification. The registration
  // request is a JSON object containing properties used by the client to sign the request.
  return res.send(registrationRequest);
};

export const checkRegistration = (req, res) => {
  // 4. Verify the registration response from the client against the registration request saved
  // in the server-side session.

  const enroll = JSON.parse(req.body["enroll-data"]);
  const data = JSON.parse(req.body.data);

  const result = u2f.checkRegistration(req.session.registrationRequest, data);

  if (result.successful) {
    // Success!
    // Save result.publicKey and result.keyHandle to the server-side datastore, associated with
    // this user.
    return res.sendStatus(200);
  }

  // result.errorMessage is defined with an English-language description of the error.
  return res.send({ result });
};
