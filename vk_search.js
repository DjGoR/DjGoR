(function () {
    'use strict';

    const VK_API = 'https://api.vk.com/method/video.search';
    const API_VERSION = '5.131';

    function startPlugin() {

        Lampa.Component.add('vk_search', {
            name: 'VK Видео',
            component: function (object) {

                this.create = function () {
                    this.render();
                };

                this.render = function () {
                    this.search('');
                };

                this.search = function (query) {
                    let token = Lampa.Storage.get('vk_token');

                    if (!token) {
                        Lampa.Noty.show('Введите VK Token в настройках');
                        return;
                    }

                    fetch(`${VK_API}?q=${encodeURIComponent(query)}&count=20&access_token=${token}&v=${API_VERSION}`)
                        .then(res => res.json())
                        .then(data => {

                            if (!data.response || !data.response.items) {
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

                        }).catch(() => {
                            Lampa.Noty.show('Ошибка соединения');
                        });
                };
            }
        });

        Lampa.Template.add('settings_vk', `
            <div class="settings__line">
                <div class="settings__label">VK Access Token</div>
                <div class="settings__field">
                    <input type="text" class="settings__input" data-name="vk_token" placeholder="Введите токен"/>
                </div>
            </div>
        `);

        Lampa.SettingsApi.addComponent({
            component: 'settings_vk',
            icon: 'account_circle',
            name: 'VK Видео',
        });
    }

    if (window.appready) startPlugin();
    else {
        Lampa.Listener.follow('app', function (e) {
            if (e.type === 'ready') startPlugin();
        });
    }

})();
