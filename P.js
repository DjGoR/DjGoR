(function(){
    // Название плагина
    let plugin_name = "CH Playlist Launcher";
    
    // Проверяем, загружена ли Lampa
    if(!window.lampa) return setTimeout(arguments.callee,1000);
    
    // Регистрируем плагин
    lampa.plugins().register(plugin_name, (core)=>{
        return {
            // Инициализация плагина
            init: function(){
                // URL вашего плейлиста
                let playlist_url = "http://example.com/playlist.m3u"; // Замените на ваш URL плейлиста
                
                // Создаем обработчик клавиш
                core.keyboard().add("CH", (e)=>{
                    // Проверяем, что это событие нажатия (а не отпускания)
                    if(e.type == 'down'){
                        // Загружаем плейлист
                        core.page().go({
                            url: playlist_url,
                            title: "Мой плейлист",
                            component: "main",
                            source: "plugin_" + plugin_name
                        });
                        
                        // Предотвращаем дальнейшую обработку события
                        return false;
                    }
                });
                
                console.log(plugin_name + " initialized");
            }
        }
    }
})();