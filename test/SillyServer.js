const express = require("express");

const server = express();

server.get("/:id?", (req, res) => {
  res.send(`<!DOCTYPE html>
<html>
    <head>
        <title>Silly Server</title>
    </head>
    <body style="display:flex;flex-direction:column;justify-content:center;align-items:center;width:100vw;height:100vh;margin:0;padding:0;font-family:arial;">
        <h1 style="margin:0;padding:0;font-size:33vh;">${req.params.id}</h1>
        <p style="margin:0;padding:0;font-size:0.75rem;">${new Date().toLocaleTimeString()}</p>
    </body>
</html>`);
});

server.listen(3030, () => console.log("Listening on port 3030"));
