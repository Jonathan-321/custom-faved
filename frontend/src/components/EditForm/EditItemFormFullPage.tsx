
// import React, { useContext, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { Button } from "@/components/ui/button"

// import { Input } from "@/components/ui/input"
// import { TagEdit } from "@/components/ui/tags"
// import { Textarea } from '../ui/textarea';
// import { StoreContext } from '@/store/storeContext';
// import z from 'zod';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
// import { formSchema } from './utils';
// import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
// import { ActionType } from '../dashboard/types';


// const EditItemFormfullPage = () => {
//   const store = useContext(StoreContext);

//   const initialData = {
//     id: "",
//     description: "",
//     comments: '',
//     created_at: undefined,
//     imageURL: undefined,
//     tags: [],
//     updated_at: undefined,
//     url: ''
//   }
//   const defaultValues = store.type === ActionType.EDIT && store.items.length > 0 ? store.items.filter(el => el.id === store.idItem)[0] : store.type === ActionType.CREATE ? initialData : {};

//   const form = useForm<z.infer<typeof formSchema>>({
//     resolver: zodResolver(formSchema),
//     defaultValues: defaultValues,
//   })
//   useEffect(() => {
//     form.reset(defaultValues)
//   }, [store.idItem])

//   const onSubmit = (val) => {
//     store.onCreateItem(val, false)
//     form.reset()
//   };
//   const onSubmitSaveCopy = (val) => {
//     store.onCreateItem(val, true)
//     form.reset()
//   }
//   const onSave = (val) => {
//     store.onCreateItem(val, false, true)
//   };
//   const onDeleteItem = () => {
//     store.onDeleteItem(store.idItem)
//     // setIsShowEditModal(false)
//     form.reset()
//   }

//   return (
//     <div className="flex items-center justify-center h-screen">
//       <Card className='w-[50%]' >
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)}>
//             <CardHeader className='pb-5'>
//               <div className="flex flex-row justify-between items-center">
//                 <CardTitle className="text-2xl">Create item</CardTitle>
//                 {/* <Button variant="link" >View list</Button> */}
//               </div>
//             </CardHeader >
//             <CardContent className="flex flex-col gap-4">
//               <div className="grid gap-4">
//                 <div className="grid gap-3">

//                   <FormField
//                     control={form.control}
//                     name="title"
//                     render={({ field }) => {
//                       return (
//                         <FormItem>
//                           <FormLabel>Title</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="text"
//                               id="name-1"
//                               value={field.value ?? undefined}
//                               onChange={(value) => {
//                                 field.onChange(value ?? null);
//                               }}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       );
//                     }}
//                   />
//                   <FormMessage />
//                 </div>
//                 <div className="grid gap-3">
//                   <FormField
//                     control={form.control}
//                     name="url"
//                     render={({ field }) => {
//                       return (
//                         <FormItem>
//                           <FormLabel>URL</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="text"
//                               id="name-1"
//                               value={field.value ?? undefined}
//                               onChange={(value) => {
//                                 field.onChange(value ?? null);
//                               }}
//                             />
//                           </FormControl>
//                           <FormMessage />
//                         </FormItem>
//                       );
//                     }}
//                   />
//                 </div>
//                 <div className="grid gap-3">
//                   <FormField
//                     control={form.control}
//                     name="description"
//                     render={({ field }) => {
//                       return (
//                         <FormItem>
//                           <FormLabel>Description</FormLabel>
//                           <FormControl>
//                             <Textarea
//                               className=' max-h-[78px] overflow-y-auto'
//                               onChange={(value) => {
//                                 field.onChange(value ?? null);
//                               }}
//                               value={field.value ?? undefined}
//                             />
//                           </FormControl>
//                         </FormItem>
//                       );
//                     }}
//                   />
//                 </div>
//                 <div className="grid gap-3">
//                   <FormField
//                     control={form.control}
//                     name="comments"
//                     render={({ field }) => {
//                       return (<FormItem>
//                         <FormLabel>Comments</FormLabel>
//                         <FormControl>
//                           <Textarea
//                             className=' max-h-[78px] overflow-y-auto'
//                             onChange={(value) => {
//                               field.onChange(value ?? null);
//                             }}
//                             value={field.value ?? undefined} />
//                         </FormControl>
//                       </FormItem>
//                       );
//                     }}
//                   />
//                 </div>
//                 <div className="grid gap-3">
//                   <FormField
//                     control={form.control}
//                     name="imageURL"
//                     render={({ field }) => {
//                       return (
//                         <FormItem>
//                           <FormLabel>Image URL</FormLabel>
//                           <FormControl>
//                             <Input
//                               type="text"
//                               id="name-1"
//                               placeholder='https://'
//                               value={field.value ?? undefined}
//                               onChange={(value) => {
//                                 field.onChange(value ?? null);
//                               }}
//                             />
//                           </FormControl>
//                         </FormItem>
//                       );
//                     }}
//                   />
//                 </div>
//                 <div className="grid gap-3 justify-start">
//                   <FormField
//                     control={form.control}
//                     name="tags"
//                     render={({ field }) => {
//                       return (
//                         <FormItem>
//                           <FormLabel>Tags</FormLabel>
//                           <FormControl>
//                             <TagEdit
//                               // className={styles.input}
//                               // type="text"
//                               // id="name-1"
//                               value={field.value ?? undefined}
//                               onChange={(value) => {
//                                 field.onChange(value ?? null);
//                               }}
//                               values={field.value ?? []}
//                             />
//                           </FormControl>
//                         </FormItem>
//                       );
//                     }}
//                   />
//                 </div>
//                 <div className="grid gap-3">
//                   <FormField
//                     control={form.control}
//                     name="created_at"
//                     render={({ field }) => {
//                       return (
//                         <FormItem>
//                           <FormLabel>Created at</FormLabel>
//                           <FormControl>
//                             <Input
//                               className='bg-gray-200 text-gray-500 cursor-not-allowed'
//                               type="text"
//                               id="name-1"
//                               disabled
//                               value={field.value ?? undefined}
//                               onChange={(value) => {
//                                 field.onChange(value ?? null);
//                               }}
//                             />
//                           </FormControl>
//                         </FormItem>
//                       );
//                     }}
//                   />
//                 </div>
//                 <div className="grid gap-3">
//                   <FormField
//                     control={form.control}
//                     name="updated_at"
//                     render={({ field }) => {
//                       return (
//                         <FormItem>
//                           <FormLabel>Updated at</FormLabel>
//                           <FormControl>
//                             <Input
//                               className='bg-gray-200 text-gray-500 cursor-not-allowed'
//                               type="text"
//                               id="name-1"
//                               disabled
//                               value={field.value ?? undefined}
//                               onChange={(value) => {
//                                 field.onChange(value ?? null);
//                               }}
//                             />
//                           </FormControl>
//                         </FormItem>
//                       );
//                     }}
//                   />
//                 </div>
//               </div>
//             </CardContent>
//             <CardFooter className='pt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end'>
//               <Button onClick={form.handleSubmit(onSubmit)} type="submit" variant="default">Save</Button>
//               <Button onClick={form.handleSubmit(onSubmitSaveCopy)} type="submit" variant="secondary">Save as Copy</Button>
//               {/* <Button onClick={form.handleSubmit(onSave)} type="submit" variant="secondary">Save</Button> */}
//               <Button onClick={() => {
//                 // setIsShowEditModal(false)
//                 form.reset()
//               }} type="reset" variant="secondary">Close</Button>
//               <Button onClick={onDeleteItem} variant="destructive">Delete</Button>
//             </CardFooter>
//           </form >
//         </Form >
//       </Card >
//     </div >
//   );
// };

// export default EditItemFormfullPage;



import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogOverlay,
  DialogPortal,
  Dialog
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


const EditItemForm: React.FC<{ setIsShowEditModal: (val: boolean) => void }> = ({ setIsShowEditModal }) => {
  const store = useContext(StoreContext);
  const [isOpenInPage] = useState(false)
  const initialData = {
    id: "",
    description: "",
    comments: '',
    created_at: undefined,
    image: undefined,
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

  const onSubmit = (val: ItemType) => {
    store.onCreateItem(val, false)
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
    <Dialog open={true}> <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <DialogPortal>
          <DialogOverlay className="DialogOverlay">
            <DialogContent className="sm:max-w-[1000px] max-h-[870px] overflow-y-auto">
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
              <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 gap-2">
                {/* Основные кнопки */}
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <Button
                    onClick={() => {
                      store.fetchItems()
                      store.fetchTags()
                      setIsShowEditModal(false)
                      form.reset()
                    }}
                    type="reset"
                    variant="secondary"
                    className="w-full sm:w-auto"
                  >
                    Close
                  </Button>

                  {store.type === ActionType.EDIT && (
                    <Button
                      onClick={form.handleSubmit(onSave)}
                      type="button"
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      Save
                    </Button>
                  )}

                  {store.type === ActionType.EDIT && (
                    <Button
                      onClick={form.handleSubmit(onSubmitSaveCopy)}
                      type="button"
                      variant="secondary"
                      className="w-full sm:w-auto"
                    >
                      Save as Copy
                    </Button>
                  )}

                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    type="submit"
                    variant="default"
                    className="w-full sm:w-auto"
                  >
                    Save & Close
                  </Button>
                </div>

                {/* Кнопка Delete - всегда внизу на мобильных и справа на десктопе */}
                {store.type === ActionType.EDIT && (
                  <Button
                    onClick={onDeleteItem}
                    variant="destructive"
                    className="w-full sm:w-auto order-first sm:order-last mt-2 sm:mt-0"
                  >
                    Delete
                  </Button>
                )}
              </DialogFooter>
            </DialogContent >
          </DialogOverlay >
        </DialogPortal >
      </form >
    </Form ></Dialog>

  );
};

export default EditItemForm;
