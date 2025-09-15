import { makeAutoObservable } from 'mobx';
import { toast } from 'sonner';
import { API_ENDPOINTS } from './api';
import { ActionType } from '@/components/Dashboard/types';
import type { LoginType, PasswordType, UsernameType, UsetType, ItemType, TagsObjectType, TagType } from '@/types/types';
import { NavigateFunction } from 'react-router-dom';

export const stylesTost = {
    width: "200px",
    left: '50%',
    transform: 'translateX(-50%)'
}

const handleResponse = (promise, defaultErrorMessage, setShowLoginPage) => {
    return promise
        .then(response => {
            if (!response.ok) {
                if (response.status === 401) {
                    setShowLoginPage(true)
                }
                return response.json().then(data => {
                    throw new Error(data.message || `HTTP error! status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then((data) => {
            toast(data.message, { position: 'top-center', style: stylesTost });
            return data
        })
        .catch((err, data) => {
            toast.error((err instanceof Error ? err.message : defaultErrorMessage), { position: 'top-center', style: stylesTost })
        })
};

const getCookie = (name: string) => {

    // Add a semicolon to the beginning of the cookie string to handle the first cookie
    const cookieString = "; " + document.cookie;

    // Split the string at the specified cookie name
    const parts = cookieString.split("; " + name + "=");

    // If the cookie was found (the array has more than one part)
    if (parts.length === 2) {
        // Return the value, which is everything after the '=' and before the next ';'
        return parts.pop().split(";").shift();
    }
    // If the cookie was not found
    return null;
}

class mainStore {
    items: ItemType[] = [];
    tags: TagsObjectType[] = [];
    type: ActionType = "" as ActionType
    userName: string = "" as string
    idItem: number | undefined = undefined;
    showLoginPage = false;
    showInitializeDatabasePage = false;
    error: string | null = null;
    isOpenSettingsModal: boolean = false;
    selectedItemSettingsModal: string = "Authentication settings";
    currentPage: number = 1;
    selectedTagId: string | null = '0'; // Default to '0' for no tag selected
    itemsOriginal: ItemType[] = [];
    isTableView: boolean = false;
    isAuthSuccess: boolean = false;



    constructor() {
        makeAutoObservable(this); // Makes state observable and actions transactional
    }
    setCurrentTagId = (val: string | null | number) => {
        this.selectedTagId = val === null ? null : val.toString();
    }
    setUserName = (val: string) => {
        this.userName = val
    }
    setIsAuthSuccess = (val: boolean) => {
        this.isAuthSuccess = val;
    }
    setIsTableView = (val: boolean) => {
        this.isTableView = val;
    }
    setCurrentPage = (val: number) => {
        this.currentPage = val;
    }
    setItemsOriginal = (val: ItemType[]) => {
        this.itemsOriginal = val;
    }
    setTags = (tags: TagsObjectType) => {
        const renderTagSegment = (tag: TagType) => {
            let output = ''
            if (tag.parent !== '0') {
                const parentTag = Object.values(tags).find(t => t.id.toString() === tag.parent.toString());
                if (parentTag) {
                    output += renderTagSegment(parentTag) + '/';
                }
            }
            output += tag.title;
            return output;
        }

        for (const tagID in tags) {
            const tagId = tagID.toString()
            tags[tagId] = {
                ...tags[tagId],
                id: tags[tagId].id.toString(),
                parent: tags[tagId].parent.toString(),
                fullPath: renderTagSegment(tags[tagId]),
                pinned: !!tags[tagId].pinned
            };
        }
        this.tags = tags as unknown as TagsObjectType[];
    };
    setShowLoginPage = (val: boolean) => {
        this.showLoginPage = val;
    };
    fetchTags = async () => {
        const fetchTags = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.tags.list, {
                    headers: {
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.setTags(data);
            } catch (err) {
                this.error = (err instanceof Error ? err.message : 'Failed to fetch tags');
                console.error('Error fetching tags:', err);
            }
        };
        fetchTags();
    }
    onCreateTag = async (title: string) => {
        let tagID = null;

        const options = {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
            body: JSON.stringify({
                title
            })
        };

        await handleResponse(fetch(API_ENDPOINTS.tags.create, options), 'Error creating tag', this.setShowLoginPage)
            .then((data) => {
                tagID = data?.data?.tag_id || null;
            })
            .finally(() => {
                this.fetchTags()
                this.fetchItems()
            })

        return tagID;
    }
    onDeleteTag = async (tagID: number) => {
        if (!confirm('Are you sure you want to delete this tag?')) {
            return;
        }

        const options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
        };

        handleResponse(fetch(API_ENDPOINTS.tags.deleteTag(tagID), options), 'Error deleting tag', this.setShowLoginPage)
            .finally(() => {
                this.fetchTags()
                this.fetchItems()
            })

    }
    onChangeTagTitle = async (tagID: string, title: string) => {
        const options = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
            body: JSON.stringify({
                title
            })
        };

        handleResponse(fetch(API_ENDPOINTS.tags.updateTitle(tagID), options), 'Error updating tag title', this.setShowLoginPage)
            .finally(() => {
                this.fetchTags()
            })

    }
    onChangeTagColor = async (tagID: string, color: string) => {
        const options = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
            body: JSON.stringify({
                color
            })
        };

        handleResponse(
            fetch(API_ENDPOINTS.tags.updateColor(tagID), options),
            'Error updating tag color',
            this.setShowLoginPage
        )
            .finally(() => {
                const tag = { ...this.tags[tagID as unknown as number], color }
                this.tags = { ...this.tags, [tagID]: tag };
            })
    }
    onChangeTagPinned = async (tagID: string, pinned: boolean) => {
        const options = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
            body: JSON.stringify({
                pinned
            })
        };
        fetch(API_ENDPOINTS.tags.updatePinned(tagID), options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => toast(data.message, { position: 'top-center', style: stylesTost }))
            .catch(err => console.error(err))
            .finally(() => {
                const tag = { ...this.tags[tagID as unknown as number], pinned }
                this.tags = { ...this.tags, [tagID]: tag };
            })
    }

    setItems = (val: ItemType[]) => {
        this.items = val;
    };
    createItem = (val: ItemType) => {
        this.items = this.items.concat(val);
    };
    setType = (val: ActionType) => {
        this.type = val;
    };
    setIdItem = (val: number) => {
        this.idItem = val;
    };
    setIsOpenSettingsModal = (val: boolean) => {
        this.isOpenSettingsModal = val;
    };
    setSelectedItemSettingsModal = (val: string) => {
        this.selectedItemSettingsModal = val;
    };
    fetchItems = async () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        };
        const fetchItems = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.items.list, options);
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.setItems(data);
                this.setItemsOriginal(data)
            } catch (err) {
                this.error = (err instanceof Error ? err.message : 'Failed to fetch items');
                toast(err.message, { position: 'top-center', style: stylesTost })
            }
        };


        fetch(API_ENDPOINTS.settings.getUser, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then(({ data }) => {
                fetchItems();
                if (data.user !== null) {
                    this.setUserName(data.user.username);
                }
            })
            .catch(err => {
                toast(err.message, { position: 'top-center', style: stylesTost })

            })


    }
    onDeleteItem = async (id: number) => {
        const options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
        };
        fetch(API_ENDPOINTS.items.deleteItem(id), options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then((response) => toast(response.message, { position: 'top-center', style: stylesTost }))
            .catch(err => toast(err.message, { position: 'top-center', style: stylesTost }))
            .finally(() => {
                this.fetchItems()
                this.fetchTags()
            })
    }
    onCreateItem = (val: ItemType, isCreateCopy = false as boolean, onSave = false, closeWindow = false) => {
        const options = {
            method: onSave ? 'PATCH' : !isCreateCopy ? this.type === ActionType.EDIT ? 'PATCH' : 'POST' : 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
            body: JSON.stringify({
                title: val.title || '',
                description: val.description || '',
                url: val.url || '',
                comments: val.comments || '',
                image: val.image || '',
                tags: val.tags
            })
        };

        fetch((isCreateCopy || this.type !== ActionType.EDIT ? API_ENDPOINTS.items.createItem : API_ENDPOINTS.items.updateItem(val.id)), options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then(response => {

                let message = response.message;
                if (closeWindow) {
                    message += "\n" + 'The window will close in 1 second.';
                    setTimeout(() => {
                        window.close()
                    }, 1000);
                }

                toast(message, { position: 'top-center', style: stylesTost })

            })
            .catch(err => toast(err.message, { position: 'top-center', style: stylesTost }))
            .finally(() => {
                if (!onSave) {
                    this.fetchItems()
                    this.fetchTags()
                    this.setCurrentPage(this.currentPage)
                }

            })
    }
    getUser = () => {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },

        };

        fetch(API_ENDPOINTS.settings.getUser, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then((response) => {
                if (response.message === "User created successfully." || response.message === "User retrieved successfully.") {
                    this.setIsAuthSuccess(true)
                }
                if (response.data.user !== null) {
                    this.setUserName(response.data.user.username);

                }

            })
            .catch(err => {
                toast(err.message, { position: 'top-center', style: stylesTost })
                this.setIsAuthSuccess(false)
            })

    }
    onCreateUser = (val: UsetType) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
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
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then((response) => {
                this.setIsAuthSuccess(true)
                this.setUserName(val.username);

                toast(response.message, { position: 'top-center', style: stylesTost })
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: stylesTost })
            })

    }

    createUserName = (val: UsernameType) => {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
            body: JSON.stringify({
                username: val.username || '',

            })
        };

        fetch(API_ENDPOINTS.settings.userName, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then((response) => {
                toast(response.message, { position: 'top-center', style: stylesTost })
                this.setUserName(val.username);

            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: stylesTost })
            })
    }
    createPassword = (val: PasswordType, reset: any) => {
        const options = {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
            body: JSON.stringify({
                password: val.password || '',
                confirm_password: val.passwordConfirm || '',
            })
        };

        fetch(API_ENDPOINTS.settings.password, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then((response) => {
                toast(response.message, { position: 'top-center', style: stylesTost })
                reset()
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: stylesTost })
            })
    }
    deleteUser = () => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
        };

        fetch(API_ENDPOINTS.settings.delete, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then((response) => {
                toast(response.message, { position: 'top-center', style: stylesTost })
                this.setIsAuthSuccess(false)
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: stylesTost })
            })
    }
    logOut = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
        };

        fetch(API_ENDPOINTS.auth.logout, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then((response) => {
                toast(response.message, { position: 'top-center', style: stylesTost })
                this.setShowLoginPage(true);
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: stylesTost })
            })
    }
    login = (values: LoginType, setIsLoading: (val: boolean) => void) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            },
            body: JSON.stringify({
                username: values.username || '',
                password: values.password || '',
            })
        };
        setIsLoading(true)
        fetch(API_ENDPOINTS.auth.login, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then((response) => {
                // toast(response.message, {
                //     position: 'top-center', style: stylesTost
                // })
                this.showLoginPage = false
            })
            .catch((err) => {
                toast(err.message, {
                    position: 'top-center', style: stylesTost
                })
            })
            .finally(() => { setIsLoading(false) })
    }
    initialDatabase = () => {
        const options = {
            method: 'POST',
            headers: {
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
                //     'Content-Type': 'multipart/form-data; boundary=geckoformboundary262df991ff6535437a260f8dd5e61d8b',
            },

        };

        fetch(API_ENDPOINTS.setup.setup, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then((response) => {
                toast(response.message, {
                    position: 'top-center', style: stylesTost
                })
                this.showLoginPage = false
                this.showInitializeDatabasePage = false
            })
            .catch((err) => {
                toast(err.message, {
                    position: 'top-center', style: stylesTost
                })
            })
    }
    importBookmarks = (selectedFile: File, setIsLoading: (val: boolean) => void) => {
        const formData = new FormData();
        formData.append('pocket-zip', selectedFile);
        const options = {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': getCookie('CSRF-TOKEN')
            }
        };
        setIsLoading(true)
        fetch(API_ENDPOINTS.importBookmarks.import, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 401) {
                        this.showLoginPage = true;
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true;
                    }
                    return response.headers.get('Content-Type')?.includes('application/json')
                        ? response.json().then(json => Promise.reject(json))
                        : response.text().then(text => Promise.reject(new Error(text)));
                }
                return response.json();
            })
            .then((response) => {
                this.selectedItemSettingsModal = "";
                this.isOpenSettingsModal = false;
                this.fetchItems();
                this.fetchTags();
                toast(response.message, { position: 'top-center', style: stylesTost });
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: stylesTost });
            })
            .finally(() => setIsLoading(false))
    };

}

export default new mainStore();
