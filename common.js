function getHeaders() {
  const headers = {
    'User-Agent': 'clubhouse/269 (iPhone; iOS 14.1; Scale/3.00)',
    'CH-Languages': 'en-US',
    'CH-Locale': 'en_US',
    'CH-AppVersion': '0.2.15',
    'CH-AppBuild': '269',
    'CH-UserID': '(null)',
    'CH-DeviceId': getDeviceId(),
  };
  if (isLoggedIn()) {
    const auth = getConfig().auth;
    headers['Authorization'] = 'Token ' + auth.auth_token;
    headers['CH-UserID'] = auth.user_profile.user_id;
  }
  return headers;
}
function isLoggedIn() {
  return !!getConfig().auth;
}

function apiUrl(api) {
  // return 'https://www.clubhouseapi.com/api/' + api;
  // return 'https://decisive-acoustic-rhythm.glitch.me/api/' + api;
  return 'https://api.hipster.house/api/' + api;
  return '/api/' + api;
}

async function apiPost(api, body) {
  const response = await fetch(apiUrl(api), {
    method: 'POST',
    body: JSON.stringify(body),
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...getHeaders(),
    },
  });
  const responseBody = await response.json();
  return responseBody;
}

async function apiGet(api) {
  const response = await fetch(apiUrl(api), {
    method: 'GET',
    headers: getHeaders(),
  });
  const responseBody = await response.json();
  return responseBody;
}

function getConfig() {
  if (!localStorage.hipsterHouse) return {};
  return JSON.parse(localStorage.hipsterHouse);
}

function setConfig(newConfig) {
  localStorage.hipsterHouse = JSON.stringify({
    ...getConfig(),
    ...newConfig,
  });
}

async function updateUser() {
  const response = await apiPost('me', {});
  setConfig({user: response});
}

async function doRedirect(needsOffWaitlist) {
  if (!isLoggedIn()) {
    location = '/login.html';
    return;
  }
  await updateUser();
  if (needsOffWaitlist && isWaitlisted()) {
    location = '/';
    return;
  }
}

function isWaitlisted() {
  if (getConfig().bypass) return false;
  return getConfig().user && !getConfig().user.is_waitlisted;
}

function getDeviceId() {
  let deviceId = getConfig().deviceId;
  if (!deviceId) {
    deviceId = uuidv4().toUpperCase();
    setConfig({deviceId});
  }
  return deviceId;
}