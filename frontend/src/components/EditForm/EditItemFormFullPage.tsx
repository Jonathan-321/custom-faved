
import React, { useContext, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"

import { Input } from "@/components/ui/input"
import { TagEdit } from "@/components/ui/tags"
import { Textarea } from '../ui/textarea';
import { StoreContext } from '@/store/storeContext';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import { formSchema } from './utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ActionType } from '../dashboard/types';


const EditItemFormfullPage = () => {
  const store = useContext(StoreContext);

  const initialData = {
    id: "",
    description: "",
    comments: '',
    created_at: undefined,
    imageURL: undefined,
    tags: [],
    updated_at: undefined,
    url: ''
  }
  const defaultValues = store.type === ActionType.EDIT && store.items.length > 0 ? store.items.filter(el => el.id === store.idItem)[0] : store.type === ActionType.CREATE ? initialData : {};

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues,
  })
  useEffect(() => {
    form.reset(defaultValues)
  }, [store.idItem])

  const onSubmit = (val) => {
    store.onCreateItem(val, false)
    form.reset()
  };
  const onSubmitSaveCopy = (val) => {
    store.onCreateItem(val, true)
    form.reset()
  }
  const onSave = (val) => {
    store.onCreateItem(val, false, true)
  };
  const onDeleteItem = () => {
    store.onDeleteItem(store.idItem)
    // setIsShowEditModal(false)
    form.reset()
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className='w-[50%]' >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardHeader className='pb-5'>
              <div className="flex flex-row justify-between items-center">
                <CardTitle className="text-2xl">Create item</CardTitle>
                {/* <Button variant="link" >View list</Button> */}
              </div>
            </CardHeader >
            <CardContent className="flex flex-col gap-4">
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
                  <FormField
                    control={form.control}
                    name="imageURL"
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
                <div className="grid gap-3 justify-start">
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Tags</FormLabel>
                          <FormControl>
                            <TagEdit
                              // className={styles.input}
                              // type="text"
                              // id="name-1"
                              value={field.value ?? undefined}
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
                <div className="grid gap-3">
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
                </div>
                <div className="grid gap-3">
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
                </div>
              </div>
            </CardContent>
            <CardFooter className='pt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
              <Button onClick={form.handleSubmit(onSubmit)} type="submit" variant="default">Save</Button>
              <Button onClick={form.handleSubmit(onSubmitSaveCopy)} type="submit" variant="secondary">Save as Copy</Button>
              {/* <Button onClick={form.handleSubmit(onSave)} type="submit" variant="secondary">Save</Button> */}
              <Button onClick={() => {
                // setIsShowEditModal(false)
                form.reset()
              }} type="reset" variant="secondary">Close</Button>
              <Button onClick={onDeleteItem} variant="destructive">Delete</Button>
            </CardFooter>
          </form >
        </Form >
      </Card >
    </div >
  );
};

export default EditItemFormfullPage;
