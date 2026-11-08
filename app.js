(() => {
  "use strict";
  const $ = (id) => document.getElementById(id);
  const DecimalCtor = window.Decimal;
  if (!DecimalCtor) {
    $("numberDisplay").textContent = "Number engine failed to load";
    $("milestoneText").textContent = "Check your internet connection and reload.";
    return;
  }
  const D = (value) => new DecimalCtor(value);
  const SAVE_KEY = "incremental-demo-save-v1";
  const upgrades = [
    {id:"click", name:"Stronger clicks", desc:"+1 base click power per level", base:10, scale:1.65, effect:"click"},
    {id:"generator", name:"Number generator", desc:"Adds numbers automatically", base:25, scale:1.8, effect:"generator"},
    {id:"multiplier", name:"Power multiplier", desc:"Multiplies all number gain", base:150, scale:2.25, effect:"multiplier"}
  ];
  const googolplex = DecimalCtor.pow(10, DecimalCtor.pow(10, 100));
  const powerTower = DecimalCtor.pow(10, DecimalCtor.pow(10, 1000));
  const milestones = [
    {name:"One thousand", value:D("1e3"), label:"10³"},
    {name:"One million", value:D("1e6"), label:"10⁶"},
    {name:"One billion", value:D("1e9"), label:"10⁹"},
    {name:"Googol", value:D("1e100"), label:"10¹⁰⁰"},
    {name:"Googolplex", value:googolplex, label:"10^(10¹⁰⁰)"},
    {name:"Power tower", value:powerTower, label:"10^(10¹⁰⁰⁰)"},
    {name:"Graham-scale territory", value:null, label:"Beyond ordinary power towers"},
    {name:"TREE(3) concept", value:null, label:"Combinatorial landmark"},
    {name:"Rayo's number concept", value:null, label:"Definability landmark"},
    {name:"ω / ordinal infinity", value:null, label:"Ordinal concept"},
    {name:"Absolute infinity", value:null, label:"Fictional endgame concept"}
  ];
  let state = {
    number:D(0), clickPower:D(1), generator:D(0), multiplier:D(1),
    rebirths:0, levels:{click:0,generator:0,multiplier:0}, speed:1
  };
  let lastTick = Date.now();
  const fmt = (n) => {
    if (n.lt(1000)) return n.toFixed(0);
    try { return n.toString(); } catch (_) { return String(n); }
  };
  const costFor = (u) => D(u.base).mul(D(u.scale).pow(state.levels[u.id]));
  const gainMultiplier = () => state.multiplier.mul(D(1 + state.rebirths * 0.5));
  function render() {
    $("numberDisplay").textContent = fmt(state.number);
    $("rateDisplay").textContent = "+" + fmt(state.generator.mul(gainMultiplier()).mul(state.speed)) + " per second";
    $("rebirthPower").textContent = "×" + (1 + state.rebirths * 0.5).toFixed(2);
    const logValue = state.number.log10();
    const gain = Math.min(1000000, Math.max(1, Math.floor(logValue.div(6).toNumber())));
    $("rebirthGain").textContent = state.number.gte(1e6) ? "+" + gain : "0";
    $("rebirthButton").disabled = state.number.lt(1e6);
    const next = milestones.find(m => m.value && state.number.lt(m.value));
    $("milestoneText").textContent = next ? "Next milestone: " + next.name + " (" + next.label + ")" : "You've passed the listed finite milestones!";
    $("upgradeList").innerHTML = "";
    upgrades.forEach(u => {
      const cost = costFor(u);
      const row = document.createElement("div");
      row.className = "upgrade";
      const info = document.createElement("div");
      const title = document.createElement("h3");
      title.textContent = u.name + " · Lv. " + state.levels[u.id];
      const desc = document.createElement("p");
      desc.textContent = u.desc + " · Cost: " + fmt(cost);
      info.append(title, desc);
      const button = document.createElement("button");
      button.className = "buy-button";
      button.type = "button";
      button.textContent = "Buy";
      button.disabled = state.number.lt(cost);
      button.addEventListener("click", () => buy(u));
      row.append(info, button);
      $("upgradeList").append(row);
    });
    $("milestoneList").innerHTML = "";
    milestones.forEach(m => {
      const unlocked = m.value ? state.number.gte(m.value) : false;
      const item = document.createElement("div");
      item.className = "milestone-item" + (unlocked ? " unlocked" : "");
      const title = document.createElement("strong");
      title.textContent = m.name;
      const detail = document.createElement("span");
      detail.textContent = unlocked ? "UNLOCKED · " + m.label : (m.value ? "Locked · " + m.label : "Concept milestone · locked");
      item.append(title, detail);
      $("milestoneList").append(item);
    });
  }
  function buy(u) {
    const cost = costFor(u);
    if (state.number.lt(cost)) return;
    state.number = state.number.sub(cost);
    state.levels[u.id]++;
    if (u.effect === "click") state.clickPower = state.clickPower.add(1);
    if (u.effect === "generator") state.generator = state.generator.add(1);
    if (u.effect === "multiplier") state.multiplier = state.multiplier.mul(2);
    render();
  }
  $("clickButton").addEventListener("click", () => {
    state.number = state.number.add(state.clickPower.mul(gainMultiplier()).mul(state.speed));
    render();
  });
  $("speed").addEventListener("change", e => { state.speed = Number(e.target.value) || 1; render(); });
  $("rebirthButton").addEventListener("click", () => {
    if (state.number.lt(1e6)) return;
    const gain = Math.min(1000000, Math.max(1, Math.floor(state.number.log10().div(6).toNumber())));
    state.rebirths += gain;
    state.number = D(0); state.clickPower = D(1); state.generator = D(0); state.multiplier = D(1);
    state.levels = {click:0,generator:0,multiplier:0};
    render(); save();
  });
  function save() {
    const data = {
      number:state.number.toString(), clickPower:state.clickPower.toString(),
      generator:state.generator.toString(), multiplier:state.multiplier.toString(),
      rebirths:state.rebirths, levels:state.levels, speed:state.speed
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    $("saveButton").textContent = "Saved!";
    setTimeout(() => $("saveButton").textContent = "Save", 1100);
  }
  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
      if (!data) return;
      state.number=D(data.number); state.clickPower=D(data.clickPower);
      state.generator=D(data.generator); state.multiplier=D(data.multiplier);
      state.rebirths=Number(data.rebirths)||0;
      state.levels=Object.assign(state.levels,data.levels||{});
      state.speed=Number(data.speed)||1;
      $("speed").value=String(state.speed);
    } catch (_) { /* Ignore an invalid local save and start fresh. */ }
  }
  $("saveButton").addEventListener("click", save);
  const audio = $("music");
  const tracks = {
    "assets/UntitledTrack01.m4a":"Untitled Track 01",
    "assets/UntitledTrack02.mp3":"Untitled Track 02"
  };
  function setTrack(src, autoplay) {
    audio.src = src;
    $("musicStatus").textContent = "Selected · " + tracks[src];
    $("playButton").textContent = "Play";
    if (autoplay) audio.play().then(() => $("playButton").textContent="Pause").catch(() => {
      $("musicStatus").textContent = "Tap Play to start · " + tracks[src];
    });
  }
  $("trackSelect").addEventListener("change", e => setTrack(e.target.value, false));
  $("playButton").addEventListener("click", () => {
    if (audio.paused) {
      audio.play().then(() => $("playButton").textContent="Pause").catch(() => {
        $("musicStatus").textContent = "Playback couldn't start. Check the audio file and try again.";
      });
    } else { audio.pause(); $("playButton").textContent="Play"; }
  });
  audio.addEventListener("ended", () => $("playButton").textContent="Play");
  $("volume").addEventListener("input", e => audio.volume = Number(e.target.value));
  audio.volume = 0.65;
  load(); setTrack($("trackSelect").value, false); render();
  setInterval(() => {
    const now = Date.now();
    const elapsed = Math.min(2, (now-lastTick)/1000);
    lastTick = now;
    if (state.generator.gt(0)) {
      state.number = state.number.add(state.generator.mul(gainMultiplier()).mul(elapsed).mul(state.speed));
      render();
    }
  }, 250);
  setInterval(save, 15000);
  window.addEventListener("beforeunload", save);
})();
