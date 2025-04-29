Lampa.Platform.tv();

// Конфиг по умолчанию (если нет сохранённых настроек)
const defaultHotkeys = {
    next: [166, 427, 33, 402],     // CH+ / Page Up
    prev: [167, 428, 34, 403],     // CH- / Page Down
    subs: [48, 96, 11],            // 0
    playlist: [53, 101, 6],        // 5
    tracks: [56, 104, 9]           // 8
};

// Загружаем сохранённые настройки или используем дефолтные
let hotkeysConfig = JSON.parse(localStorage.getItem('lampa_hotkeys')) || defaultHotkeys;

// Функция для сохранения настроек
function saveHotkeysConfig(newConfig) {
    hotkeysConfig = newConfig;
    localStorage.setItem('lampa_hotkeys', JSON.stringify(newConfig));
    Lampa.Notify.show('Горячие клавиши сохранены', 3000);
}

// Функция для открытия панели
function openPanel(element) {
    if (parseFloat(Lampa.Manifest.app_version) >= 1.7) {
        Lampa.Utils.trigger(document.querySelector(element), 'click');
    } else {
        document.querySelector(element).click();
    }
}

// Универсальная проверка клавиш
function isKeyPressed(e, keyCodes) {
    return keyCodes.includes(e.keyCode);
}

// Обработчик клавиш (теперь использует конфиг)
function listenHotkeys(e) {
    if (isKeyPressed(e, hotkeysConfig.next)) {
        openPanel('.player-panel__next.button.selector');
    }
    else if (isKeyPressed(e, hotkeysConfig.prev)) {
        openPanel('.player-panel__prev.button.selector');
    }
    else if (isKeyPressed(e, hotkeysConfig.subs)) {
        if (!document.querySelector('body.selectbox--open')) {
            openPanel('.player-panel__subs.button.selector');
        } else {
            history.back();
        }
    }
    else if (isKeyPressed(e, hotkeysConfig.playlist)) {
        if (!document.querySelector('body.selectbox--open')) {
            openPanel('.player-panel__playlist.button.selector');
        } else {
            history.back();
        }
    }
    else if (isKeyPressed(e, hotkeysConfig.tracks)) {
        if (!document.querySelector('body.selectbox--open')) {
            openPanel('.player-panel__tracks.button.selector');
        } else {
            history.back();
        }
    }
}

// === НАСТРОЙКА ИНТЕРФЕЙСА ===
function createHotkeysSettingsMenu() {
    const menuItems = [
        {
            title: "CH+ (Следующий)",
            value: hotkeysConfig.next.join(', '),
            key: 'next'
        },
        {
            title: "CH- (Предыдущий)",
            value: hotkeysConfig.prev.join(', '),
            key: 'prev'
        },
        {
            title: "0 (Субтитры)",
            value: hotkeysConfig.subs.join(', '),
            key: 'subs'
        },
        {
            title: "5 (Плейлист)",
            value: hotkeysConfig.playlist.join(', '),
            key: 'playlist'
        },
        {
            title: "8 (Аудиодорожки)",
            value: hotkeysConfig.tracks.join(', '),
            key: 'tracks'
        }
    ];

    Lampa.SettingsApi.add({
        id: 'custom_hotkeys',
        component: 'HotkeysSettings',
        name: 'Горячие клавиши',
        menu: menuItems,
        save: (newValues) => {
            const newConfig = { ...hotkeysConfig };
            Object.keys(newValues).forEach(key => {
                newConfig[key] = newValues[key].split(',').map(Number).filter(v => !isNaN(v));
            });
            saveHotkeysConfig(newConfig);
        }
    });
}

// Запуск
Lampa.Player.listener.follow('ready', () => {
    document.addEventListener("keydown", listenHotkeys);
    Lampa.Player.listener.follow('destroy', () => {
        document.removeEventListener("keydown", listenHotkeys);
    });
});

// Инициализация меню (после загрузки Lampa)
if (Lampa.SettingsApi) {
    createHotkeysSettingsMenu();
} else {
    Lampa.Listener.follow('app_ready', createHotkeysSettingsMenu);
}