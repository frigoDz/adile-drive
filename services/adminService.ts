
/**
 * Admin Service for Remote Management
 * This simulates a check to a backend database (e.g., Firebase Remote Config)
 * to determine if the app should be allowed to run.
 */
export const checkAppStatus = async (): Promise<{ active: boolean; message: string }> => {
  const isKilled = localStorage.getItem('AD_REMOTE_KILL') === 'true';
  
  await new Promise(r => setTimeout(r, 500));

  if (isKilled) {
    return {
      active: false,
      message: "This application has been remotely disabled by the administrator. Please contact support."
    };
  }

  return { active: true, message: "" };
};

/**
 * Custom event name for status changes
 */
export const STATUS_CHANGE_EVENT = 'adile_status_change';

/**
 * Call this from the console to simulate a remote kill command:
 * window.remoteKill()
 */ 
(window as any).remoteKill = () => {
  localStorage.setItem('AD_REMOTE_KILL', 'true');
  window.dispatchEvent(new Event(STATUS_CHANGE_EVENT));
};

/**
 * Call this to restore:
 * window.remoteRestore()
 */
(window as any).remoteRestore = () => {
  localStorage.removeItem('AD_REMOTE_KILL');
  window.dispatchEvent(new Event(STATUS_CHANGE_EVENT));
};
