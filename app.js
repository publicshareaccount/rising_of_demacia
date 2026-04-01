const i18n = {
    ko: {
        sub: "Balanced Growth System",
        score: "Balanced Score",
        ratio: "목표 비율 및 병목",
        base: "Base Yield",
        json: "BUILDING DICTIONARY",
        sync: "데이터 동기화",
        inspector: "City Inspector",
        select: "도시를 선택하세요",
        hero: "영웅",
        types: { "수도": "수도", "국경": "국경", "산간": "산간", "중심지": "중심지" },
        builds: ["비어있음", "제재소", "채석장", "대장간", "농장", "제련소", "학술원", "시장", "병영", "성소", "왕실무기고", "듀란드의공방", "민병대", "망루", "칼날부리사육장"],
        heroes: ["없음", "뽀삐", "갈리오", "모르가나", "케일", "가렌", "소나", "퀸", "자르반"],
        fmtBuild: (k, v) => `${k}${v > 1 ? v : ""}`
    },
    en: {
        sub: "Balanced Growth System",
        score: "Balanced Score",
        ratio: "Target Ratio & Bottleneck",
        base: "Base Yield",
        json: "JSON Editor",
        sync: "Sync Data",
        inspector: "City Inspector",
        select: "Select a city",
        hero: "Hero",
        types: { "수도": "Capital", "국경": "Border", "산간": "Mountain", "중심지": "Hub" },
        builds: ["EMPTY", "LUMBER", "QUARRY", "FORGE", "FARM", "PET.MILL", "ACADEMY", "MARKETPLACE", "BARRACKS", "SHRINE", "ARMORY", "DURAND", "MILITIA", "WATCHTOWER", "RAPTORS.CAMP"],
        heroes: ["NONE", "Poppy", "Galio", "Morgana", "Kayle", "Garen", "Sona", "Quinn", "Jarvan"],
        fmtBuild: (k, v) => `${v > 1 ? v : ""} ${k}`
    }
};

let cityMap = {
    "포스배로우": "FOSSBARROW",
    "호크스톤": "HAWKSTONE",
    "피나라": "PINARA",
    "하이 실버미어": "HIGH SILVERMERE",
    "유웬데일": "UWENDALE",
    "멜트리지": "MELTRIDGE",
    "위대한 도시": "DEMACIA",
    "잔델": "JANDELLE",
    "클라우드필드": "CLOUDFIELD",
    "틸번": "TYLBURNE",
    "헤이니스": "HAYNEATH",
    "바스카시아": "VASKASIA",
    "브룩할로우": "BROOKHOLLOW",
    "테르비시아": "TERBISIA",
    "이븐무어": "EVENMOOR",
    "던홀드": "DAWNHOLD"
};

let cityMapEnToKo = Object.fromEntries(Object.entries(cityMap).map(([ko, en]) => [en, ko]));

let currentLang = "ko";
let currentPatchVersion = "26.5";

let cityCoords = { "포스배로우": [0, 0], "호크스톤": [0, 1], "피나라": [1, 0], "하이 실버미어": [1, 1], "유웬데일": [0, 2], "멜트리지": [1, 3], "위대한 도시": [2, 1], "잔델": [2, 2], "클라우드필드": [2, 4], "틸번": [3, 2], "헤이니스": [3, 3], "바스카시아": [4, 2], "브룩할로우": [4, 3], "테르비시아": [4, 4], "이븐무어": [5, 2], "던홀드": [4, 0] };
let cityInfo = { "포스배로우": { "type": "국경", "adj": ["피나라", "하이 실버미어"] }, "호크스톤": { "type": "산간", "adj": ["하이 실버미어", "유웬데일"] }, "유웬데일": { "type": "산간", "adj": ["호크스톤", "하이 실버미어", "멜트리지"] }, "피나라": { "type": "산간", "adj": ["포스배로우", "하이 실버미어", "던홀드"] }, "하이 실버미어": { "type": "산간", "adj": ["포스배로우", "호크스톤", "유웬데일", "피나라", "위대한 도시", "잔델"] }, "멜트리지": { "type": "국경", "adj": ["유웬데일", "잔델"] }, "위대한 도시": { "type": "수도", "adj": ["하이 실버미어", "던홀드", "틸번"] }, "잔델": { "type": "중심지", "adj": ["하이 실버미어", "멜트리지", "클라우드필드", "헤이니스", "틸번"] }, "클라우드필드": { "type": "국경", "adj": ["잔델", "헤이니스", "테르비시아"] }, "틸번": { "type": "중심지", "adj": ["위대한 도시", "잔델", "브룩할로우"] }, "헤이니스": { "type": "중심지", "adj": ["잔델", "클라우드필드"] }, "바스카시아": { "type": "중심지", "adj": ["던홀드", "브룩할로우", "이븐무어"] }, "브룩할로우": { "type": "중심지", "adj": ["틸번", "바스카시아", "이븐무어", "테르비시아"] }, "테르비시아": { "type": "국경", "adj": ["브룩할로우", "클라우드필드"] }, "이븐무어": { "type": "산간", "adj": ["바스카시아", "브룩할로우"] }, "던홀드": { "type": "국경", "adj": ["피나라", "위대한 도시", "바스카시아"] } };
const buildingList = ["비어있음", "제재소", "채석장", "대장간", "농장", "제련소", "학술원", "시장", "병영", "성소", "왕실무기고", "듀란드의공방", "민병대", "망루", "칼날부리사육장"];
const heroList = ["없음", "뽀삐", "갈리오", "모르가나", "케일", "가렌", "소나", "퀸", "자르반"];
const typeColors = { "수도": "#a855f7", "국경": "#ef4444", "산간": "#f59e0b", "중심지": "#10b981" };
const resColors = { w: "#10b981", s: "#f59e0b", m: "#ef4444", f: "#fbbf24", p: "#a855f7" };
let defaultBaseConfig = { w: 150, s: 100, m: 50, f: 5 };

let currentBuilds = {};
let svg, g;

let city_builds = `city_builds = {
    "포스배로우": ["대장간", "학술원", "학술원", "학술원", "학술원", "학술원", "없음"],
    "호크스톤": ["채석장", "학술원", "학술원", "학술원", "학술원", "학술원", "없음"],
    "유웬데일": ["채석장", "채석장", "채석장", "학술원", "학술원", "학술원", "없음"],
    "피나라": ["채석장", "학술원", "학술원", "학술원", "학술원", "학술원", "없음"],
    "하이 실버미어": ["채석장", "제련소", "제련소", "제련소", "제련소", "제련소", "없음"],
    "멜트리지": ["대장간", "대장간", "대장간", "대장간", "대장간", "대장간", "뽀삐"],
    "위대한 도시": ["병영", "시장", "시장", "시장", "시장", "시장", "없음"],
    "잔델": ["시장", "시장", "시장", "시장", "시장", "시장", "없음"],
    "클라우드필드": ["대장간", "대장간", "대장간", "대장간", "대장간", "대장간", "소나"],
    "틸번": ["제재소", "제재소", "제재소", "제재소", "제재소", "제재소", "가렌"],
    "헤이니스": ["농장", "농장", "농장", "성소", "왕실무기고", "듀란드의공방", "없음"],
    "바스카시아": ["제재소", "제재소", "제재소", "제재소", "제재소", "제재소", "갈리오"],
    "브룩할로우": ["시장", "시장", "시장", "시장", "시장", "시장", "없음"],
    "테르비시아": ["대장간", "대장간", "대장간", "대장간", "대장간", "대장간", "모르가나"],
    "이븐무어": ["채석장", "채석장", "채석장", "채석장", "채석장", "채석장", "케일"],
    "던홀드": ["대장간", "학술원", "학술원", "학술원", "학술원", "학술원", "없음"]
}`;

function addAdjBoth(a, b) {
    if (!cityInfo[a] || !cityInfo[b]) return;
    if (!cityInfo[a].adj.includes(b)) cityInfo[a].adj.push(b);
    if (!cityInfo[b].adj.includes(a)) cityInfo[b].adj.push(a);
}

function applyVersion(version) {
    currentPatchVersion = version;
    if (version !== "26.7") return;
    cityMap["브렌 토르"] = "BRENNTOR";
    cityMap["회색 관문"] = "THEGRAYGATE";
    cityMap["림베일"] = "WRIMVALE";
    cityMap["렌월"] = "WRENWALL";
    cityMapEnToKo = Object.fromEntries(Object.entries(cityMap).map(([ko, en]) => [en, ko]));

    cityCoords["브렌 토르"] = [0, 4];
    cityCoords["회색 관문"] = [1, 4];
    cityCoords["림베일"] = [3, 5];
    cityCoords["렌월"] = [5, 4];

    if (!cityInfo["브렌 토르"]) cityInfo["브렌 토르"] = { type: "산간", adj: [] };
    if (!cityInfo["회색 관문"]) cityInfo["회색 관문"] = { type: "중심지", adj: [] };
    if (!cityInfo["림베일"]) cityInfo["림베일"] = { type: "국경", adj: [] };
    if (!cityInfo["렌월"]) cityInfo["렌월"] = { type: "산간", adj: [] };

    city_builds = `city_builds = {
    "포스배로우": ["대장간", "학술원", "학술원", "학술원", "학술원", "학술원", "없음"],
    "호크스톤": ["채석장", "학술원", "학술원", "학술원", "학술원", "학술원", "없음"],
    "유웬데일": ["채석장", "채석장", "채석장", "학술원", "학술원", "학술원", "없음"],
    "피나라": ["채석장", "학술원", "학술원", "학술원", "학술원", "학술원", "없음"],
    "하이 실버미어": ["채석장", "제련소", "제련소", "제련소", "제련소", "제련소", "없음"],
    "멜트리지": ["대장간", "대장간", "대장간", "대장간", "대장간", "대장간", "뽀삐"],
    "위대한 도시": ["병영", "시장", "시장", "시장", "시장", "시장", "없음"],
    "잔델": ["시장", "시장", "시장", "시장", "시장", "시장", "없음"],
    "클라우드필드": ["대장간", "대장간", "대장간", "대장간", "대장간", "대장간", "소나"],
    "틸번": ["제재소", "제재소", "제재소", "제재소", "제재소", "제재소", "가렌"],
    "헤이니스": ["농장", "농장", "농장", "성소", "왕실무기고", "듀란드의공방", "없음"],
    "바스카시아": ["제재소", "제재소", "제재소", "제재소", "제재소", "제재소", "갈리오"],
    "브룩할로우": ["시장", "시장", "시장", "시장", "시장", "시장", "없음"],
    "테르비시아": ["대장간", "대장간", "대장간", "대장간", "대장간", "대장간", "모르가나"],
    "이븐무어": ["채석장", "채석장", "채석장", "채석장", "채석장", "채석장", "케일"],
    "던홀드": ["대장간", "학술원", "학술원", "학술원", "학술원", "학술원", "없음"],
    "브렌 토르": ["채석장", "채석장", "채석장", "채석장", "채석장", "채석장", "비어있음"],
    "회색 관문": ["제재소", "제재소", "제재소", "제재소", "제재소", "제재소", "자르반"],
    "림베일": ["대장간", "대장간", "대장간", "대장간", "대장간", "대장간", "퀸"],
    "렌월": ["채석장", "채석장", "채석장", "채석장", "채석장", "채석장", "비어있음"]
}`

    addAdjBoth("브렌 토르", "회색 관문");
    addAdjBoth("회색 관문", "멜트리지");
    addAdjBoth("회색 관문", "클라우드필드");
    addAdjBoth("림베일", "클라우드필드");
    addAdjBoth("림베일", "테르비시아");
    addAdjBoth("렌월", "테르비시아");

    defaultBaseConfig = { w: 300, s: 200, m: 100, f: 6 };
}

function showVersionSelector() {
    const overlay = document.createElement("div");
    overlay.id = "version-selector";
    overlay.className = "fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center";
    overlay.innerHTML = `
        <div class="bg-slate-900 border border-slate-700 rounded-xl p-6 w-[320px] text-center shadow-2xl">
            <p class="text-xs text-slate-400 uppercase tracking-wider mb-2">Demacia Rising</p>
            <h2 class="text-lg font-black mb-5">Demacia City Level</h2>
            <div class="grid grid-cols-2 gap-3">
                <button id="btn-v265" class="py-2 rounded bg-slate-700 hover:bg-slate-600 font-bold">Level 4<br>(v26.5)</button>
                <button id="btn-v267" class="py-2 rounded bg-blue-600 hover:bg-blue-500 font-bold">Level 5<br>(v26.7)</button>
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    const selectVersion = (version) => {
        overlay.remove();
        applyVersion(version);
        bootApp();
    };

    document.getElementById("btn-v265").addEventListener("click", () => selectVersion("26.5"));
    document.getElementById("btn-v267").addEventListener("click", () => selectVersion("26.7"));
}

function getCityLabel(name) {
    if (currentLang === "en") {
        return cityMap[name] || name;
    }
    return name;
}

function getBuildLabel(key) {
    const idx = buildingList.indexOf(key);
    if (idx === -1) return key;
    return i18n[currentLang].builds[idx];
}

function getHeroLabel(key) {
    const idx = heroList.indexOf(key);
    if (idx === -1) return key;
    return i18n[currentLang].heroes[idx];
}

function normalizeBuildingName(name) {
    if (buildingList.includes(name)) return name;
    const enIdx = i18n.en.builds.indexOf(name);
    if (enIdx !== -1) return buildingList[enIdx];
    const koIdx = i18n.ko.builds.indexOf(name);
    if (koIdx !== -1) return buildingList[koIdx];
    return name;
}

function normalizeHeroName(name) {
    if (heroList.includes(name)) return name;
    const enIdx = i18n.en.heroes.indexOf(name);
    if (enIdx !== -1) return heroList[enIdx];
    const koIdx = i18n.ko.heroes.indexOf(name);
    if (koIdx !== -1) return heroList[koIdx];
    return name;
}

function refreshJsonEditorFromCurrentBuilds() {
    const lines = [];
    lines.push("city_builds = {");
    const cities = Object.keys(cityInfo);
    cities.forEach((koName, idx) => {
        const displayCity = currentLang === "en" ? (cityMap[koName] || koName) : koName;
        const builds = currentBuilds[koName] || Array(7).fill("비어있음");
        const displayArr = builds.map((b, i) => {
            if (i === 6) return getHeroLabel(b);
            return getBuildLabel(b);
        });
        const arrStr = displayArr.map(v => `"${v}"`).join(", ");
        const comma = idx === cities.length - 1 ? "" : ",";
        lines.push(`    "${displayCity}": [${arrStr}]${comma}`);
    });
    lines.push("}");
    document.getElementById("json-editor").value = lines.join("\n");
}

function localizeUI() {
    const pack = i18n[currentLang];
    document.getElementById("label-sub").innerText = pack.sub;
    document.getElementById("label-score").innerText = pack.score;
    document.getElementById("label-ratio").innerText = pack.ratio;
    document.getElementById("label-base").innerText = pack.base;
    document.getElementById("label-json").innerText = pack.json;
    document.getElementById("btn-sync").innerText = pack.sync;
    document.getElementById("label-inspector").innerText = pack.inspector;
    updateLangToggle();

    const selectedEl = document.getElementById("selected-name");
    const city = selectedEl.dataset.city;
    selectedEl.innerText = city ? getCityLabel(city) : pack.select;
    refreshJsonEditorFromCurrentBuilds();
}

function updateLangToggle() {
    const btn = document.getElementById("lang-toggle");
    if (!btn) return;
    if (currentLang === "ko") {
        btn.innerHTML = `
            <span class="font-semibold text-white">Korean</span>
            <span class="mx-1 text-slate-500">/</span>
            <span class="font-semibold text-slate-500">English</span>
        `;
    } else {
        btn.innerHTML = `
            <span class="font-semibold text-slate-500">Korean</span>
            <span class="mx-1 text-slate-500">/</span>
            <span class="font-semibold text-white">English</span>
        `;
    }
}

function updateMapLanguage() {
    if (!g) return;
    g.selectAll(".city-node").each(function (d) {
        const label = getCityLabel(d.id);
        d3.select(this).select(".city-label").text(label);
        d3.select(this).select(".hero-star").attr("dx", (label.length * 7.5) + 10);
    });
    localizeUI();
    const selectedEl = document.getElementById("selected-name");
    const city = selectedEl.dataset.city;
    if (city) {
        selectCity(city);
    }
    calculate();
}

function bootApp() {
    document.getElementById("cfg-w").value = defaultBaseConfig.w;
    document.getElementById("cfg-s").value = defaultBaseConfig.s;
    document.getElementById("cfg-m").value = defaultBaseConfig.m;
    document.getElementById("cfg-f").value = defaultBaseConfig.f;

    svg = d3.select("#network-map");
    g = svg.append("g");
    const zoom = d3.zoom().scaleExtent([0.1, 2.5]).on("zoom", (e) => g.attr("transform", e.transform));
    svg.call(zoom);
    document.getElementById("json-editor").value = city_builds
    applyDictionary();
    renderMap();
    calculate();

    document.getElementById("lang-toggle").addEventListener("click", () => {
        currentLang = currentLang === "ko" ? "en" : "ko";
        updateMapLanguage();
    });

    localizeUI();
    refreshJsonEditorFromCurrentBuilds();
}

function init() {
    showVersionSelector();
}

function renderMap() {
    const nodes = Object.keys(cityInfo).map(name => ({ id: name, type: cityInfo[name].type, y: cityCoords[name][0] * 135 + 80, x: cityCoords[name][1] * 240 + 100 }));
    const links = [];
    Object.keys(cityInfo).forEach(s => cityInfo[s].adj.forEach(t => {
        if (s < t) links.push({ x1: nodes.find(n => n.id === s).x, y1: nodes.find(n => n.id === s).y, x2: nodes.find(n => n.id === t).x, y2: nodes.find(n => n.id === t).y });
    }));
    g.selectAll("line").data(links).enter().append("line").attr("class", "link").attr("x1", d => d.x1).attr("y1", d => d.y1).attr("x2", d => d.x2).attr("y2", d => d.y2);
    const nodeG = g.selectAll(".city-node").data(nodes).enter().append("g").attr("class", "city-node").attr("transform", d => `translate(${d.x},${d.y})`).on("click", (e, d) => selectCity(d.id));
    nodeG.append("circle").attr("r", 18).attr("fill", d => typeColors[d.type]).attr("class", "node-circle shadow-2xl");
    nodeG.append("text").attr("class", "city-label").attr("dy", -30).attr("text-anchor", "middle").text(d => getCityLabel(d.id));
    nodeG.append("text").attr("class", "hero-star").attr("dy", -30);
    nodeG.append("text").attr("class", "build-info").attr("x", 25).attr("y", -8);
    nodeG.append("text").attr("class", "canvas-prod").attr("x", 25).attr("y", 10);
}

function applyDictionary() {
    try {
        const cleaned = document.getElementById("json-editor").value
            .replace(/city_builds\s*=\s*/, "")
            .replace(/'/g, '"')
            .replace(/,\s*}/g, "}")
            .replace(/,\s*\]/g, "]");
        const parsed = JSON.parse(cleaned);

        Object.keys(cityInfo).forEach(city => { currentBuilds[city] = Array(7).fill("비어있음"); });

        Object.entries(parsed).forEach(([key, arr]) => {
            const valueArr = Array.isArray(arr) ? arr : [];
            let koCity = key;
            if (!cityInfo[koCity] && cityMapEnToKo[key]) {
                koCity = cityMapEnToKo[key];
            }
            if (!cityInfo[koCity]) return;

            const normalized = [];
            for (let i = 0; i < 7; i++) {
                const raw = valueArr[i] || "비어있음";
                if (i === 6) {
                    normalized[i] = normalizeHeroName(raw);
                } else {
                    normalized[i] = normalizeBuildingName(raw);
                }
            }
            currentBuilds[koCity] = normalized;
        });

        calculate();
        refreshJsonEditorFromCurrentBuilds();
    } catch (e) {
        console.error("Data error");
    }
}

function selectCity(name) {
    const selectedEl = document.getElementById("selected-name");
    selectedEl.dataset.city = name;
    selectedEl.innerText = getCityLabel(name);
    const container = document.getElementById("editor-slots");
    container.innerHTML = "";
    const slots = currentBuilds[name] || Array(7).fill("비어있음");
    for (let i = 0; i < 6; i++) {
        container.innerHTML += `<select onchange="updateBuild('${name}', ${i}, this.value)" class="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs outline-none">${
            buildingList.map(t => {
                const label = getBuildLabel(t);
                return `<option value="${t}" ${t === slots[i] ? "selected" : ""}>${label}</option>`;
            }).join("")
        }</select>`;
    }
    container.innerHTML += `<div class="mt-2"><p class="text-[9px] text-blue-400 font-bold mb-1 uppercase">${i18n[currentLang].hero}</p><select onchange="updateBuild('${name}', 6, this.value)" class="w-full bg-slate-800 border border-slate-700 rounded p-1.5 text-xs outline-none">${
        heroList.map(h => {
            const label = getHeroLabel(h);
            return `<option value="${h}" ${slots[6] === h ? "selected" : ""}>${label}</option>`;
        }).join("")
    }</select></div>`;
    calculate();
}

function updateBuild(city, i, val) {
    currentBuilds[city][i] = val;
    calculate();
    refreshJsonEditorFromCurrentBuilds();
}

function calculate() {
    const cfg = {
        w: +document.getElementById("cfg-w").value,
        s: +document.getElementById("cfg-s").value,
        m: +document.getElementById("cfg-m").value,
        f: +document.getElementById("cfg-f").value,
        acad: 0.1,
        mkt: 0.1
    };
    const targets = {
        w: +document.getElementById("sc-w").value,
        s: +document.getElementById("sc-s").value,
        m: +document.getElementById("sc-m").value,
        p: +document.getElementById("sc-p").value
    };
    const acadBonusType = { "국경": 0, "산간": 0, "중심지": 0, "수도": 0 };
    Object.keys(currentBuilds).forEach(n => { acadBonusType[cityInfo[n].type] += (currentBuilds[n] || []).filter(b => b === "학술원").length * cfg.acad; });

    const totals = { w: 0, s: 0, m: 0, p: 0, f: 0 };
    const selectedName = document.getElementById("selected-name").innerText;

    Object.keys(cityInfo).forEach(name => {
        const info = cityInfo[name];
        const builds = currentBuilds[name] || Array(7).fill("비어있음");
        let mktB = 0;
        info.adj.forEach(a => { mktB += (currentBuilds[a] || []).filter(b => b === "시장").length * cfg.mkt; });
        const hasHero = heroList.includes(builds[6]) && builds[6] !== "없음";
        let mult = 1.0 + mktB + acadBonusType[info.type] + (hasHero ? 0.25 : 0);
        if (currentPatchVersion === "26.7" && (name === "피나라" || name === "위대한 도시" || name === "던홀드")) {
            mult += 0.15; // 26.7 전용 보너스
        }

        let cw = 0, cs = 0, cm = 0, cp = 0, cf = 0, qB = false, fB = false, fC = 0;
        builds.slice(0, 6).forEach(b => {
            if (b === "제재소") cw += cfg.w;
            else if (b === "채석장") { if (info.type === "산간" && !qB) { cs += (cfg.s * 2); qB = true; } else cs += cfg.s; }
            else if (b === "대장간") { if (info.type === "국경" && !fB) { cm += (cfg.m * 2); fB = true; } else cm += cfg.m; }
            else if (b === "농장") { if (info.type === "중심지" && fC < 2) { cf += (cfg.f + 1); fC++; } else cf += cfg.f; }
            else if (b === "제련소") cp += 3;
            else if (b === "듀란드의공방") cp += 1;
        });
        cw = cw * mult + (info.type === "중심지" ? cw * 0.25 : 0);
        cs *= mult;
        cm *= mult;
        cp = Math.floor(cp * mult);
        totals.w += cw;
        totals.s += cs;
        totals.m += cm;
        totals.p += cp;
        totals.f += cf;

        const node = g.selectAll(".city-node").filter(d => d.id === name);
        const bCounts = {};
        builds.slice(0, 6).filter(b => b !== "비어있음").forEach(b => {
            bCounts[b] = (bCounts[b] || 0) + 1;
        });
        const langPack = i18n[currentLang];
        const parts = Object.entries(bCounts).map(([k, v]) => {
            const label = getBuildLabel(k);
            return langPack.fmtBuild(label, v);
        });
        if (hasHero) {
            const heroLabel = getHeroLabel(builds[6]);
            parts.push(heroLabel);
        }
        node.select(".build-info").text(parts.join(", "));

        const prodLines = [];
        if (cw > 0) prodLines.push(`🪵${Math.round(cw)}`);
        if (cs > 0) prodLines.push(`🪨${Math.round(cs)}`);
        if (cm > 0) prodLines.push(`⚔️${Math.round(cm)}`);
        if (cp > 0) prodLines.push(`🧪${cp}`);
        if (cf > 0) prodLines.push(`🌾${cf}`);
        node.select(".canvas-prod").text(prodLines.join(" "));
        const cityLabel = getCityLabel(name);
        node.select(".hero-star").text(hasHero ? "★" : "").attr("dx", (cityLabel.length * 7.5) + 10);

        if (name === selectedName) {
            document.getElementById("local-output-display").innerHTML = `
                <div class="space-y-1">
                    <div class="flex justify-between text-xs"><span>🪵 Wood</span><span style="color:${resColors.w}">${Math.round(cw).toLocaleString()}</span></div>
                    <div class="flex justify-between text-xs"><span>🪨 Stone</span><span style="color:${resColors.s}">${Math.round(cs).toLocaleString()}</span></div>
                    <div class="flex justify-between text-xs"><span>⚔️ Metal</span><span style="color:${resColors.m}">${Math.round(cm).toLocaleString()}</span></div>
                    <div class="flex justify-between text-xs"><span>🧪 Petri</span><span style="color:${resColors.p}">${cp}</span></div>
                    <div class="flex justify-between text-xs"><span>🌾 Food</span><span style="color:${resColors.f}">${cf}</span></div>
                    <div class="mt-2 pt-2 border-t border-white/10 text-[10px] text-blue-400 font-bold">EFFICIENCY: x${mult.toFixed(2)}</div>
                </div>`;
        }
    });

    const caps = { w: totals.w / targets.w, s: totals.s / targets.s, m: totals.m / targets.m, p: totals.p / targets.p };
    const minCap = Math.min(caps.w, caps.s, caps.m, caps.p);
    document.getElementById("final-score").innerText = Math.floor(minCap).toLocaleString();

    Object.keys(caps).forEach(k => {
        const el = document.getElementById(`stat-${k}`);
        const ui = document.getElementById(`ui-${k}`);
        const isBottleneck = caps[k] === minCap;
        el.innerText = `Cap: ${Math.floor(caps[k]).toLocaleString()}`;
        if (isBottleneck) {
            ui.classList.add("bottleneck");
            el.classList.add("bottleneck-text");
            el.innerText += " (LOWEST)";
        } else {
            ui.classList.remove("bottleneck");
            el.classList.remove("bottleneck-text");
        }
    });

    const summary = [
        { l: "WOOD", v: Math.round(totals.w), c: resColors.w },
        { l: "STONE", v: Math.round(totals.s), c: resColors.s },
        { l: "METAL", v: Math.round(totals.m), c: resColors.m },
        { l: "PETRI", v: totals.p, c: resColors.p },
        { l: "FOOD", v: totals.f, c: resColors.f }
    ];
    document.getElementById("total-summary").innerHTML = summary.map(s => `<div class="res-card"><p class="text-[8px] font-black text-slate-500 uppercase">${s.l}</p><p class="text-lg font-black font-mono" style="color:${s.c}">${s.v.toLocaleString()}</p></div>`).join("");
}

window.onload = init;
