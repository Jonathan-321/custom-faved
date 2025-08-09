const API_BASE = '/api/index.php';

export const API_ENDPOINTS = {
    items: {
        list: `${API_BASE}?route=/items`,
        deleteItem: (id: any) => `${API_BASE}?route=/items&item-id=${id}`,
        createItem: `${API_BASE}?route=%2Fitems`,
    },
    settings: {
        getUser: `${API_BASE}?route=%2Fsettings%2Fuser`,
        create: `${API_BASE}?route=%2Fsettings%2Fuser`,
        userName: `${API_BASE}?route=%2Fsettings%2Fusername`,
        password: `${API_BASE}?route=%2Fsettings%2Fpassword`,
        delete: `${API_BASE}?route=%2Fsettings%2Fuser`,
    },
    tags: {
        list: `${API_BASE}?route=%2Ftags`,
        create: `${API_BASE}?route=/tags`,
        deleteTag: (id: any) => `${API_BASE}?route=/tags&tag-id=${id}`,
        updateTitle: (id: any) => `${API_BASE}?route=/tags/update-title&tag-id=${id}`,
        updateColor: (id: any) => `${API_BASE}?route=/tags/update-color&tag-id=${id}`,
        updatePinned: (id: any) => `${API_BASE}?route=/tags/update-pinned&tag-id=${id}`,
    },
    auth: {
        login: `${API_BASE}?route=%2Fauth`,
        logout: `${API_BASE}?route=/auth/logout`,
    },
    setup: {
        setup: `${API_BASE}?route=/setup/database`,
    }
};