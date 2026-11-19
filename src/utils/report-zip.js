// 测试报告 zip 导出（demo_report 方案）：
// index.html 总览 + 图册/{caseKey}.html 每用例一页 + 截图/{caseKey}/{nn}.png 原图落盘。
// 独立模块：Test.vue 的 SFC 解析器无法容忍模板字符串中的 HTML 标签流。
import JSZip from "jszip";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import reportTpl from "../views/report-template.html?raw";

const escapeHtml = (s) =>
  (s ?? "")
    .toString()
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

// 表格截断列：hover 显示全文（与 Test.vue 报告逻辑一致）
const clipTd = (val) =>
  `<td class="td-clip" title="${escapeHtml(val)}">${escapeHtml(val)}</td>`;

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

  // 总览页 = 完整测试报告（reportTpl 明细表）+ 截图列链接到图册页 + 底部图片总览网格
  const entryById = new Map(albumEntries.map((e) => [e.row.id, e]));

  const rowsHtml = list
    .map((c) => {
      const entry = entryById.get(c.id);
      const shotTd = entry
        ? `<a href="图册/${entry.caseKey}.html">查看截图（${entry.images.length} 张）</a>`
        : '<span class="empty-img">暂无图片</span>';
      const stressTd = (() => {
        const sr = c.StressResults || [];
        if (!sr.length) return "<td></td>";
        return (
          "<td>" +
          sr
            .map(
              (r, i) =>
                `<span style="display:inline-block;margin:0 4px 2px 0;padding:1px 6px;border-radius:3px;font-weight:600;color:#fff;background:${
                  /pass/i.test(r.result) ? "rgb(31,181,51)" : "#eb1919"
                }">R${i + 1}:${r.result || "-"}</span>`
            )
            .join("") +
          "</td>"
        );
      })();
      const resultStyle =
        c.Result === undefined || c.Result === ""
          ? "background:#f2f3f5;color:#909399"
          : /pass/i.test(c.Result)
            ? "background:#d4f8d4;color:#303133"
            : "background:#ffe1e1;color:#303133";
      return (
        `<tr><td>${escapeHtml(c.id)}</td>` +
        `<td>${escapeHtml(c.TestCaseID)}</td>` +
        `<td>${escapeHtml(c.SyRDIDFSRD)}</td>` +
        `<td>${escapeHtml(c.Auto_testID)}</td>` +
        `<td>${escapeHtml(c.TSR)}</td>` +
        `<td>${escapeHtml(c.CasePriority)}</td>` +
        `<td>${escapeHtml(c.TestMethod)}</td>` +
        `<td>${escapeHtml(c.TestStrategy)}</td>` +
        `<td>${escapeHtml(c.DesignMethod)}</td>` +
        `<td>${escapeHtml(c.TestKey)}</td>` +
        clipTd(c.Initial_Condition) +
        clipTd(c.Action) +
        clipTd(c.Expected_Result) +
        clipTd(c.InitTestSequences) +
        clipTd(c.ActionTestSequences) +
        `<td>${escapeHtml(c.ExpectedTestSequences)}</td>` +
        `<td style="${resultStyle};font-weight:600">${escapeHtml(c.Result ?? "") || "未测试"}</td>` +
        stressTd +
        `<td>${shotTd}</td>` +
        `<td>${escapeHtml(c.ActualResult)}</td>` +
        `<td>${escapeHtml(c.Selected)}</td>` +
        `<td>${escapeHtml(c.PRNo)}</td>` +
        `<td>${escapeHtml(c.TestLogs)}</td>` +
        `<td>${escapeHtml(c.Numberoftests)}</td>` +
        `<td>${escapeHtml(c.TestDate)}</td>` +
        `<td>${escapeHtml(c.Remark)}</td></tr>`
      );
    })
    .join("");

  // 图片总览网格（附加在明细表后）：每用例第一张截图，点击进图册
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

  // 完整报告主体（reportTpl）：置顶统计 + 用例明细表（截图列链接图册）
  const reportHtml = reportTpl
    .replaceAll("{{TITLE}}", "自动化测试报告")
    .replaceAll("{{TOTAL}}", total)
    .replaceAll("{{PASS}}", pass)
    .replaceAll("{{FAIL}}", fail)
    .replaceAll("{{UNTESTED}}", untested)
    .replace("{{ROWS}}", rowsHtml)
    // zip 离线场景：移除 CDN 依赖、Excel 导出按钮与内联导出脚本（包内已有全量 xlsx）
    .replace(/<script src="https:\/\/cdn[^"]*"><\/script>/g, "")
    .replace(/<button onclick="exportTestReport\(\)"[\s\S]*?<\/button>/g, "")
    .replace(/<label class="only-tested-toggle"[\s\S]*?<\/label>/g, "");

  // 图片总览默认折叠（<details>）：不展开不加载图，index 打开不卡
  const indexHtml =
    reportHtml.replace(
      "</body>",
      `<hr style="margin:24px 0">\n<style>${albumStyles}</style>\n` +
        `<details style="padding:0 20px 20px"><summary style="cursor:pointer;font-size:20px;font-weight:500">截图总览（点击展开，共 ${list.length} 条）</summary>` +
        `<div id="zoom" onclick="resetZoom()"><img alt=""></div>\n` +
        `<div class="grid">${overviewCards}</div></details>\n` +
        `${scriptOpen}${albumZoomScript}${scriptClose}\n</body>`
    );

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
    { header: "截图", key: "Shots", width: 20 },
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

  // 截图列 = ActualResult 后的 Shots 列（第20列）：超链接模式，无嵌图
  let excelCaseIdx = 0;
  for (const c of list) {
    if (++excelCaseIdx % 100 === 0) {
      notify(`正在生成 Excel ${excelCaseIdx}/${list.length} 行（含嵌图）...`);
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

    // 截图列（Shots，第20列）：不嵌图，放超链接跳转该用例图册页（demo 模式），
    // 图片本体在 zip 的 截图/ 目录 + 图册/ 页浏览，Excel 保持轻量
    const entry = entryById.get(c.id);
    if (entry) {
      const shotCell = excelRow.getCell(20);
      shotCell.value = { text: `打开册（${entry.images.length} 张）`, hyperlink: `图册/${entry.caseKey}.html` };
      shotCell.font = { color: { argb: "FF0563C1" }, underline: true };
    } else {
      excelRow.getCell(20).value = "无图片";
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