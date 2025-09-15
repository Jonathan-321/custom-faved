
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TagEdit } from "@/components/ui/tags"
import { Textarea } from '../ui/textarea';
import { StoreContext } from '@/store/storeContext';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { formSchema } from './utils';
import { ActionType } from '../dashboard/types';
import type { ItemType } from '@/types/types';
import { useLocation } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';


const EditItemForm: React.FC<{ setIsShowEditModal: (val: boolean) => void, isFullScreen: boolean }> = ({ setIsShowEditModal, isFullScreen }) => {
  const store = useContext(StoreContext);
  const [isOpenInPage] = useState(false)

  const location = useLocation();
  const [url, setUrl] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    // Парсим параметры из URL
    const searchParams = new URLSearchParams(location.search);

    // Для прямого доступа через /edit?url=...&title=...
    const directUrl = searchParams.get('url');
    const directTitle = searchParams.get('title');
    const directDescription = searchParams.get('description');

    setUrl(decodeURIComponent(directUrl));
    setTitle(decodeURIComponent(directTitle || ''));
    setDescription(decodeURIComponent(directDescription || ''));
  }, [location.search]);

  useEffect(() => {
    store.fetchTags()
  })

  const initialData = {
    id: "",
    description: "",
    title: "",
    comments: '',
    created_at: undefined,
    image: undefined,
    tags: [],
    updated_at: undefined,
    url: ''
  }
  const defaultValues = store.type === ActionType.EDIT && store.items.length > 0 ? store.items.filter(el => el.id as unknown as number === store.idItem)[0] : store.type === ActionType.CREATE ? initialData : {};

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })
  useEffect(() => {
    form.reset(defaultValues)
  }, [store.idItem])
  useEffect(() => {
    if (isFullScreen) {
      form.setValue('title', title)
      form.setValue('description', description)
      form.setValue('url', url)
    }

  }, [isFullScreen, title, description, url])

  const onSubmit = (val: ItemType) => {
    store.onCreateItem(val, false, false, isFullScreen ? window : null)
    setIsShowEditModal(false)
    form.reset()
  };
  const onSubmitSaveCopy = (val: ItemType) => {
    store.onCreateItem(val, true)
    setIsShowEditModal(false)
    form.reset()
  }
  const onSave = (val: ItemType) => {
    store.onCreateItem(val, false, true)
  };
  const onDeleteItem = () => {
    store.onDeleteItem(store.idItem as number)
    setIsShowEditModal(false)
    form.reset()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogPortal>
          <DialogOverlay>
            <DialogContent className="sm:max-w-[1000px] max-h-[870px] overflow-y-auto" showCloseButton={!isFullScreen}>
              <DialogHeader>
                <div className="flex flex-row justify-between items-center">
                  <DialogTitle className='pb-3'>{store.type === ActionType.EDIT ? "Edit item" : "Create item"}</DialogTitle>
                  {isOpenInPage && <Button variant="link" >View list</Button>}
                </div>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">

                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="name-1"
                              value={field.value ?? undefined}
                              onChange={(value) => {
                                field.onChange(value ?? null);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                  <FormMessage />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="url"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>URL</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="name-1"
                              value={field.value ?? undefined}
                              onChange={(value) => {
                                field.onChange(value ?? null);
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Description</FormLabel>
                          <FormControl>
                            <Textarea
                              className=' max-h-[78px] overflow-y-auto'
                              onChange={(value) => {
                                field.onChange(value ?? null);
                              }}
                              value={field.value ?? undefined}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="comments"
                    render={({ field }) => {
                      return (<FormItem>
                        <FormLabel>Comments</FormLabel>
                        <FormControl>
                          <Textarea
                            className=' max-h-[78px] overflow-y-auto'
                            onChange={(value) => {
                              field.onChange(value ?? null);
                            }}
                            value={field.value ?? undefined} />
                        </FormControl>
                      </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="grid gap-3">
                  <Label htmlFor="name-1"></Label>
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Image URL</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              id="name-1"
                              placeholder='https://'
                              value={field.value ?? undefined}
                              onChange={(value) => {
                                field.onChange(value ?? null);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <TagEdit
                              // type="text"
                              // id="name-1"
                              // value={field.value ?? undefined}
                              onChange={(value) => {
                                field.onChange(value ?? null);
                              }}
                              values={field.value ?? []}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>
                {store.type === ActionType.EDIT && <div className="grid gap-3">
                  <Label htmlFor="name-1"></Label>
                  <FormField
                    control={form.control}
                    name="created_at"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Created at</FormLabel>
                          <FormControl>
                            <Input
                              className='bg-gray-200 text-gray-500 cursor-not-allowed'
                              type="text"
                              id="name-1"
                              disabled
                              value={field.value ?? undefined}
                              onChange={(value) => {
                                field.onChange(value ?? null);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>}
                {store.type === ActionType.EDIT && <div className="grid gap-3">
                  <FormField
                    control={form.control}
                    name="updated_at"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Updated at</FormLabel>
                          <FormControl>
                            <Input
                              className='bg-gray-200 text-gray-500 cursor-not-allowed'
                              type="text"
                              id="name-1"
                              disabled
                              value={field.value ?? undefined}
                              onChange={(value) => {
                                field.onChange(value ?? null);
                              }}
                            />
                          </FormControl>
                        </FormItem>
                      );
                    }}
                  />
                </div>}

              </div>
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto order-2 sm:order-1">
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    type="submit"
                    variant="default"
                    className="w-full sm:w-auto order-1"
                  >
                    Save & Close
                  </Button>
                  {store.type === ActionType.EDIT && (
                    <Button
                      onClick={form.handleSubmit(onSubmitSaveCopy)}
                      type="button"
                      variant="secondary"
                      className="w-full sm:w-auto order-2"
                    >
                      Save as Copy
                    </Button>
                  )}
                  {store.type === ActionType.EDIT && (
                    <Button
                      onClick={form.handleSubmit(onSave)}
                      type="button"
                      variant="secondary"
                      className="w-full sm:w-auto order-3"
                    >
                      Save
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      if (isFullScreen) {
                        window.close()
                      } else {
                        store.fetchItems()
                        store.fetchTags()
                        setIsShowEditModal(false)
                        form.reset()
                      }
                    }}
                    type="reset"
                    variant="secondary"
                    className="w-full sm:w-auto order-4"
                  >
                    Close
                  </Button>
                </div>
                {store.type === ActionType.EDIT && (
                  <div className="order-1 sm:order-2 w-full sm:w-auto">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="w-full sm:w-auto"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your item.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row">
                          <AlertDialogCancel className="mt-2 sm:mt-0">Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={onDeleteItem}
                            className="bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </DialogFooter>
            </DialogContent >
          </DialogOverlay >
        </DialogPortal >
      </form >
    </Form >
  );
};

export default EditItemForm;
