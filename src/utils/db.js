import { get, set } from 'idb-keyval'
import { toRaw } from 'vue'
import cloneDeep from 'lodash.clonedeep'

export const CASES_KEY = 'cases'
export const CASES_TABLE_KEY = 'casesTable'
const MIGRATE_FLAG = 'migrated_from_ls'   

async function migrateOnce() {
  if (localStorage.getItem(MIGRATE_FLAG) === '1') return

  try {
    const rawCases = localStorage.getItem(CASES_KEY)
    const rawTable = localStorage.getItem(CASES_TABLE_KEY)

    if (rawCases) await set(CASES_KEY, JSON.parse(rawCases))
    if (rawTable) await set(CASES_TABLE_KEY, JSON.parse(rawTable))

    localStorage.setItem(MIGRATE_FLAG, '1')
    localStorage.removeItem(CASES_KEY)
    localStorage.removeItem(CASES_TABLE_KEY)
  } catch (e) {
    console.warn('迁移失败，沿用空数据', e)
  }
}

export async function saveCases(list) {
  try {
    const plain = cloneDeep(toRaw(list))
    await set(CASES_KEY, plain)
  } catch (e) {
    console.warn('IndexedDB 写入失败', e)
  }
}

export async function saveCasesTable(list) {
  try {
    const plain = cloneDeep(toRaw(list))
    await set(CASES_TABLE_KEY, plain)
  } catch (e) {
    console.warn('IndexedDB 写入失败', e)
  }
}

export async function loadCases() {
  await migrateOnce()         
  return (await get(CASES_KEY)) ?? []
}

export async function loadCasesTable() {
  await migrateOnce()
  return (await get(CASES_TABLE_KEY)) ?? []
}