import { LocalStorageAdapter } from "./localStorage"
import type { StorageAdapter } from "./types"

let storageAdapter: StorageAdapter | null = null

export function getStorageAdapter(): StorageAdapter {
  if (!storageAdapter) {
    // デフォルトはLocalStorage
    // 将来的にはここで環境変数や設定に基づいて切り替える
    storageAdapter = new LocalStorageAdapter()
  }
  return storageAdapter
}

export function setStorageAdapter(adapter: StorageAdapter): void {
  storageAdapter = adapter
}

export type { StorageAdapter } from "./types"
