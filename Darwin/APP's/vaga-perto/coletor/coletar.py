#!/usr/bin/env python3
"""Coletor de vagas do Vaga Perto: Espírito Santo.

Lê as listagens públicas de Catho, InfoJobs e LinkedIn para o estado,
liga cada vaga ao município (código IBGE) e grava ofertas.js, que a
página carrega ao lado de municipios.js.

Uso: python3 coletar.py municipios.js ofertas.js
Requer: curl e beautifulsoup4 (pip install beautifulsoup4).
"""
import datetime as dt
import json
import random
import re
import subprocess
import sys
import time
import unicodedata
import urllib.parse

from bs4 import BeautifulSoup

UF = "ES"
UF_NOME = "Espírito Santo"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
MAX_DIAS = 45
FONTES = ["catho", "infojobs", "linkedin"]
HOJE = dt.datetime.now(dt.timezone(dt.timedelta(hours=-3))).date()


def log(*a):
    print(*a, file=sys.stderr, flush=True)


def norm(s):
    s = unicodedata.normalize("NFD", s or "")
    s = "".join(c for c in s if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9]+", " ", s.lower()).strip()


def get(url, tentativas=2, pausa=(1.0, 2.0), espera_429=0):
    for t in range(tentativas + 1):
        r = subprocess.run(
            ["curl", "-sL", "--compressed", "--max-time", "30", "-A", UA,
             "-H", "Accept-Language: pt-BR,pt;q=0.9", "-w", "\n%{http_code}", url],
            capture_output=True, text=True, errors="replace")
        body, _, code = r.stdout.rpartition("\n")
        time.sleep(random.uniform(*pausa))
        if code == "200":
            return body
        if code == "429" and espera_429 and t < tentativas:
            log(f"  429, esperando {espera_429 * (t + 1)}s")
            time.sleep(espera_429 * (t + 1))
            continue
        if code in ("403", "401", "429") or t == tentativas:
            log(f"  {code} {url}")
            return None
        time.sleep(4 * (t + 1))
    return None


def carregar_cidades(caminho):
    txt = open(caminho, encoding="utf-8").read()
    m = re.search(r'window\.VP_MUN=("(?:[^"\\]|\\.)*")', txt)
    cidades = {}
    for row in json.loads(m.group(1)).split(";"):
        cod, nome, uf, *_ = row.split("|")
        if uf == UF:
            cidades[norm(nome)] = int(cod)
    return cidades


class Mapa:
    def __init__(self, cidades):
        self.cidades = cidades
        self.falhas = {}

    def codigo(self, nome):
        n = re.sub(r"( e mais)? \d+ cidades?$", "", norm(nome))  # "Cariacica (+1 cidade)"
        if not n:
            return None
        if n in self.cidades:
            return self.cidades[n]
        self.falhas[n] = self.falhas.get(n, 0) + 1
        return None


def data_relativa(txt):
    t = norm(txt)
    if "hoje" in t:
        return HOJE
    if "ontem" in t:
        return HOJE - dt.timedelta(days=1)
    m = re.search(r"(\d{1,2})/(\d{1,2})(?:/(\d{4}))?", txt or "")
    if not m:
        return None
    d, mes, ano = int(m.group(1)), int(m.group(2)), int(m.group(3) or HOJE.year)
    try:
        r = dt.date(ano, mes, d)
    except ValueError:
        return None
    if r > HOJE + dt.timedelta(days=1):
        r = r.replace(year=r.year - 1)
    return r


def salario(txt):
    t = " ".join((txt or "").split())
    return "" if not t or "combinar" in t.lower() else t[:60]


def empresa_ok(txt):
    t = " ".join((txt or "").split())
    if not t or set(t) <= set("* ") or "confidencial" in t.lower():
        return ""
    return t[:80]


# ---------- Catho ----------
def catho(mapa):
    itens, vistos = [], set()
    for p in range(1, 101):
        html = get("https://www.catho.com.br/vagas/es/" + (f"?page={p}" if p > 1 else ""))
        if not html:
            break
        s = BeautifulSoup(html, "html.parser")
        novos = 0
        for a in s.select("article"):
            link = a.select_one("h2 a[href]")
            if not link:
                continue
            href = link["href"].split("?")[0]
            if not href.startswith("/vagas/") or href in vistos:
                continue
            vistos.add(href)
            novos += 1
            loc_icon = a.select_one(".i_job_location")
            loc = loc_icon.parent.get_text(" ", strip=True) if loc_icon else ""
            nome = loc.split(" - ", 1)[1] if " - " in loc else ""
            cod = mapa.codigo(re.split(r",|\(|/", nome)[0])
            if not cod:
                continue
            comp = a.select_one("p.mb-2 .text-12")
            sal = a.select_one(".i_salary")
            tag = a.select_one("span.tag")
            itens.append({
                "t": (link.get("title") or link.get_text(" ", strip=True))[:120],
                "e": empresa_ok(comp.get_text(" ", strip=True) if comp else ""),
                "c": cod,
                "s": salario(sal.parent.get_text(" ", strip=True) if sal else ""),
                "d": data_relativa(tag.get_text(" ", strip=True) if tag else ""),
                "f": 0,
                "u": href,
            })
        log(f"catho p{p}: {novos} novas")
        if novos == 0:
            break
    return itens


# ---------- InfoJobs ----------
def infojobs(mapa):
    itens, vistos = [], set()
    total_pag = 150
    for p in range(1, total_pag + 1):
        html = get("https://www.infojobs.com.br/vagas-de-emprego-em-espirito-santo.aspx" + (f"?Page={p}" if p > 1 else ""))
        if not html:
            break
        if p == 1:
            m = re.search(r"([\d.]+)\s+Vagas", html)
            if m:
                total_pag = min(total_pag, -(-int(m.group(1).replace(".", "")) // 20))
        s = BeautifulSoup(html, "html.parser")
        novos = 0
        for card in s.select("div.js_rowCard[data-href]"):
            href = card["data-href"].split("?")[0]
            if href in vistos:
                continue
            vistos.add(href)
            novos += 1
            loc = card.select_one("div.mb-8")
            loc = next(iter(loc.stripped_strings), "") if loc else ""
            m = re.match(r"(.+?)\s*-\s*([A-Z]{2})$", loc)
            if not m or m.group(2) != UF:
                continue
            cod = mapa.codigo(m.group(1))
            if not cod:
                continue
            titulo = card.select_one(".js_vacancyTitle")
            comp = card.select_one("div.d-flex.align-items-baseline > div.text-body")
            money = card.select_one("svg.icon-money")
            data = card.select_one(".js_date")
            d = None
            if data and data.get("data-value"):
                try:
                    d = dt.datetime.strptime(data["data-value"][:10], "%Y/%m/%d").date()
                except ValueError:
                    pass
            itens.append({
                "t": titulo.get_text(" ", strip=True)[:120] if titulo else "Vaga",
                "e": empresa_ok(comp.get_text(" ", strip=True) if comp else ""),
                "c": cod,
                "s": salario(money.parent.get_text(" ", strip=True) if money else ""),
                "d": d,
                "f": 1,
                "u": href,
            })
        log(f"infojobs p{p}/{total_pag}: {novos} novas")
        if novos == 0 or p >= total_pag:
            break
    return itens


# ---------- LinkedIn ----------
def linkedin(mapa):
    itens, vistos = [], set()
    loc = urllib.parse.quote(f"{UF_NOME}, Brasil")
    for start in range(0, 1000, 10):
        html = get(f"https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search?location={loc}&f_TPR=r2592000&start={start}",
                   pausa=(2.5, 4.0), espera_429=45)
        if not html or not html.strip():
            break
        s = BeautifulSoup(html, "html.parser")
        novos = 0
        for li in s.select("li"):
            base = li.select_one("[data-entity-urn]")
            m = re.search(r"(\d+)$", base["data-entity-urn"]) if base else None
            if not m or m.group(1) in vistos:
                continue
            vistos.add(m.group(1))
            novos += 1
            lugar = li.select_one(".job-search-card__location")
            lugar = lugar.get_text(" ", strip=True) if lugar else ""
            partes = [x.strip() for x in lugar.split(",")]
            if len(partes) < 2 or norm(partes[0]) in (norm(UF_NOME), "brasil"):
                continue  # só o estado, sem cidade
            cod = mapa.codigo(partes[0])
            if not cod:
                continue
            titulo = li.select_one(".base-search-card__title")
            comp = li.select_one(".base-search-card__subtitle")
            sal = li.select_one(".job-search-card__salary-info")
            tm = li.select_one("time[datetime]")
            d = None
            if tm:
                try:
                    d = dt.date.fromisoformat(tm["datetime"][:10])
                except ValueError:
                    pass
            itens.append({
                "t": titulo.get_text(" ", strip=True)[:120] if titulo else "Vaga",
                "e": empresa_ok(comp.get_text(" ", strip=True) if comp else ""),
                "c": cod,
                "s": salario(sal.get_text(" ", strip=True) if sal else ""),
                "d": d,
                "f": 2,
                "u": m.group(1),
            })
        log(f"linkedin start={start}: {novos} novas")
        if novos == 0:
            break
    return itens


def main():
    if len(sys.argv) != 3:
        sys.exit(__doc__)
    mapa = Mapa(carregar_cidades(sys.argv[1]))
    todos, contagem = [], {}
    for nome, fn in (("catho", catho), ("infojobs", infojobs), ("linkedin", linkedin)):
        try:
            its = fn(mapa)
        except Exception as e:  # uma fonte quebrada não derruba as outras
            log(f"ERRO em {nome}: {e!r}")
            its = []
        contagem[nome] = len(its)
        todos += its

    limite = HOJE - dt.timedelta(days=MAX_DIAS)
    unicos, chaves = [], set()
    for it in sorted(todos, key=lambda x: (x["s"] == "", -(x["d"] or limite).toordinal())):
        if it["d"] and it["d"] < limite:
            continue
        k = (norm(it["t"]), norm(it["e"]), it["c"])
        if it["e"] and k in chaves:
            continue
        chaves.add(k)
        unicos.append(it)
    unicos.sort(key=lambda x: (-(x["d"] or limite).toordinal(), x["c"]))

    agora = dt.datetime.now(dt.timezone(dt.timedelta(hours=-3))).replace(microsecond=0)
    dados = {
        "estado": UF,
        "atualizadoEm": agora.isoformat(),
        "fontes": FONTES,
        "contagem": contagem,
        "campos": ["titulo", "empresa", "ibge", "salario", "data", "fonte", "url"],
        "itens": [[i["t"], i["e"], i["c"], i["s"], i["d"].isoformat() if i["d"] else "", i["f"], i["u"]] for i in unicos],
    }
    with open(sys.argv[2], "w", encoding="utf-8") as f:
        f.write(f"/* Vaga Perto: vagas de Catho, InfoJobs e LinkedIn para {UF_NOME}. Gerado em {agora.isoformat()} */\n")
        f.write("window.VP_OFERTAS=" + json.dumps(dados, ensure_ascii=False, separators=(",", ":")) + ";\n")
    log(f"OK: {len(unicos)} vagas únicas ({contagem}); cidades não reconhecidas: {dict(sorted(mapa.falhas.items(), key=lambda x: -x[1])[:15])}")


if __name__ == "__main__":
    main()
