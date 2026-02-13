(function () {
    'use strict';

    const VK_API = 'https://api.vk.com/method/video.search';
    const API_VERSION = '5.131';

    // ВСТАВЬ СЮДА СВОЙ ТОКЕН

    function startPlugin() {

        Lampa.Component.add('vk_video', {
            name: 'VK Видео',
            icon: 'ondemand_video',
            component: function () {

                this.create = function () {
                    this.search('');
                };

                this.search = function (query) {

                    fetch(`${VK_API}?q=${encodeURIComponent(query)}&count=20&access_token=${VK_TOKEN}&v=${API_VERSION}`)
                        .then(r => r.json())
                        .then(data => {

                            if (!data.response) {
                                Lampa.Noty.show('Ошибка VK API');
                                return;
                            }

                            let items = data.response.items.map(item => {

                                let poster = '';
                                if (item.image && item.image.length) {
                                    poster = item.image[item.image.length - 1].url;
                                }

                                let videoUrl = '';

                                if (item.files) {
                                    videoUrl =
                                        item.files.mp4_720 ||
                                        item.files.mp4_480 ||
                                        item.files.mp4_360 ||
                                        '';
                                }

                                return {
                                    title: item.title,
                                    poster: poster,
                                    description: item.description || '',
                                    url: videoUrl,
                                    type: 'video'
                                };
                            });

                            this.build(items);

                        })
                        .catch(() => Lampa.Noty.show('Ошибка соединения'));
                };
            }
        });

    }

    if (window.appready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startPlugin();
        });
    }

})();
