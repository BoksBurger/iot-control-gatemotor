const http = require("http");
const fs = require("fs");
let counter = 0;
let tap = "00000";
/* UNCOMMENT NEXT LINE IN PRODUCTION */
//const Gpio = require("onoff").Gpio;
/* UNCOMMENT NEXT LINE IN PRODUCTION */
//let led = new Gpio(21, "out");

const app = http.createServer((req, res) => {
  if (req.method === "GET") {
    //console.log(req.url);
    switch (req.url) {
      case "/":
        res.write(fs.readFileSync("./index.html"));
        res.end();
        break;
        case "/skin":
        res.write(fs.readFileSync("./styles.css"));
        res.end();
        break;
        case "/ui":
        res.write(fs.readFileSync("./ui.js"));
        res.end();
        break;

      default:
        res.end("Ooops! That don't look right.");
        break;
    }
  }
  if (req.method === "POST") {
    switch (req.url) {
      case "/click":
        let params = "";
        res.setHeader("Content-Type", "application/json");
        req.on("data", (data) => {
          params += data;
        });
        req.on("end", () => {
          let parsed;
          try {
            parsed = JSON.parse(params);
          } catch (err) {
            res.statusCode = 400;
            res.end(
              JSON.stringify({
                error: "Something went wrong",
              })
            );
          }
          if (parsed.password) {
            if (parsed.password === "9183") {
              tapper(4);
              res.statusCode = 201;
              res.end(
                JSON.stringify({
                  status: "success",
                  tap,
                })
              );
            }
            if (parsed.password === tap) {
              openGate();
              res.statusCode = 200;
              res.end(
                JSON.stringify({
                  status: "success",
                })
              );
            } else {
              res.statusCode = 403;
              res.end(
                JSON.stringify({
                  status: "Access denied",
                })
              );
            }
          }
        });
        break;

      default:
        res.setHeader("Content-Type", "application/json");
        res.statusCode = 403;
        res.end(
          JSON.stringify({
            status: "access denied",
          })
        );
        break;
    }
  }
});

app.listen(3000, () => {
  console.log("Listening...");
});

function openGate() {
  blink();
  //click once
  function blink() {
    /* UNCOMMENT NEXT LINE IN PRODUCTION */
    //led.writeSync(1);
    setTimeout(() => {
      counter++;
      /* UNCOMMENT NEXT LINE IN PRODUCTION */
      //led.writeSync(0);
    }, 1000);
  }
}

function tapper(digits) {
  tap = Math.random().toString().substr(2, digits);
}
