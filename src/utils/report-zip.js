// 测试报告 zip 导出（demo_report 方案）：
// index.html 总览 + 图册/{caseKey}.html 每用例一页 + 截图/{caseKey}/{nn}.png 原图落盘。
// 独立模块：Test.vue 的 SFC 解析器无法容忍模板字符串中的 HTML 标签流。
import JSZip from "jszip";
import { saveAs } from "file-saver";

const escapeHtml = (s) =>
  (s ?? "")
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// Vue SFC 解析器会把字符串里的 </script> 当作组件脚本结束标签，拆开拼接规避
const scriptOpen = "<scr" + "ipt>";
const scriptClose = "</scr" + "ipt>";

const albumZoomScript = `
const z = document.getElementById('zoom'), zi = z.querySelector('img');
document.addEventListener('click', e => {
  const a = e.target.closest('.card img');
  if (a) { e.preventDefault(); zi.src = a.dataset.full || a.src; z.classList.add('on'); }
  else if (e.target.closest('#zoom')) z.classList.remove('on');
});
document.addEventListener('keydown', e => { if (e.key === 'Escape') z.classList.remove('on'); });
z.addEventListener('wheel', e => {
  e.preventDefault();
  const s = (parseFloat(zi.dataset.s) || 1) * (e.deltaY < 0 ? 1.15 : 0.87);
  zi.dataset.s = Math.min(Math.max(s, .2), 8);
  zi.style.transform = 'scale(' + zi.dataset.s + ')';
}, {passive: false});
function resetZoom(){ zi.dataset.s=1; zi.style.transform=''; }`;

const albumStyles = `
:root{color-scheme:dark}
*{box-sizing:border-box}
body{margin:0;background:#12161c;color:#dfe6ef;font:14px/1.6 "Segoe UI","Microsoft YaHei",sans-serif}
header{position:sticky;top:0;z-index:5;padding:14px 22px;background:#1b222c;border-bottom:1px solid #2b3644;display:flex;gap:16px;align-items:baseline;flex-wrap:wrap}
h1{margin:0;font-size:17px;font-weight:600;color:#fff}
.hint{color:#8b9aae;font-size:12px}
a{color:#7db1ff;text-decoration:none}
a:hover{color:#a8caff}
.grid{display:grid;gap:14px;padding:20px;grid-template-columns:repeat(auto-fill,minmax(200px,1fr))}
.card{background:#1b222c;border:1px solid #2b3644;border-radius:8px;overflow:hidden;transition:border-color .15s,transform .15s}
.card:hover{border-color:#4c8dff;transform:translateY(-2px)}
.card img{display:block;width:100%;height:auto;background:#fff}
.card .cap{padding:6px 9px;font-size:12px;color:#9fb0c6;display:flex;justify-content:space-between;gap:8px}
#zoom{position:fixed;inset:0;background:rgba(6,9,13,.94);display:none;z-index:99;overflow:auto;cursor:zoom-out}
#zoom.on{display:flex;align-items:center;justify-content:center}
#zoom img{max-width:none;image-rendering:auto;background:#fff}`;

// 拉取一个用例的全部截图文件名（clip 时间序，过滤标注图）
export const fetchCaseImageNames = async (testId) => {
  const resp = await fetch(`/dev-api/test_logs/${encodeURIComponent(testId)}`);
  const data = await resp.json();
  if (data.code !== "200") return [];
  const images = (data.result?.logs?.images || [])
    .map((img) => img.filename)
    .filter((name) => !name.startsWith("processed_"));
  const clipOrder = (name) => {
    const m = name.match(/_clip(\d+)/);
    if (!m) return -1;
    const tag = m[1];
    return tag.startsWith("0") && tag !== "0" ? Number(tag) / 10 : Number(tag);
  };
  return [...images].sort((a, b) => clipOrder(a) - clipOrder(b));
};

const fileExt = (filename) =>
  (filename.match(/\.(\w+)$/) || [null, "png"])[1];

/**
 * 导出 zip 形式测试报告（含截图，原图不压缩、无张数上限）。
 * @param cases   用例数组（含 id/Testid/Result）
 * @param hooks   { onProgress(message) } 可选进度回调
 */
export const exportZipReport = async (cases, hooks = {}) => {
  const notify = hooks.onProgress || (() => {});
  const zip = new JSZip();
  const list = cases;
  const total = list.length;
  const tested = list.filter((c) => c.Result !== undefined && c.Result !== "");
  const pass = tested.filter((c) => /pass/i.test(c.Result)).length;
  const fail = tested.length - pass;
  const untested = total - tested.length;

  const targets = list.filter((c) => c.Testid);
  if (targets.length) {
    notify(`正在获取 ${targets.length} 条用例的截图...`);
  }

  // 文件夹名规避非法字符
  const safeKey = (s) =>
    (s ?? "").toString().replace(/[\\/:*?"<>|\s]+/g, "_").slice(0, 60) || "case";

  // 收集：caseKey -> {row, images:[{seq, filename, blob}]}；并发限制 4
  const albumEntries = [];
  for (let i = 0; i < targets.length; i += 4) {
    const group = targets.slice(i, i + 4);
    const groupLists = await Promise.all(
      group.map(async (c) => ({ c, filenames: await fetchCaseImageNames(c.Testid) }))
    );
    for (const { c, filenames } of groupLists) {
      if (!filenames.length) continue;
      const blobs = await Promise.all(
        filenames.map(async (filename, idx) => {
          try {
            const r = await fetch(
              `/dev-api/test_logs/${encodeURIComponent(c.Testid)}/image?file=${encodeURIComponent(filename)}`
            );
            if (!r.ok) return null;
            return { filename, blob: await r.blob(), seq: idx + 1 };
          } catch {
            return null;
          }
        })
      );
      const images = blobs.filter(Boolean);
      if (images.length) albumEntries.push({ caseKey: safeKey(c.id), row: c, images });
    }
  }

  // 截图文件 + 单用例图册页
  for (const entry of albumEntries) {
    for (const img of entry.images) {
      zip.file(
        `截图/${entry.caseKey}/${String(img.seq).padStart(2, "0")}.${fileExt(img.filename)}`,
        img.blob
      );
    }
    const cards = entry.images
      .map((img) => {
        const rel = `../截图/${entry.caseKey}/${String(img.seq).padStart(2, "0")}.${fileExt(img.filename)}`;
        const alt = escapeHtml(entry.row.id) + " 第" + img.seq + "张";
        return (
          `<div class="card"><img src="${rel}" data-full="${rel}" alt="${alt}" loading="lazy">` +
          `<div class="cap"><span>#${String(img.seq).padStart(2, "0")}</span>` +
          `<a href="${rel}" target="_blank">原图</a></div></div>`
        );
      })
      .join("");
    const isPass = /pass/i.test(entry.row.Result ?? "");
    const resultTag = isPass
      ? '<span style="color:rgb(80,220,100)">Pass</span>'
      : `<span style="color:#ff6b6b">${escapeHtml(entry.row.Result || "未测试")}</span>`;
    const albumHtml =
      `<!DOCTYPE html>\n<html lang="zh-CN"><head><meta charset="utf-8">\n` +
      `<meta name="viewport" content="width=device-width,initial-scale=1">\n` +
      `<title>用例 ${escapeHtml(entry.row.id)} · 截图图册</title>\n` +
      `<style>${albumStyles}</style></head><body>\n` +
      `<div id="zoom" onclick="resetZoom()"><img alt=""></div>\n` +
      `<header><h1>用例 ${escapeHtml(entry.row.id)} · ${resultTag}</h1>` +
      `<span class="hint">${entry.images.length} 张 · 点击缩略图放大，滚轮缩放，Esc 关闭</span>` +
      `<a href="../index.html">← 返回总览</a></header>\n` +
      `<div class="grid">${cards}</div>\n` +
      `${scriptOpen}${albumZoomScript}${scriptClose}</body></html>`;
    zip.file(`图册/${entry.caseKey}.html`, albumHtml);
  }

  // 总览页：统计 + 每用例一张卡片（第一张截图，点击进图册）
  const entryById = new Map(albumEntries.map((e) => [e.row.id, e]));
  const overviewCards = list
    .map((c) => {
      const entry = entryById.get(c.id);
      const result = c.Result || "未测试";
      const color = /pass/i.test(c.Result ?? "") ? "rgb(80,220,100)" : "#ff6b6b";
      if (entry) {
        const rel = `截图/${entry.caseKey}/01.${fileExt(entry.images[0].filename)}`;
        return (
          `<div class="card"><img src="${rel}" data-full="${rel}" alt="${escapeHtml(c.id)}" loading="lazy">` +
          `<div class="cap"><a href="图册/${entry.caseKey}.html">${escapeHtml(c.id)}</a>` +
          `<span style="color:${color}">${escapeHtml(result)} · ${entry.images.length} 张</span></div></div>`
        );
      }
      return (
        `<div class="card"><div class="cap" style="padding:24px 9px;text-align:center">${escapeHtml(c.id)}<br>` +
        `<span style="color:${color}">${escapeHtml(result)}</span><br><span>无截图</span></div></div>`
      );
    })
    .join("");

  const indexHtml =
    `<!DOCTYPE html>\n<html lang="zh-CN"><head><meta charset="utf-8">\n` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">\n` +
    `<title>自动化测试报告 · 截图总览</title>\n` +
    `<style>${albumStyles}</style></head><body>\n` +
    `<div id="zoom" onclick="resetZoom()"><img alt=""></div>\n` +
    `<header><h1>自动化测试报告 · 截图总览</h1>` +
    `<span class="hint">共 ${total} 条 · Pass ${pass} / Fail ${fail} / 未测 ${untested} · 点击图片放大，点击用例号进单案例图册</span></header>\n` +
    `<div class="grid">${overviewCards}</div>\n` +
    `${scriptOpen}${albumZoomScript}${scriptClose}</body></html>`;
  zip.file("index.html", indexHtml);

  notify("正在打包报告，请稍等...");
  const blob = await zip.generateAsync({ type: "blob" }, (meta) => {
    console.log(`zip 进度: ${Math.round(meta.percent)}%`);
  });
  const timeStamp = new Date()
    .toLocaleString("zh-CN", { hour12: false })
    .replace(/[/: ]/g, "");
  const name = `TestReport_withImg_${timeStamp}.zip`;
  saveAs(blob, name);
  return { name, albumCount: albumEntries.length };
};