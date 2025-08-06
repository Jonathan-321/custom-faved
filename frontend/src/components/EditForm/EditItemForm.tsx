
import React, { useContext, useEffect, useState } from 'react';
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
  DialogOverlay,
  DialogPortal
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TagEdit } from "@/components/ui/tags"


import styles from "./editForm.module.scss"
import { Textarea } from '../ui/textarea';
import { ActionType } from '@/components/dashboard/page';
import { StoreContext } from '@/store/storeContext';


const EditItemForm: React.FC<{ setIsShowEditModal: any }> = ({ setIsShowEditModal }) => {
  const store = useContext(StoreContext);
  const [isOpenInPage, setIsOpenInPage] = useState(false)
  const initialData = {
    id: "",
    description: "",
    comments: '',
    created_at: undefined,
    imageURL: undefined,
    tags: undefined,
    updated_at: undefined,
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
  console.log('defaultValues', defaultValues)
  const onSubmit = (val) => {
    store.onCreateItem(val, false)
    setIsShowEditModal(false)
    reset()
  };
  const onSubmitSaveCopy = (val) => {
    store.onCreateItem(val, true)
    setIsShowEditModal(false)
    reset()
  }
  const onSave = (val) => {
    store.onCreateItem(val, false, true)
  };
  const onDeleteItem = () => {
    store.onDeleteItem(store.idItem)
    setIsShowEditModal(false)
    reset()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>

      <DialogPortal>
        <DialogOverlay className="DialogOverlay">

          <DialogContent className="sm:max-w-[1000px] overflow-y-auto">
            <DialogHeader>
              <div className={styles.header}>
                <DialogTitle>{store.type === ActionType.EDIT ? "Edit item" : "Create item"}</DialogTitle>
                {isOpenInPage && <Button variant="link" >View list</Button>}
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
                  name="title"
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
                        placeholder='https://'
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
                      <TagEdit
                        className={styles.input}
                        // type="text"
                        // id="name-1"
                        value={field.value ?? undefined}
                        // style={{ marginLeft: 5 }}
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
                  name="created_at"
                  render={({ field }) => {
                    return (
                      <Input
                        className={styles.input}
                        type="text"
                        id="name-1"
                        disabled
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
                  name="updated_at"
                  render={({ field }) => {
                    return (
                      <Input
                        className={styles.input}
                        type="text"
                        id="name-1"
                        disabled
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
              <Button onClick={handleSubmit(onSubmit)} type="submit" variant="default">Save & Close</Button>
              <Button onClick={handleSubmit(onSubmitSaveCopy)} type="submit" variant="secondary">Save as Copy</Button>
              <Button onClick={handleSubmit(onSave)} type="submit" variant="secondary">Save</Button>
              <Button onClick={() => {
                setIsShowEditModal(false)
                reset()
              }} type="reset" variant="secondary">Close</Button>
              <Button onClick={onDeleteItem} variant="destructive">Delete</Button>
            </DialogFooter>
          </DialogContent>
        </DialogOverlay>
      </DialogPortal>
    </form>





  );
};

export default EditItemForm;
