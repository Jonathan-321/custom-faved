import type { ActionType } from '@/app/dashboard/page';
import { makeAutoObservable } from 'mobx';

class mainStore {
    items = [];
    type: ActionType = "" as ActionType
    idItem = undefined;
    error: string | null = null;
    isLoading: boolean = false;

    constructor() {
        makeAutoObservable(this); // Makes state observable and actions transactional
    }

    setItems = (val) => {
        this.items = val;
    };
    createItem = (val) => {
        this.items = this.items.concat(val);
    };
    setType = (val: ActionType) => {
        this.type = val;
    };
    setIdItem = (val) => {
        this.idItem = val;
    };
    fetchItems = async () => {
        const fetchItems = async () => {
            try {
                this.isLoading = true;
                const response = await fetch('http://localhost:8000/index.php?route=/items');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log('response', data)
                this.setItems(data);
            } catch (err) {
                this.error = (err instanceof Error ? err.message : 'Failed to fetch items');
                console.error('Error fetching items:', err);
            } finally {
                this.isLoading = false;
            }
        };

        fetchItems();
    }


}

export default new mainStore();
