(function(){
    const plugin = {
        name: 'CH opens Playlist',
        version: '1.0',
        description: 'Назначает кнопку CH на вызов встроенной кнопки "Плейлист" в плеере',

        run: function(){
            // Подписка на нажатие клавиш
            document.addEventListener('keydown', function(e){
                if(e.code === 'ChannelUp' || e.key === 'CH_UP'){ // зависит от устройства
                    e.preventDefault();
                    triggerPlaylistButton();
                }
            });

            function triggerPlaylistButton(){
                // Ищем кнопку плейлиста во встроенном плеере
                const button = document.querySelector('.player-panel .player-panel__playlist');

                if(button){
                    button.click(); // эмулируем клик
                } else {
                    Lampa.Noty.show('Кнопка плейлиста не найдена');
                }
            }
        }
    };

    Lampa.Plugin.register(plugin.name, plugin);
})();
