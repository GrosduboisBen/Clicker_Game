var golds = 0;
var clickLevel = 1;
var gps = 0;
var minGPS;
var perMinGPS;
var state = 0;

var minions = [
    { id: 1, name: "Portable miner", upgrade_v1: 50, upgrade_v2: 2000, upgrade1: "MinerMk1", upgrade2: "MinerMk2", multv1: 10, multv2: 20, cost: 10, gps: 0.1, owned: 0 },
    { id: 2, name: "Biomass burner", upgrade_v1: 30, upgrade_v2: 500, upgrade1: "Coal Generator", upgrade2: "Fuel Generator", multv1: 5, multv2: 10, cost: 100, gps: 0.5, owned: 0 },
    { id: 3, name: "Craft Bench", upgrade_v1: 10, upgrade_v2: 100, upgrade1: "Constructor", upgrade2: "Assembler", multv1: 2, multv2: 8, cost: 500, gps: 1.5, owned: 0 },
    { id: 4, name: "Smelter", upgrade_v1: 5, upgrade1: "Foundry", multv1: 2, cost: 250000, gps: 80, owned: 0 },
    { id: 5, name: "Space Elevator", cost: 200000000, gps: 30000, owned: 0 }

];
golds = Number(localStorage.getItem("golds"));
clickLevel = Number(localStorage.getItem("clickLevel"));
var min_size = minions.length;
var Uo = new Array(min_size);

//----------------------SET SECTION-------------------------//
function setClick() {
    if (localStorage.getItem("clickLevel") == undefined) {
        localStorage.setItem("clickLevel", clickLevel);
    }
}
function setGolds() {
    if (localStorage.getItem("golds") == undefined) {
        localStorage.setItem("golds", golds);
    }
}
function setUo() {
    if (localStorage.getItem('Owned') == undefined) {
        for (var i = 0; i < min_size; i++) {
            Uo[i] = 0;
        }
        localStorage.setItem('Owned', JSON.stringify(Uo));
    }
}

function setAll() {
    setClick();
    setGolds();
    setUo();
}

//------------------------SAVE AND LOADS SECTION----------------------------------------------//
function saveGolds() {
    localStorage.setItem("golds", golds);
}

function saveUo() {
    var I = 0;
    var Owned = loadUo();
    for (var line of minions) {
        Owned[I] += line.owned;
        I++;
        line.owned = 0;
    }
    localStorage.setItem('Owned', JSON.stringify(Owned));
}

function saveClick() {
    localStorage.setItem("clickLevel", clickLevel);
}

function loadUo() {
    var Load = [];
    var item = JSON.parse(localStorage['Owned']);
    for (var i = 0; i < min_size; i++) {
        Load.push(item[i]);
    }
    return (Load);
}
//--------------------------------------------------------//

function roundIt(x) {
    return (Math.round(x * 1e2) / 1e2);
}

function buyMinion(id) {              // Permet d'acheter des Minions
    var price = 0;
    var difference = 0;
    for (var line of minions) {
        if (line.id == id) {
            price = getPrice(id);
            if (golds >= price) {
                golds -= price;
                line.owned++;
            } else {
                difference = price - golds;
                difference = roundIt(difference);
                window.alert("Pas assez de gold. Il te manque : " + difference)
            }
        }
    }
    saveUo();
    getGPS();
}

function getPrice(id) {
    var price = 0;
    var Owned = loadUo();
    var i = 0;
    for (var line of minions) {
        if (line.id == id) {
            price = line.cost * Math.pow(1.05, Owned[i]);
        }
        i++;
    }
    price = roundIt(price);
    return (price);
}

function getGPS() {                   // Permet de savoir de combien de GPS on dispose
    gps = 0;
    var Owned = loadUo();
    var i = 0;
    for (var line of minions) {
        if (Owned[i] >= line.upgrade_v2) {         // Si on a upgrade 2
            gps += Owned[i] * (line.gps * line.multv2);
        } else if (Owned[i] >= line.upgrade_v1) {   // Sinon, si on a upgrade 1
            gps += Owned[i] * (line.gps * line.multv1);
        } else if (Owned[i] >= 1) {     // Sinon, si on a, au moins, 1 minion de ce type (x1)
            gps += Owned[i] * line.gps;
        } i++;
    }
    gps = roundIt(gps);
}

function minionGPS(id) {                   // Permet de savoir de combien de GPS on dispose
    minGPS = 0;
    var Owned = loadUo();
    var i = 0;
    for (var line of minions) {
        if (line.id == id) {
            if (Owned[i] >= line.upgrade_v2) {         // Si on a upgrade 2
                minGPS = Owned[i] * (line.gps * line.multv2);
            } else if (Owned[i] >= line.upgrade_v1) {   // Sinon, si on a upgrade 1
                minGPS = Owned[i] * (line.gps * line.multv1);
            } else if (Owned[i] >= 1) {     // Sinon, si on a, au moins, 1 minion de ce type (x1)
                minGPS = Owned[i] * line.gps;
            }
        } i++;
    }
    minGPS = roundIt(minGPS);
    return (minGPS);
}
function perMinionGPS(id) {                   // Permet de savoir de combien de GPS on dispose
    perMinGPS = 0;
    var Owned = loadUo();
    var i = 0;
    for (var line of minions) {
        if (line.id == id) {
            if (Owned[i] >= line.upgrade_v2) {         // Si on a upgrade 2
                perMinGPS = (line.gps * line.multv2);
            } else if (Owned[i] >= line.upgrade_v1) {   // Sinon, si on a upgrade 1
                perMinGPS = (line.gps * line.multv1);
            } else if (Owned[i] >= 1) {     // Sinon, si on a, au moins, 1 minion de ce type (x1)
                perMinGPS = line.gps;
            }
        } i++;
    }
    perMinGPS = roundIt(perMinGPS);
    return (perMinGPS);
}

function addGold(x) {                 // Permet d'ajouter x gold(s) au total de golds
    golds += x;
}

function getClick() {                 // Permet de savoir le niveau de chaque click
    var total = nbMinions();
    if (total >= 50) {
        clickLevel = Math.pow(2, ((total - (total % 50)) / 50));
    } else {
        clickLevel = 1;
    }
    saveClick();
}

function clickFarm() {                // Permet de calculer la valeur de chaque click en fonction du niveau
    getClick();
    addGold(clickLevel);
}

function nbMinions() {                // Permet de calculer le nombre total de minions
    var total = 0;
    var Owned = loadUo();
    for (var i = 0; i < min_size; i++) {
        total += Owned[i];
    }
    return (total);
}

function startGPS() {                 // Permet de lancer la production automatique de GPS
    getGPS();
    setInterval(function () {
        getGPS();
        if (state == 0) {
            addGold(gps);
        }
    }, 1000)
}

function initialDisplay() {           // Initialise l'affichage du GPS et des Golds
    setAll();
    displayGold();
    displayGPS();
    displayShop();
    displayOwned();
    startGPS();
}

function displayGold() {
    var print = document.getElementById('gold');


    getClick();
    setInterval(function () {
        golds = roundIt(golds);
        print.innerHTML = golds;
        saveGolds();
    }, 50);
}

function displayGPS() {
    var print = document.getElementById('gps');
    getGPS();
    setInterval(function () {
        gps = roundIt(gps);
        print.innerHTML = gps;
    }, 50);
}

function displayShop() {
    var container = document.getElementById('shop');
    var buttons = new Array(minions.length);

    var i = 0;

    var p1 = new Array(minions.length);
    var p2 = new Array(minions.length);
    var p3 = new Array(minions.length);

    var div = new Array(minions.lenght);

    for (var line of minions) {
        div[i] = document.createElement("div");
        p1[i] = document.createElement("p");
        p1[i].innerHTML = "Name : " + line.name;
        p1[i].setAttribute("class", "s_top");
        div[i].appendChild(p1[i]);
        p2[i] = document.createElement("p");
        p2[i].innerHTML = "Golds / s : " + perMinionGPS(line.id);
        p2[i].setAttribute("class", "s_mid");
        div[i].appendChild(p2[i]);
        p3[i] = document.createElement("p");
        p3[i].innerHTML = "Price : " + getPrice(line.id);
        p3[i].setAttribute("class", "s_bot");
        div[i].appendChild(p3[i]);
        div[i].setAttribute("onclick", "buyMinion(" + line.id + ")")
        container.appendChild(div[i]);
        i++;
    }

    setInterval(function () {
        i = 0;
        for (var line of minions) {
            p1[i].innerHTML = "Name : " + line.name;
            p2[i].innerHTML = "Golds / s : " + perMinionGPS(line.id);
            p3[i].innerHTML = "Price : " + getPrice(line.id);
            i++;
        }
    }, 50);
}

function getUpgrade(id, name) {
    var Owned = loadUo();
    var str = name;
    var i = 0;
    for (var line of minions) {
        if (line.id == id) {
            if (Owned[i] >= line.upgrade_v1) {

                str = line.upgrade1;
            }
            if (Owned[i] >= line.upgrade_v2) {

                str = line.upgrade2;
            }
        } i++;
    }
    return str;
}
function displayOwned() {
    var Owned = loadUo();

    var container = document.getElementById('owned');

    var p1 = new Array(minions.length);
    var p2 = new Array(minions.length);
    var p3 = new Array(minions.length);

    var i = 0;
    var div = new Array(minions.lenght);

    for (var line of minions) {
        div[i] = document.createElement("div");
        p1[i] = document.createElement("p");
        p1[i].innerHTML = "Name : " + line.name;
        div[i].appendChild(p1[i]);
        p2[i] = document.createElement("p");
        p2[i].innerHTML = "Quantity : " + Owned[i];
        div[i].appendChild(p2[i]);
        p3[i] = document.createElement("p");
        p3[i].innerHTML = "Golds / s : " + minionGPS(line.id);
        div[i].appendChild(p3[i]);
        container.appendChild(div[i]);
        i++;
    }

    setInterval(function () {
        var Owned = loadUo();
        i = 0;
        for (var line of minions) {
            p1[i].innerHTML = "Name : " + getUpgrade(line.id, line.name);
            p2[i].innerHTML = "Quantity : " + Owned[i];
            p3[i].innerHTML = "Golds / s : " + minionGPS(line.id);
            i++;
        }
    }, 50);
}

function changeState() {
    console.log(state);
    var status = document.getElementById('production');
    if (state == 0) {
        status.innerHTML = "production stoped";
        status.style.color = "white";
        status.style.backgroundColor = "#FF0000";
        status.setAttribute("title", "Production stoped. Click to start production");
        state = 1;
    } else {
        status.innerHTML = "production started";
        status.style.color = "black";
        status.style.backgroundColor = "#4ADD00"
        status.setAttribute("title", "Production launched. Lay down, take a break, come back later.");
        state = 0;
    }
}

function resetUser() {
    var conf = window.confirm("Are you sure ?")
    if (conf) {
      golds = 0;
      clickLevel = 1;
      gps = 0;
      minGPS;
      perMinGPS;
      state = 0;
      var i = 0;
      var Owned = loadUo();
      for (var line of minions){
          Owned[i] = 0;
          i++;
      }
      localStorage.setItem('Owned', JSON.stringify(Owned));
    }
}
