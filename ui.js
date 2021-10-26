let gateButton = document.getElementById("gateButton");
let lblMessage = document.getElementById("lblMessage");
let lblSubMessage = document.getElementById("lblSubMessage");
let pw = document.getElementById("password");
let pwText = "VOER PIN HIER IN";
let tansOop = false;

reset();
function reset() {
  pw.className = "";
  pw.value = "";
  pinUI();
  gateButton.innerHTML = "ONTSPER";
  gateButton.className = "hide";
  lblMessage.innerHTML = "Hello.";
  lblSubMessage.innerHTML = "Welkom buite die hek.";
}

pinUI();
function pinUI() {
  if (pw.value === "") {
    pw.setAttribute("type", "text");
    pw.value = pwText;
  }
}

pw.addEventListener("focus", () => {
  pw.value = "";
  pw.setAttribute("type", "number");
});
pw.addEventListener("blur", pinUI);
pw.addEventListener("keypress", () => {
  setTimeout(() => {
    if (pw.value.length === 4) {
      sendSignal();
    }
  }, 100);
});

function doTheShake(cssClass = "aandag") {
  pw.className = (cssClass + " shake-it").trim();
  setTimeout(() => {
    pw.value = "";
    pw.className = cssClass;
  }, 1000);
}

function sendSignal() {
  if (pw.value === pwText || pw.value === "") {
    return;
  }
  let currentAction = gateButton.innerHTML;
  let http = new XMLHttpRequest();
  let url = "/click";
  let params = JSON.stringify({
    open: true,
    password: pw.value,
  });

  if (pw.value !== "") {
    http.open("POST", url, true);
    //Send the proper header information along with the request
    http.setRequestHeader("Content-type", "application/json");
    http.onreadystatechange = function () {
      //Call a function when the state changes.
      if (http.readyState === 4 && http.status === 200) {
        tansOop = !tansOop;
        lblMessage.innerHTML = tansOop ? "Welkom." : "Welkom.";
        lblMessage.className = "welkom";
        pw.className = "hide";
        lblSubMessage.innerHTML = `Die hek maak ${tansOop ? "oop" : "toe"}`;
        setTimeout(() => {
          lblSubMessage.innerHTML = "Mi casa, you casa!";
        }, 3000);
        gateButton.innerHTML =
          "<img src='https://c.tenor.com/5o2p0tH5LFQAAAAi/hug.gif' style='width:32px'>";
        gateButton.className = "disabled";
        gateButton.setAttribute("disabled", "true");
        setTimeout(() => {
          gateButton.className = "enabled";
          gateButton.removeAttribute("disabled");
          gateButton.innerHTML = "MAAK TOE";
          if (currentAction === "MAAK TOE") {
            reset();
          }
        }, 16000);
      } else if (http.readyState === 4 && http.status === 201) {
        let tap = JSON.parse(http.response)?.tap;
        lblMessage.innerHTML = tap;
        lblSubMessage.innerHTML = "nuwe kode gegenereer";
        doTheShake("");
      } else if (http.readyState === 4 && http.status === 403) {
        {
          lblMessage.innerHTML = "TOEGANG GEWEIER";
          lblSubMessage.innerHTML = "pin kode verkeerd";
          doTheShake();
        }
      }
    };
    http.send(params);
  } else {
    lblSubMessage.innerHTML = "Geen wagwoord ontvang.";
  }
}
gateButton.addEventListener("click", sendSignal);