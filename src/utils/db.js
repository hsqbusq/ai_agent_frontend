import { get, set } from 'idb-keyval'
import { toRaw } from 'vue'
import cloneDeep from 'lodash.clonedeep'

export const CASES_KEY = 'cases'
export const CASES_TABLE_KEY = 'casesTable'
const MIGRATE_FLAG = 'migrated_from_ls'   

function scopedKey(baseKey, projectKey) {
  const scope = (projectKey ?? '').trim()
  if (!scope) return baseKey
  return `${baseKey}__proj__${scope}`
}

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

export async function saveCases(list, projectKey) {
  try {
    const plain = cloneDeep(toRaw(list))
    await set(scopedKey(CASES_KEY, projectKey), plain)
  } catch (e) {
    console.warn('IndexedDB 写入失败', e)
  }
}

export async function saveCasesTable(list, projectKey) {
  try {
    const plain = cloneDeep(toRaw(list))
    await set(scopedKey(CASES_TABLE_KEY, projectKey), plain)
  } catch (e) {
    console.warn('IndexedDB 写入失败', e)
  }
}

export async function loadCases(projectKey) {
  await migrateOnce()         
  const scoped = await get(scopedKey(CASES_KEY, projectKey))
  if (Array.isArray(scoped)) return scoped

  const legacy = await get(CASES_KEY)
  if (Array.isArray(legacy) && legacy.length && (projectKey ?? '').trim()) {
    try {
      await set(scopedKey(CASES_KEY, projectKey), legacy)
    } catch (e) {
      console.warn('IndexedDB 写入失败', e)
    }
    return legacy
  }

  return []
}

export async function loadCasesTable(projectKey) {
  await migrateOnce()
  const scoped = await get(scopedKey(CASES_TABLE_KEY, projectKey))
  if (Array.isArray(scoped)) return scoped

  const legacy = await get(CASES_TABLE_KEY)
  if (Array.isArray(legacy) && legacy.length && (projectKey ?? '').trim()) {
    try {
      await set(scopedKey(CASES_TABLE_KEY, projectKey), legacy)
    } catch (e) {
      console.warn('IndexedDB 写入失败', e)
    }
    return legacy
  }

  return []
}
