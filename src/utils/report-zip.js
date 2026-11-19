// 测试报告 zip 导出（demo_report 方案）：
// index.html 总览 + 图册/{caseKey}.html 每用例一页 + 截图/{caseKey}/{nn}.png 原图落盘。
// 独立模块：Test.vue 的 SFC 解析器无法容忍模板字符串中的 HTML 标签流。
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";

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

// 后端截图源文件名是 .png 但实际内容可能是 WebP，按文件头魔数判定真实扩展名
// （blob.type 不可靠——fetch 的 blob 常无 MIME），否则画图等不支持 WebP 的程序打不开
const imgExt = async (blob, filename) => {
  try {
    const head = new Uint8Array(await blob.slice(0, 12).arrayBuffer());
    const startsWith = (...bytes) => bytes.every((b, i) => head[i] === b);
    if (startsWith(0x52, 0x49, 0x46, 0x46) && head[8] === 0x57 && head[9] === 0x45) return "webp"; // RIFF....WEBP
    if (startsWith(0xff, 0xd8, 0xff)) return "jpg";
    if (startsWith(0x89, 0x50, 0x4e, 0x47)) return "png";
    if (startsWith(0x47, 0x49, 0x46, 0x38)) return "gif";
  } catch (e) {
    /* 判定失败回落文件名 */
  }
  return fileExt(filename);
};

/**
 * 导出 zip 形式测试报告（含截图，原图不压缩、无张数上限）。
 * @param cases   用例数组（含 id/Testid/Result）
 * @param hooks   { onProgress(message) } 可选进度回调
 */
export const exportZipReport = async (cases, hooks = {}) => {
  // 进度去重：同一文本只通知一次（zip onUpdate 在同一百分比会触发多次）
  let lastNotify = "";
  const notify = (msg) => {
    if (msg === lastNotify) return;
    lastNotify = msg;
    (hooks.onProgress || (() => {}))(msg);
  };
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

  // 收集：caseKey -> {row, images:[{seq, filename, blob}]}；并发限制 4；分批进度反馈
  const albumEntries = [];
  for (let i = 0; i < targets.length; i += 4) {
    if (i % 40 === 0 && i > 0) {
      notify(`正在获取截图 ${i}/${targets.length} 条用例...`);
    }
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
    for (const img of entry.images) img.ext = await imgExt(img.blob, img.filename);
    for (const img of entry.images) {
      zip.file(
        `截图/${entry.caseKey}/${String(img.seq).padStart(2, "0")}.${img.ext}`,
        img.blob
      );
    }
    const cards = entry.images
      .map((img) => {
        const rel = `../截图/${entry.caseKey}/${String(img.seq).padStart(2, "0")}.${img.ext}`;
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

  // index.html = 轻量截图总览页（demo 原形态）：统计条 + 图片卡片网格，无明细表
  // 用例明细/压测结果走包内 测试报告_全量.xlsx；HTML 只做图片浏览入口，5800 条也不卡
  const entryById = new Map(albumEntries.map((e) => [e.row.id, e]));
  const overviewCards = list
    .map((c) => {
      const entry = entryById.get(c.id);
      const result = c.Result || "未测试";
      const color = /pass/i.test(c.Result ?? "") ? "rgb(80,220,100)" : "#ff6b6b";
      if (entry) {
        const rel = `截图/${entry.caseKey}/01.${entry.images[0].ext}`;
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
    `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
` +
    `<meta name="viewport" content="width=device-width,initial-scale=1">
` +
    `<title>自动化测试报告 · 截图总览</title>
` +
    `<style>${albumStyles}</style></head><body>
` +
    `<div id="zoom" onclick="resetZoom()"><img alt=""></div>
` +
    `<header><h1>自动化测试报告 · 截图总览</h1>` +
    `<span class="hint">共 ${total} 条 · Pass ${pass} / Fail ${fail} / 未测 ${untested} · 明细见 测试报告_全量.xlsx · 点击图片放大，点击用例号进图册</span></header>
` +
    `<div class="grid">${overviewCards}</div>
` +
    `${scriptOpen}${albumZoomScript}${scriptClose}</body></html>`;

  zip.file("index.html", indexHtml);

  // ===== 全量 Excel 报告（复用 report-template.html 导出脚本的列定义/样式；截图走超链接不嵌图） =====

  const excelColumns = [
    { header: "Case ID", key: "id", width: 10 },
    { header: "测试用例ID", key: "TestCaseID", width: 15 },
    { header: "SyRD/FSRD ID", key: "SyRDIDFSRD", width: 15 },
    { header: "自动测试ID", key: "Auto_testID", width: 15 },
    { header: "TSR", key: "TSR", width: 10 },
    { header: "用例优先级", key: "CasePriority", width: 10 },
    { header: "测试方法", key: "TestMethod", width: 10 },
    { header: "测试策略", key: "TestStrategy", width: 10 },
    { header: "设计方法", key: "DesignMethod", width: 10 },
    { header: "测试功能点", key: "TestKey", width: 20 },
    { header: "初始条件", key: "Initial_Condition", width: 30 },
    { header: "动作", key: "Action", width: 20 },
    { header: "预期结果", key: "Expected_Result", width: 20 },
    { header: "初始条件序列", key: "InitTestSequences", width: 30 },
    { header: "操作步骤序列", key: "ActionTestSequences", width: 30 },
    { header: "预期结果序列", key: "ExpectedTestSequences", width: 30 },
    { header: "测试结果", key: "Result", width: 10 },
    { header: "压测明细", key: "StressResults", width: 20 },
    { header: "实际结果", key: "ActualResult", width: 30 },
    { header: "是否选中", key: "Selected", width: 10 },
    { header: "PR号", key: "PRNo", width: 10 },
    { header: "测试日志", key: "TestLogs", width: 20 },
    { header: "测试次数", key: "Numberoftests", width: 10 },
    { header: "测试日期", key: "TestDate", width: 15 },
    { header: "备注", key: "Remark", width: 20 },
  ];

  notify("正在生成 Excel 报告...");
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("测试报告");
  ws.columns = excelColumns;

  ws.insertRow(1, { id: "测试总数", SyRDIDFSRD: total });
  ws.insertRow(2, { id: "测试成功数", SyRDIDFSRD: pass });
  ws.insertRow(3, { id: "测试失败数", SyRDIDFSRD: fail });
  ws.insertRow(4, { id: "未测试数", SyRDIDFSRD: untested });
  for (let i = 1; i <= 4; i++) {
    const r = ws.getRow(i);
    r.font = { bold: true, size: 13, color: { argb: "FFFFFF" } };
    r.alignment = { horizontal: "left" };
    r.getCell(1).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2C6A9E" } };
    r.getCell(2).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2C6A9E" } };
    r.getCell(3).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FF2C6A9E" } };
  }
  const headerExcelRow = ws.getRow(5);
  headerExcelRow.font = { bold: true };
  headerExcelRow.eachCell((cell) => {
    cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE0E0E0" } };
    cell.alignment = { vertical: "middle", horizontal: "center" };
  });

  // 实际结果列放截图超链接，无单独截图列
  let excelCaseIdx = 0;
  for (const c of list) {
    if (++excelCaseIdx % 100 === 0) {
      notify(`正在生成 Excel ${excelCaseIdx}/${list.length} 行...`);
    }
    const stressText = (c.StressResults || [])
      .map((r, i) => `R${i + 1}:${r.result || "-"}`)
      .join(" ");
    const rowObj = {
      id: c.id ?? "",
      TestCaseID: c.TestCaseID ?? "",
      SyRDIDFSRD: c.SyRDIDFSRD ?? "",
      Auto_testID: c.Auto_testID ?? "",
      TSR: c.TSR ?? "",
      CasePriority: c.CasePriority ?? "",
      TestMethod: c.TestMethod ?? "",
      TestStrategy: c.TestStrategy ?? "",
      DesignMethod: c.DesignMethod ?? "",
      TestKey: c.TestKey ?? "",
      Initial_Condition: c.Initial_Condition ?? "",
      Action: c.Action ?? "",
      Expected_Result: c.Expected_Result ?? "",
      InitTestSequences: c.InitTestSequences ?? "",
      ActionTestSequences: c.ActionTestSequences ?? "",
      ExpectedTestSequences: c.ExpectedTestSequences ?? "",
      Result: c.Result ?? "",
      StressResults: stressText,
      ActualResult: c.ActualResult ?? "",
      Selected: c.Selected ?? "",
      PRNo: c.PRNo ?? "",
      TestLogs: c.TestLogs ?? "",
      Numberoftests: c.Numberoftests ?? "",
      TestDate: c.TestDate ?? "",
      Remark: c.Remark ?? "",
    };
    const excelRow = ws.addRow(rowObj);
    excelRow.eachCell({ includeEmpty: false }, (cell) => {
      cell.alignment = { vertical: "top", horizontal: "left", wrapText: true };
    });

    // 实际结果列（第19格）：不嵌图，有截图时放超链接跳转该用例图册页（demo 模式），
    // 图片本体在 zip 的 截图/ 目录 + 图册/ 页浏览，Excel 保持轻量
    const entry = entryById.get(c.id);
    if (entry) {
      const shotCell = excelRow.getCell(19);
      // 反斜杠相对路径（demo 示例同写法）：Excel 识别为文件路径走默认关联打开；
      // 正斜杠写法部分 Office 版本会当未知协议 URL，弹"选择应用"框
      // .\ 前缀强制 Excel 将其识别为当前目录文件路径而非 URL，
      // 避免 Office 对相对路径超链接弹"选择应用/安全确认"框
      shotCell.value = { text: `打开图册（${entry.images.length} 张）`, hyperlink: `.\\图册\\${entry.caseKey}.html` };
      shotCell.font = { color: { argb: "FF0563C1" }, underline: true };
    } else if (!excelRow.getCell(19).value) {
      excelRow.getCell(19).value = "无图片";
    }
  }

  notify("正在生成 Excel 文件（写入内存）...");
  const excelBuffer = await wb.xlsx.writeBuffer();
  zip.file("测试报告_全量.xlsx", excelBuffer);

  notify("正在打包报告，请稍等...");
  const blob = await zip.generateAsync(
    { type: "blob", compression: "STORE" }, // PNG/xlsx 已是压缩格式，STORE 避免重复 DEFLATE 拖慢全量打包
    (meta) => {
      if (Math.round(meta.percent) % 25 === 0) {
        notify(`正在打包 ${Math.round(meta.percent)}%...`);
      }
    }
  );
  const timeStamp = new Date()
    .toLocaleString("zh-CN", { hour12: false })
    .replace(/[/: ]/g, "");
  const name = `TestReport_withImg_${timeStamp}.zip`;
  saveAs(blob, name);
  return { name, albumCount: albumEntries.length };
};