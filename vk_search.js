(function () {
    'use strict';

    const VK_API = 'https://api.vk.com/method/video.search';
    const API_VERSION = '5.131';

    function startPlugin() {

        // Добавляем пункт в меню
        Lampa.Component.add('vk_search', {
            name: 'VK Видео',
            icon: 'ondemand_video',
            component: function () {

                this.create = function () {
                    this.search('');
                };

                this.search = function (query) {
                    let token = Lampa.Storage.get('vk_token', '');

                    if (!token) {
                        Lampa.Noty.show('Введите VK Token в настройках');
                        return;
                    }

                    fetch(`${VK_API}?q=${encodeURIComponent(query)}&count=20&access_token=${token}&v=${API_VERSION}`)
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

        // Добавляем настройку правильно
        Lampa.SettingsApi.addParam({
            component: 'interface',
            param: {
                name: 'vk_token',
                type: 'input',
                placeholder: 'Введите VK Access Token',
                default: '',
            },
            field: {
                name: 'VK Видео — Token'
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
