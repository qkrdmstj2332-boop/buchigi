// 자녀 앱 주소 (public/app 폴더가 그대로 배포됨)
// 시연용: 링크에 서버 주소와 가족 코드를 넣어 누르면 바로 체험 가족으로 들어가요.
// 이 코드는 사이트에 공개되니 발표용 사진·목소리만 쓰고, 발표 뒤 Render의 DEVICE_TOKEN을 바꾸세요.
const API = "https://buchigi-server.onrender.com";
const CODE = "NODROP-JB97-Q6H6";

export const APP_URL = `${import.meta.env.BASE_URL}app/#code=${encodeURIComponent(CODE)}&api=${encodeURIComponent(API)}`;

export function openApp() {
  window.location.href = APP_URL;
}
