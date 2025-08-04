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
    },
};