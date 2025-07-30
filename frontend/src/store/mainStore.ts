import { ActionType } from '@/app/dashboard/page';
import { makeAutoObservable } from 'mobx';
import { toast } from 'sonner';

class mainStore {
    items = [];
    type: ActionType = "" as ActionType
    idItem = undefined;
    error: string | null = null;

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
            }
        };

        fetchItems();
    }
    onDeleteItem = async (id: number) => {
        const options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch('http://localhost:8000/index.php?route=%2Fitems' + `&item-id=${id}`, options)
            .then(response => response.json())
            .then(response => toast('Deleted succesfully', {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "ХУЙ",
                    onClick: () => console.log("Undo"),
                },
            }))
            .catch(err => console.error(err))
            .finally(() => {
                this.fetchItems()
            })
    }
    onCreateItem = (val, isCreateCopy = false as boolean, onSave = false) => {
        const options = {
            method: !isCreateCopy ? this.type === ActionType.EDIT ? 'PATCH' : 'POST' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: val.title || '',
                description: val.description || '',
                url: val.url || '',
                comments: val.comments || '',
                image: val.imageURL || '',
                tags: "" // TODO: parse tags
            })
        };

        fetch('http://localhost:8000/index.php?route=%2Fitems' + (!isCreateCopy ? this.type === ActionType.EDIT ? `&item-id=${val.id}` : '' : ''), options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err))
            .finally(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                !onSave && this.fetchItems()
            })
    }


}

export default new mainStore();
