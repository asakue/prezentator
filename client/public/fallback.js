// Это файл-заглушка для работы в статическом режиме без сервера

// Проверяем, запущены ли мы в режиме GitHub Pages
const isGitHubPages = window.location.hostname.includes('github.io');

if (isGitHubPages) {
  console.log('Запущено в режиме GitHub Pages, используем локальное хранилище');
  
  // Предотвращаем запросы к API
  window.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // Если это запрос к API, отменяем его
    if (url.pathname.startsWith('/api/')) {
      event.respondWith(
        new Response(JSON.stringify({ error: 'API недоступно в статическом режиме' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      );
    }
  }, { capture: true });
}

// Настройка SPA маршрутизации для GitHub Pages
(() => {
  const search = window.location.search;
  const params = new URLSearchParams(search);
  const p = params.get('p');
  
  if (p) {
    const cleanPath = p.replace(/~and~/g, '&');
    params.delete('p');
    
    const newSearch = params.toString() ? `?${params.toString()}` : '';
    const newUrl = `${window.location.pathname}${newSearch}${window.location.hash}`;
    
    window.history.replaceState(null, null, newUrl);
    
    // Сохраняем полный путь для обработки после перезагрузки
    sessionStorage.redirect = `${window.location.origin}${cleanPath}${newSearch}${window.location.hash}`;
  }
})();