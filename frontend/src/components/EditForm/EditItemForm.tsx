
import React, { useContext, useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


import styles from "./editForm.module.scss"
import { Textarea } from '../ui/textarea';
import { ActionType } from '@/app/dashboard/page';
import { StoreContext } from '@/store/storeContext';


const EditItemForm: React.FC<{ setIsShowEditModal: any }> = ({ setIsShowEditModal }) => {
  const store = useContext(StoreContext);
  const initialData = {
    id: "",
    description: "",
    comments: '',
    createdAt: undefined,
    imageURL: undefined,
    tags: undefined,
    updatedAt: undefined,
    url: ''
  }
  const defaultValues = store.type === ActionType.EDIT && store.items.length > 0 ? store.items.filter(el => el.id === store.idItem)[0] : store.type === ActionType.CREATE ? initialData : {};
  const { reset, register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: defaultValues
  });
  useEffect(() => {
    reset(defaultValues)
  }, [store.idItem])
  console.log('store.idItem', store.idItem)
  const onSubmit = (val) => {

    console.log('val', val)

    const options = {
      method: store.type === ActionType.EDIT ? 'PATCH' : 'POST',
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

    fetch('http://localhost:8000/index.php?route=%2Fitems' + (store.type === ActionType.EDIT ? `&item-id=${val.id}` : ''), options)
      .then(response => response.json())
      .then(response => console.log(response))
      .catch(err => console.error(err))
      .finally(() => {
        store.fetchItems()
      })
    setIsShowEditModal(false)
    reset()


  };

  return (

    // <Dialog >
    <div>   <form onSubmit={handleSubmit(onSubmit)}>

      <DialogContent className="sm:max-w-[1000px]">
        <DialogHeader>
          <div className={styles.header}>
            <DialogTitle>{store.type === ActionType.EDIT ? "Edit item" : "Create item"}</DialogTitle>
            <Button variant="link" >View list</Button>
          </div>

          {/* <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription> */}
        </DialogHeader>
        <div className="grid gap-4">
          <div className={styles.infoBlock}>
            <Label htmlFor="name-1">Title</Label>
            <Controller
              control={control}
              name="url"
              render={({ field }) => {
                return (
                  <Input
                    className={styles.input}
                    type="text"
                    id="name-1"
                    value={field.value ?? undefined}
                    style={{ marginLeft: 5 }}
                    onChange={(value) => {
                      field.onChange(value ?? null);
                    }}
                  />
                );
              }}
            />
            {/* <ValidationMessage message={errors.fileName?.message} /> */}
          </div>
          <div className={styles.infoBlock}>
            <Label htmlFor="name-1">URL</Label>
            <Controller
              control={control}
              name="url"
              render={({ field }) => {
                return (
                  <Input
                    className={styles.input}
                    type="text"
                    id="name-1"
                    value={field.value ?? undefined}
                    style={{ marginLeft: 5 }}
                    onChange={(value) => {
                      field.onChange(value ?? null);
                    }}
                  />
                );
              }}
            />
            {/* <ValidationMessage message={errors.fileName?.message} /> */}
          </div>
          <div className={styles.infoBlock}>
            <Label htmlFor="name-1">Description</Label>
            <Controller
              control={control}
              name="description"
              render={({ field }) => {
                return (
                  <Textarea
                    onChange={(value) => {
                      field.onChange(value ?? null);
                    }} className={styles.input} placeholder="Type your message here." value={field.value ?? undefined} style={{ marginLeft: 5 }} />

                );
              }}
            />
            {/* <ValidationMessage message={errors.fileName?.message} /> */}
          </div>
          <div className={styles.infoBlock}>
            <Label htmlFor="name-1">Comments</Label>
            <Controller
              control={control}
              name="comments"
              render={({ field }) => {
                return (
                  <Textarea
                    onChange={(value) => {
                      field.onChange(value ?? null);
                    }} className={styles.input} placeholder="Type your message here." value={field.value ?? undefined} style={{ marginLeft: 5 }} />
                );
              }}
            />
            {/* <ValidationMessage message={errors.fileName?.message} /> */}
          </div>
          <div className={styles.infoBlock}>
            <Label htmlFor="name-1">Image URL</Label>
            <Controller
              control={control}
              name="imageURL"
              render={({ field }) => {
                return (
                  <Input
                    className={styles.input}
                    type="text"
                    id="name-1"
                    value={field.value ?? undefined}
                    style={{ marginLeft: 5 }}
                    onChange={(value) => {
                      field.onChange(value ?? null);
                    }}
                  />
                );
              }}
            />
            {/* <ValidationMessage message={errors.fileName?.message} /> */}
          </div>
          <div className={styles.infoBlock}>
            <Label htmlFor="name-1">Tags</Label>
            <Controller
              control={control}
              name="tags"
              render={({ field }) => {
                return (
                  <Input
                    className={styles.input}
                    type="text"
                    id="name-1"
                    value={field.value ?? undefined}
                    style={{ marginLeft: 5 }}
                    onChange={(value) => {
                      field.onChange(value ?? null);
                    }}
                  />
                );
              }}
            />
            {/* <ValidationMessage message={errors.fileName?.message} /> */}
          </div>
          <div className={styles.infoBlock}>
            <Label htmlFor="name-1">Created at</Label>
            <Controller
              control={control}
              name="createdAt"
              render={({ field }) => {
                return (
                  <Input
                    className={styles.input}
                    type="text"
                    id="name-1"
                    value={field.value ?? undefined}
                    style={{ marginLeft: 5 }}
                    onChange={(value) => {
                      field.onChange(value ?? null);
                    }}
                  />
                );
              }}
            />
            {/* <ValidationMessage message={errors.fileName?.message} /> */}
          </div>
          <div className={styles.infoBlock}>
            <Label htmlFor="name-1">Updated at</Label>
            <Controller
              control={control}
              name="updatedAt"
              render={({ field }) => {
                return (
                  <Input
                    className={styles.input}
                    type="text"
                    id="name-1"
                    value={field.value ?? undefined}
                    style={{ marginLeft: 5 }}
                    onChange={(value) => {
                      field.onChange(value ?? null);
                    }}
                  />
                );
              }}
            />
            {/* <ValidationMessage message={errors.fileName?.message} /> */}
          </div>

        </div>
        <DialogFooter>
          <Button onClick={handleSubmit(onSubmit)} type="submit" variant="default">Save & Back</Button>
          <Button type="submit2" variant="secondary">Save as Copy</Button>
          <Button type="submit3" variant="secondary">Save</Button>
          <Button type="submit4" variant="secondary">Back</Button>
          {/* <DialogClose asChild> */}

          <Button variant="destructive">Delete</Button>


          {/* </DialogClose> */}

        </DialogFooter>
      </DialogContent>
    </form></div >





  );
};

export default EditItemForm;
// import { Button } from "@/components/ui/button"
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"

// export const EditItemForm = () => {
//   return (
//     <Dialog>
//       <form>
//         <DialogTrigger asChild>
//           <Button variant="outline">Open Dialog</Button>
//         </DialogTrigger>
//         <DialogContent className="sm:max-w-[425px]">
//           <DialogHeader>
//             <DialogTitle>Edit profile</DialogTitle>
//             <DialogDescription>
//               Make changes to your profile here. Click save when you&apos;re
//               done.
//             </DialogDescription>
//           </DialogHeader>
//           <div className="grid gap-4">
//             <div className="grid gap-3">
//               <Label htmlFor="name-1">Name</Label>
//               <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
//             </div>
//             <div className="grid gap-3">
//               <Label htmlFor="username-1">Username</Label>
//               <Input id="username-1" name="username" defaultValue="@peduarte" />
//             </div>
//           </div>
//           <DialogFooter>
//             <DialogClose asChild>
//               <Button variant="outline">Cancel</Button>
//             </DialogClose>
//             <Button type="submit">Save changes</Button>
//           </DialogFooter>
//         </DialogContent>
//       </form>
//     </Dialog>
//   )
// }
// export default EditItemForm;