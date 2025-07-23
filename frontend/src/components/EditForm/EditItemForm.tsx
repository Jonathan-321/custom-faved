import React, { useEffect } from 'react';
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


const EditItemForm = (data: any) => {
  console.log('data', data)
  const defaultValues = data.data;
  const { reset, register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: defaultValues
  });
  useEffect(() => {
    reset(defaultValues)
  }, [])
  const onSubmit = (val) => {
    console.log(val); // Handle form submission, e.g., send data to API
  };

  return (

    <Dialog >
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <div className={styles.header}>         
              <DialogTitle>Edit item</DialogTitle>
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
              <Label htmlFor="name-1">Comments</Label>
              <Controller
                control={control}
                name="comments"
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
            <Button type="submit" variant="default">Save & Back</Button>
            <Button type="submit" variant="secondary">Save as Copy</Button>
            <Button type="submit"variant="secondary">Save</Button>
            <Button type="submit"variant="secondary">Back</Button>
            {/* <DialogClose asChild> */}
 
   <Button variant="destructive">Delete</Button>


            {/* </DialogClose> */}

          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>



  );
};

export default EditItemForm;