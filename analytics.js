const measurementId = 'G-Q58T5W3Q9C';
const preferenceKey = 'analytics-consent';
const disableAnalytics = `ga-disable-${measurementId}`;
const prompt = document.querySelector('#analytics-prompt');
const settings = document.querySelector('#analytics-settings');
const decline = document.querySelector('#analytics-decline');
const allow = document.querySelector('#analytics-allow');
let tagLoaded = false;

function gtag() {
  window.dataLayer.push(arguments);
}

function enableAnalytics() {
  window[disableAnalytics] = false;
  if (tagLoaded) {
    gtag('consent', 'update', { analytics_storage: 'granted' });
    return;
  }

  window.dataLayer = window.dataLayer || [];
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });
  gtag('consent', 'update', { analytics_storage: 'granted' });
  gtag('js', new Date());
  gtag('config', measurementId, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false
  });

  const tag = document.createElement('script');
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
  document.head.append(tag);
  tagLoaded = true;
}

function stopAnalytics() {
  window[disableAnalytics] = true;
  if (tagLoaded) {
    gtag('consent', 'update', { analytics_storage: 'denied' });
  }

  for (const cookie of ['_ga', `_ga_${measurementId.slice(2)}`]) {
    document.cookie = `${cookie}=; Max-Age=0; Path=/`;
    document.cookie = `${cookie}=; Max-Age=0; Path=/; Domain=${location.hostname}`;
  }
}

function savePreference(preference) {
  try {
    localStorage.setItem(preferenceKey, preference);
  } catch {
    // Keep the choice for this page even if browser storage is unavailable.
  }
  if (preference === 'granted') {
    enableAnalytics();
  } else {
    stopAnalytics();
  }
  prompt.hidden = true;
  if (settings.closest('details').open) {
    settings.focus();
  }
}

let preference;
try {
  preference = localStorage.getItem(preferenceKey);
} catch {
  // Ask again when browser storage is unavailable.
}
if (preference === 'granted') {
  enableAnalytics();
}
prompt.hidden = preference === 'granted' || preference === 'denied';
settings.hidden = false;

settings.addEventListener('click', () => {
  prompt.hidden = false;
  decline.focus();
});
decline.addEventListener('click', () => savePreference('denied'));
allow.addEventListener('click', () => savePreference('granted'));

window.addEventListener('storage', (event) => {
  if (event.key === preferenceKey && event.newValue !== 'granted') {
    stopAnalytics();
    prompt.hidden = event.newValue === 'denied';
  }
});
