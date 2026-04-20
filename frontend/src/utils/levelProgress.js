/**
 * levelProgress.js
 * Shared helper so any module page can mark itself complete
 * and return the user to the Safety Road map.
 */

const STORAGE_KEY = 'vivekRaksha_mapState';

/**
 * Get current progress or return defaults
 */
export function getProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && typeof saved === 'object') return saved;
  } catch {}
  return { highestUnlocked: 1, completed: [] };
}

/**
 * Mark a level as complete, unlock the next, persist, then
 * navigate back to the map.
 *
 * @param {number} levelId  – 1-based level number
 * @param {Function} navigate – react-router navigate function
 */
export async function markLevelComplete(levelId, navigate) {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      await fetch('http://localhost:5000/api/progress/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ moduleId: levelId, scoreEarned: 100 })
      });
    } catch (e) {}
  }

  const prev = getProgress();
  const completed = [...new Set([...prev.completed, levelId])];
  const highestUnlocked = Math.min(6, Math.max(prev.highestUnlocked, levelId + 1));
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ highestUnlocked, completed }));
  navigate('/banking');
}
