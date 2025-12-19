import { v4 as uuidv4 } from 'uuid';

// ローカルストレージからUUIDを取得、なければ生成して保存
export function getOrCreateUUID() {
  const storageKey = 'gitview_anonymous_uuid';
  let uuid = localStorage.getItem(storageKey);
  
  if (!uuid) {
    uuid = uuidv4();
    localStorage.setItem(storageKey, uuid);
  }
  
  return uuid;
}

