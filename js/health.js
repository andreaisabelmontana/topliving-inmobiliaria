/* ============================================================
   Live health & metrics simulation for /health page
   Mirrors what the Flask /health and /metrics endpoints emit.
   ============================================================ */

const startedAt = Date.now();

function rand(min, max) { return Math.random() * (max - min) + min; }
function fmtUptime(ms) {
    const s = Math.floor(ms/1000), h = Math.floor(s/3600), m = Math.floor((s%3600)/60);
    return `${h}h ${m}m ${s%60}s`;
}

let totalReq    = 12483;
let total5xx    = 17;
let latencyHist = Array.from({length: 30}, () => rand(80, 160));

function tick() {
    const newReq = Math.floor(rand(2, 9));
    totalReq += newReq;
    if (Math.random() < 0.04) total5xx += 1;

    latencyHist.shift();
    latencyHist.push(rand(70, 220));

    document.getElementById("m-uptime").textContent  = fmtUptime(Date.now() - startedAt + 1000*60*60*36);
    document.getElementById("m-requests").textContent = totalReq.toLocaleString();
    document.getElementById("m-rps").textContent      = (newReq).toFixed(0);
    document.getElementById("m-latency").textContent  = `${latencyHist[latencyHist.length-1].toFixed(0)} ms`;
    document.getElementById("m-errors").textContent   = total5xx.toString();
    document.getElementById("m-errorRate").textContent = ((total5xx/totalReq)*100).toFixed(2) + "%";

    drawSpark();
}

function drawSpark() {
    const c = document.getElementById("spark");
    if (!c) return;
    const ctx = c.getContext("2d");
    const W = c.width = c.clientWidth;
    const H = c.height = 80;
    ctx.clearRect(0,0,W,H);
    const max = Math.max(...latencyHist);
    const min = Math.min(...latencyHist);
    const range = max - min || 1;
    ctx.strokeStyle = "#C8102E";
    ctx.lineWidth = 2;
    ctx.beginPath();
    latencyHist.forEach((v,i) => {
        const x = (i/(latencyHist.length-1)) * W;
        const y = H - ((v-min)/range)*(H-8) - 4;
        i ? ctx.lineTo(x,y) : ctx.moveTo(x,y);
    });
    ctx.stroke();
}

document.addEventListener("DOMContentLoaded", () => {
    if (!document.getElementById("m-uptime")) return;
    tick();
    setInterval(tick, 2000);
});
