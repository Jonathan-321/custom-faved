import { makeAutoObservable } from 'mobx';
import { toast } from 'sonner';
import { API_ENDPOINTS } from './api';
import { ActionType } from '@/components/dashboard/types';
import type { LoginType, PasswordType, UsernameType, UsetType, ItemType, TagsObjectType, TagType } from '@/types/types';

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

    constructor() {
        makeAutoObservable(this); // Makes state observable and actions transactional
    }
    setCurrentTagId = (val: string | null) => {
        this.selectedTagId = val === null ? null : val.toString();
    }
    setCurrentPage = (val: number) => {
        this.currentPage = val;
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
            },
            body: JSON.stringify({
                title
            })
        };
        await fetch(API_ENDPOINTS.tags.create, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => {
                toast(data.message, { position: 'top-center', style: { width: "200px" } });
                tagID = data.data.tag_id;
            })
            .catch((err, data) => toast('Tag not created: ' + (err instanceof Error ? err.message : 'Unknown error')), { position: 'top-center', style: { width: "200px" } })
            .finally(() => {
                this.fetchTags()
                this.fetchItems()
            })

        return tagID;
    }
    onDeleteTag = async (tagID: number) => {
        confirm('Are you sure you want to delete this tag?');

        const options = {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
            },
        };
        fetch(API_ENDPOINTS.tags.deleteTag(tagID), options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }

                    return response.json().then(data => {
                        throw new Error(data.message || `HTTP error! status: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then((data) => toast(data.message, { position: 'top-center', style: { width: "200px" } }))
            .catch((err) => {
                toast.error((err instanceof Error ? err.message : 'Tag not deleted'), { position: 'top-center' })
            })
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
            },
            body: JSON.stringify({
                title
            })
        };
        fetch(API_ENDPOINTS.tags.updateTitle(tagID), options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => toast(data.message, { position: 'top-center', style: { width: "200px" } }))
            .catch(err => console.error(err))
            .finally(() => {
                this.fetchTags()
            })


    }
    onChangeTagColor = async (tagID: string, color: string) => {
        const options = {
            method: "PATCH",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                color
            })
        };
        fetch(API_ENDPOINTS.tags.updateColor(tagID), options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => toast(data.message, { position: 'top-center', style: { width: "200px" } }))
            .catch(err => console.error(err))
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
            },
            body: JSON.stringify({
                pinned
            })
        };
        fetch(API_ENDPOINTS.tags.updatePinned(tagID), options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => toast(data.message, { position: 'top-center', style: { width: "200px" } }))
            .catch(err => console.error(err))
            .finally(() => {
                const tag = { ...this.tags[tagID as unknown as number], pinned }
                this.tags = { ...this.tags, [tagID]: tag };
            })
    }

    setItems = (val: ItemType[]) => {
        console.log('setItems', val)
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
        const fetchItems = async () => {
            try {
                const response = await fetch(API_ENDPOINTS.items.list);
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                this.setItems(data);
            } catch (err) {
                this.error = (err instanceof Error ? err.message : 'Failed to fetch items');
                toast(err.message, { position: 'top-center', style: { width: "200px" } })
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
                    this.userName = data.user.username;
                }
            })
            .catch(err => {
                toast(err.message, { position: 'top-center', style: { width: "200px" } })

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
            .then((response) => toast(response.message, { position: 'top-center', style: { width: "200px" } }))
            .catch(err => toast(err.message, { position: 'top-center', style: { width: "200px" } }))
            .finally(() => {
                this.fetchItems()
                this.fetchTags()
            })
    }
    onCreateItem = (val: ItemType, isCreateCopy = false as boolean, onSave = false) => {
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
                image: val.image || '',
                tags: val.tags
            })
        };

        fetch(API_ENDPOINTS.items.createItem + (!isCreateCopy ? this.type === ActionType.EDIT ? `&item-id=${val.id}` : '' : ''), options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
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
            .then(response => toast(response.message, { position: 'top-center', style: { width: "200px" } }))
            .catch(err => toast(err.message, { position: 'top-center', style: { width: "200px" } }))
            .finally(() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                if (!onSave) {
                    this.fetchItems()
                    this.fetchTags()
                    this.setCurrentPage(this.currentPage)
                }

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
                    setIsAuthSuccess(true);
                }
                if (response.data.user !== null) {
                    this.userName = response.data.user.username;
                }

            })
            .catch(err => {
                toast(err.message, { position: 'top-center', style: { width: "200px" } })
                setIsAuthSuccess(false)
            })

    }
    onCreateUser = (val: UsetType, setIsUserWasCreate: (val: boolean) => void) => {
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
                setIsUserWasCreate(true);
                this.userName = val.username;
                toast(response.message, { position: 'top-center', style: { width: "200px" } })
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: { width: "200px" } })
            })

    }

    createUserName = (val: UsernameType) => {
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
                toast(response.message, { position: 'top-center', style: { width: "200px" } })
                this.userName = val.username;
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: { width: "200px" } })
            })
    }
    createPassword = (val: PasswordType) => {
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
            .then((response) => { toast(response.message, { position: 'top-center', style: { width: "200px" } }) })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: { width: "200px" } })
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
            .then((response) => { toast(response.message, { position: 'top-center', style: { width: "200px" } }) })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: { width: "200px" } })
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
                toast(response.message, { position: 'top-center', style: { width: "200px" } })
                this.showLoginPage = true;
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: { width: "200px" } })
            })
    }
    login = (values: LoginType, setIsLoading: (val: boolean) => void) => {
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
        setIsLoading(true)
        fetch(API_ENDPOINTS.auth.login, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
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
                toast(response.message, { position: 'top-center', style: { width: "200px" } })
                this.showLoginPage = false
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: { width: "200px" } })
            })
            .finally(() => { setIsLoading(false) })
    }
    initialDatabase = () => {
        const options = {
            method: 'POST',
            // headers: {
            //     'Content-Type': 'multipart/form-data; boundary=geckoformboundary262df991ff6535437a260f8dd5e61d8b',
            // },

        };

        fetch(API_ENDPOINTS.setup.setup, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
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
                toast(response.message, { position: 'top-center', style: { width: "200px" } })
                this.showLoginPage = false
                this.showInitializeDatabasePage = false
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: { width: "200px" } })
            })
    }
    importBookmarks = (selectedFile: File, setIsLoading: (val: boolean) => void) => {
        const formData = new FormData();
        formData.append('pocket-zip', selectedFile);
        const options = {
            method: 'POST',
            body: formData
        };
        setIsLoading(true)
        fetch(API_ENDPOINTS.importBookmarks.import, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
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
                this.fetchItems();
                this.fetchTags();
                toast(response.message, { position: 'top-center', style: { width: "200px" } });
            })
            .catch((err) => {
                toast(err.message, { position: 'top-center', style: { width: "200px" } });
            })
            .finally(() => setIsLoading(false))
    };

}

export default new mainStore();
