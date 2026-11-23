const fs = require("fs");
const vue = fs.readFileSync("../node_modules/vue/dist/vue.global.prod.js", "utf8");
const ep = fs.readFileSync("../node_modules/element-plus/dist/index.full.min.js", "utf8");
const epCss = fs.readFileSync("../node_modules/element-plus/dist/index.css", "utf8");

const testCss = ;

const appHtml = `
<div id="app">
  <el-dialog v-model="visible" title="压测结果汇总" width="70%">
    <el-table :data="rows" border max-height="480">
      <el-table-column prop="id" label="用例ID" min-width="100"></el-table-column>
      <el-table-column prop="rounds" label="遍数" width="70" align="center"></el-table-column>
      <el-table-column prop="pass" label="Pass" width="70" align="center"></el-table-column>
      <el-table-column prop="fail" label="Fail" width="70" align="center"></el-table-column>
      <el-table-column label="各遍结果" min-width="300" class-name="round-badges-col">
        <template #default="{ row }">
          <span v-for="(r, i) in row.results" :key="i"
            class="round-badge"
            :class="isPass(r) ? 'round-badge-pass' : 'round-badge-fail'"
            >第{{ i + 1 }}遍: {{ r }}</span>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button type="primary" @click="visible = false">关 闭</el-button>
    </template>
  </el-dialog>
</div>`;

const script = `
const { createApp, ref } = Vue;
const app = createApp({
  setup() {
    const visible = ref(true);
    const isPass = (r) => /pass/i.test(r);
    const rows = ref(Array.from({ length: 30 }, (_, n) => {
      const results = [
        n % 3 === 0 ? "Fail" : (n % 5 === 0 ? "Fail" : "Pass"),
        n % 2 === 0 ? "Pass" : "Fail",
        n % 4 === 0 ? "Pass" : "Fail",
      ];
      return {
        id: String(101 + n), rounds: results.length,
        pass: results.filter(isPass).length,
        fail: results.filter((r) => r && !isPass(r)).length,
        results,
      };
    }));
    return { visible, rows, isPass };
  },
});
app.use(ElementPlus);
app.mount("#app");
`;

const html =
  '<!DOCTYPE html><html lang="zh-CN"><head><meta charset="utf-8"><title>verify</title>' +
  "<script>" + vue + "</scr" + "ipt><script>" + ep + "</scr" + "ipt>" +
  "<style>" + epCss + "</style><style>" + testCss + "</style></head><body>" +
  appHtml + "<script>" + script + "</scr" + "ipt></body></html>";
fs.writeFileSync("stress-summary-local.html", html);
console.log("size", html.length);