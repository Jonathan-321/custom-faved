import { ActionType } from '@/components/dashboard/page';
import { makeAutoObservable } from 'mobx';
import { toast } from 'sonner';
import { API_ENDPOINTS } from './api';

class mainStore {
    items = [];
    tags = [];
    type: ActionType = "" as ActionType
    userName: string = "" as string
    idItem = undefined;
    showLoginPage = false;
    error: string | null = null;
    isOpenSettingsModal: boolean = false;
    selectedItemSettingsModal: string = "Authentication settings";

    constructor() {
        makeAutoObservable(this); // Makes state observable and actions transactional
    }

    setTags = (val) => {
        this.tags = val;
    };
    fetchTags = async () => {
        const fetchTags = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.tags.list);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('response-tags', data)
                this.setTags(data);
            } catch (err) {
                this.error = (err instanceof Error ? err.message : 'Failed to fetch tags');
                console.error('Error fetching tags:', err);
            }
        };
        fetchTags();
    }
    onDeleteTag = async (id: number) => {
        confirm('Are you sure you want to delete this tag?');

        const options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(API_ENDPOINTS.tags.deleteTag(id), options)
          .then(response => {
              if (!response.ok) {
                  if (response.status === 403 || response.status === 401) {
                      this.showLoginPage = true
                  }
                  throw new Error(`HTTP error! status: ${response.status}`);
              }
              return response.json();
          })
          .then(() => toast('Deleted successfully', {
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
    setIsOpenSettingsModal = (val) => {
        this.isOpenSettingsModal = val;
    };
    setSelectedItemSettingsModal = (val: string) => {
        this.selectedItemSettingsModal = val;
    };
    fetchItems = async () => {
        const fetchItems = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.items.list);
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('response', data)
                this.setItems(data);

            } catch (err) {
                this.error = (err instanceof Error ? err.message : 'Failed to fetch items');
                toast(err.message)
            }
        };
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        };

        fetch(API_ENDPOINTS.settings.getUser, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(({ data }) => {
                fetchItems();
                this.userName = data.user.username;
            })
            .catch(err => {
                toast(err.message)

            })


    }
    onDeleteItem = async (id: number) => {
        const options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(API_ENDPOINTS.items.deleteItem(id), options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((response) => toast(response.message))
            .catch(err => toast(err.message))
            .finally(() => {
                this.fetchItems()
            })
    }
    onCreateItem = (val, isCreateCopy = false as boolean, onSave = false) => {
        const options = {
            method: onSave ? 'PATCH' : !isCreateCopy ? this.type === ActionType.EDIT ? 'PATCH' : 'POST' : 'POST',
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
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(response => toast(response.message))
            .catch(err => toast(err.message))
            .finally(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                !onSave && this.fetchItems()
            })
    }
    getUser = (setIsAuthSuccess: (val: boolean) => void) => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        };

        fetch(API_ENDPOINTS.settings.getUser, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(({ data }) => {
                setIsAuthSuccess(true);
                this.userName = data.user.username;
            })
            .catch(err => {
                toast(err.message)
                setIsAuthSuccess(false)
            })

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
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((response) => {
                setIsUserWasCreate(true);
                toast(response.message)
            })
            .catch((err) => {
                toast(err.message)
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
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((response) => {
                toast(response.message)
                this.userName = val.username;
            })
            .catch((err) => {
                toast(err.message)
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
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((response) => { toast(response.message) })
            .catch((err) => {
                toast(err.message)
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
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((response) => { toast(response.message) })
            .catch((err) => {
                toast(err.message)
            })
    }
    logOut = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        fetch(API_ENDPOINTS.auth.logout, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((response) => {
                toast(response.message)
                this.showLoginPage = true;
            })
            .catch((err) => {
                toast(err.message)
            })
    }
    login = (values) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username: values.username || '',
                password: values.password || '',
            })
        };

        fetch(API_ENDPOINTS.auth.login, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((response) => {
                toast(response.message)
                this.showLoginPage = false
            })
            .catch((err) => {
                toast(err.message)
            })
    }

}

export default new mainStore();
