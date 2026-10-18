// つぶやきメモ 用の最小限のService Worker
// 目的: Android版Chromeなど、PWAとしてインストールした状態では
// 直接 new Notification() が使えない(Illegal constructorになる)ため、
// registration.showNotification() 経由で通知を出せるようにするためだけに存在します。
// オフラインキャッシュ等は行いません。

self.addEventListener("install", function (event) {
  self.skipWaiting();
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

// 通知をタップしたら、開いているタブがあればそれにフォーカス、なければ新しく開く
self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (list) {
      for (var i = 0; i < list.length; i++) {
        if ("focus" in list[i]) return list[i].focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow("./");
    })
  );
});
