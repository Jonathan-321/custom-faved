import { ActionType } from '@/app/dashboard/page';
import { makeAutoObservable } from 'mobx';
import { toast } from 'sonner';
import { API_ENDPOINTS } from './api';

class mainStore {
    items = [];
    type: ActionType = "" as ActionType
    userName: string = "" as string
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
                const response = await fetch(API_ENDPOINTS.items.list);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('response', data)
                this.setItems(data);
            } catch (err) {
                this.error = (err instanceof Error ? err.message : 'Failed to fetch items');
                console.error('Error fetching items:', err);
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
        fetch(API_ENDPOINTS.items.deleteItem(id), options)
            .then(response => response.json())
            .then(response => toast('Deleted succesfully', {
                description: "Sunday, December 03, 2023 at 9:00 AM",
                action: {
                    label: "Ok",
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

        fetch(API_ENDPOINTS.items.createItem + (!isCreateCopy ? this.type === ActionType.EDIT ? `&item-id=${val.id}` : '' : ''), options)
            .then(response => response.json())
            .then(response => console.log(response))
            .catch(err => console.error(err))
            .finally(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                !onSave && this.fetchItems()
            })
    }
    getUser = (setIsAuthSuccess: (val: boolean) => void, setIsLoading: (val: boolean) => void) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        };

        fetch(API_ENDPOINTS.settings.getUser, options)
            .then(response => response.json())
            .then(({ data }) => {
                console.log('data', data)
                setIsAuthSuccess(true);
                this.userName = data.user.username;
                // console.log('response', response)
                // if (response.message !== "User has not been created.") {
                //     setIsAuthSuccess(true)
                // } else {
                //     setIsAuthSuccess(false)
                // }

            })
            .catch(err => setIsAuthSuccess(false))

    }
    onCreateUser = (val: any, setIsUserWasCreate: (val: boolean) => void) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: val.username || '',
                password: val.password || '',
                confirm_password: val.passwordConfirm || '',
            })
        };

        fetch(API_ENDPOINTS.settings.create, options)
            .then(response => response.json())
            .then(response => { setIsUserWasCreate(true); console.log(response); toast('User created successfully.') })
            .catch(err => toast(JSON.stringify(err)))
            .finally(() => {
                // setIsUserWasCreate(true)
            })
    }

    createUserName = (val: any) => {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: val.username || '',

            })
        };

        fetch(API_ENDPOINTS.settings.userName, options)
            .then(response => response.json())
            .then(response => { console.log(response) })
            .catch(err => toast(JSON.stringify(err)))
            .finally(() => {
                // setIsUserWasCreate(true)
            })
    }
    createPassword = (val: any) => {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                password: val.password || '',
                confirm_password: val.passwordConfirm || '',
            })
        };

        fetch(API_ENDPOINTS.settings.password, options)
            .then(response => response.json())
            .then(response => { console.log(response) })
            .catch(err => toast(JSON.stringify(err)))
            .finally(() => {
                // setIsUserWasCreate(true)
            })
    }
    deleteUser = () => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(API_ENDPOINTS.settings.delete, options)
            .then(response => response.json())
            .then(response => { console.log(response) })
            .catch(err => toast(JSON.stringify(err)))
            .finally(() => {
                // setIsUserWasCreate(true)
            })
    }

}

export default new mainStore();
