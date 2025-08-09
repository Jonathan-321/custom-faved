import { ActionType } from '@/components/dashboard/page';
import { makeAutoObservable, toJS } from 'mobx';
import { toast } from 'sonner';
import { API_ENDPOINTS } from './api';

class mainStore {
    items = [];
    tags = [];
    type: ActionType = "" as ActionType
    userName: string = "" as string
    idItem = undefined;
    showLoginPage = false;
    showInitializeDatabasePage = false;
    error: string | null = null;
    isOpenSettingsModal: boolean = false;
    selectedItemSettingsModal: string = "Authentication settings";

    constructor() {
        makeAutoObservable(this); // Makes state observable and actions transactional
    }

    setTags = (tags) => {
        const renderTagSegment = (tag) => {
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

        console.log('tags', tags)
        this.tags = tags;
    };
    setShowLoginPage = (val) => {
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
                console.log('response-tags', data)
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
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((data) => toast(data.message, { position: 'top-center', style: { width: "200px" } }))
            .catch((err, data) => toast('Tag not deleted: ' + (err instanceof Error ? err.message : 'Unknown error'), { position: 'top-center', }))
            .finally(() => {
                this.fetchTags()
                this.fetchItems()
            })
    }
    onChangeTagTitle = async (tagID: any, title: string) => {
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
    onChangeTagColor = async (tagID: any, color: string) => {
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
                const tag = { ...this.tags[tagID], color }
                this.tags = { ...this.tags, [tagID]: tag };
            })
    }
    onChangeTagPinned = async (tagID: any, pinned: boolean) => {
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
                const tag = { ...this.tags[tagID], pinned }
                this.tags = { ...this.tags, [tagID]: tag };
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
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('response', data)
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
                        this.showLoginPage = true
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
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
                        this.showLoginPage = true
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((response) => toast(response.message, { position: 'top-center', style: { width: "200px" } }))
            .catch(err => toast(err.message, { position: 'top-center', style: { width: "200px" } }))
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
                tags: val.tags
            })
        };

        fetch(API_ENDPOINTS.items.createItem + (!isCreateCopy ? this.type === ActionType.EDIT ? `&item-id=${val.id}` : '' : ''), options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(response => toast(response.message, { position: 'top-center', style: { width: "200px" } }))
            .catch(err => toast(err.message, { position: 'top-center', style: { width: "200px" } }))
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
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then((response) => {
                if (response.message === "User created successfully.") {
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
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
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
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
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
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
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
                        this.showLoginPage = true
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
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
                        this.showLoginPage = true
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
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
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
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
    }
    initialDatabase = () => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },

        };

        fetch(API_ENDPOINTS.setup.setup, options)
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403 || response.status === 401) {
                        this.showLoginPage = true
                    }
                    if (response.status === 424) {
                        this.showInitializeDatabasePage = true
                    }
                    throw new Error(`HTTP error! status: ${response.status}`);
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

}

export default new mainStore();
