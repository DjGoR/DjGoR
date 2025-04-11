(function(){
    if (!window.Plugin) return;

    Plugin.register("video_downloader", {
        title: 'Скачивание видео',
        version: '1.0',
        description: 'Добавляет кнопку для скачивания текущего видео.',
        author: 'ChatGPT',
        type: 'video',
        onLoad: function() {
            let originalOpen = Lampa.Player.open;

            Lampa.Player.open = function(object){
                originalOpen.call(this, object);

                let interval = setInterval(() => {
                    let buttons = document.querySelector('.player-panel__buttons');
                    if (buttons && !document.querySelector('.download-button')) {
                        let btn = document.createElement('div');
                        btn.className = 'player-panel__button download-button';
                        btn.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M5 20h14v-2H5v2zm7-18L5.33 11h3.34v4h6.66v-4h3.34L12 2z"/></svg>';
                        btn.title = 'Скачать видео';

                        btn.addEventListener('click', () => {
                            let url = object.url;
                            if (url) {
                                window.open(url, '_blank');
                            } else {
                                Lampa.Noty.show('Ссылка для скачивания не найдена');
                            }
                        });

                        buttons.appendChild(btn);
                    }
                }, 500);

                Lampa.Player.listener.follow('destroy', () => {
                    clearInterval(interval);
                });
            };
        },
        onUnload: function() {
            console.log("Video Downloader plugin unloaded");
        }
    });
})();