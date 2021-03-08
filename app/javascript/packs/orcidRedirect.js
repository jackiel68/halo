console.log("Authorization code: " + gon.authorization_code);

fetch(`https://${process.env.ORCID_URL}/oauth/token`,
  {
    method: 'POST',
    body: JSON.stringify({
      client_id: process.env.ORCID_CLIENT_ID,
      client_secret: process.env.ORCID_CLIENT_SECRET,
      grant_type: 'authorization_code',
      code: gon.authorization_code,
    }),
    headers: {
      'Accept': 'application/json',
    },
    mode: 'no-cors',
  })
.then((response) => response.json())
.then((json) => console.log(json))
.catch((err) => {
  console.log("Error");
  // window.close();
});
