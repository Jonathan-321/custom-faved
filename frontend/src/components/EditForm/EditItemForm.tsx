import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import s from "./editForm.module.scss"

const EditItemForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      title: 'How to Migrate Your Data from Pocket to Faved | Faved - Organize Your Bookmarks',
      url: 'https://faved.dev/blog/migrate-pocket-to-faved',
      description: 'Pocket is shutting down on July 8, 2025. As a privacy-first alternative, Faved lets you organize and manage your bookmarks while keeping full ownership of your data. Learn how to migrate your data from Pocket to Faved in a few simple steps.',
      imageUrl: 'https://',
      tags: 'Faved / Welcome',
      // created_at and updated_at are usually handled server-side
    }
  });

  const onSubmit = (data) => {
    console.log(data); // Handle form submission, e.g., send data to API
  };

  return (
    <Dialog>
      <DialogTrigger>Open</DialogTrigger>


      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>

          <DialogHeader>
            <DialogTitle>Edit item</DialogTitle>
            <DialogDescription>
              {/* This action cannot be undone. This will permanently delete your account
                and remove your data from our servers. */}
            </DialogDescription>
          </DialogHeader>
          <div>
            <input type="text" id="title" {...register("title", { required: "Title is required" })} />
            {errors.title && <p>{errors.title.message}</p>}


            <div>
              <label htmlFor="url">URL</label>
              <input type="url" id="url" {...register("url", {
                required: "URL is required",
                pattern: {
                  value: /^(http|https):\/\/[^ "]+$/,
                  message: "Invalid URL format"
                }
              })} />
              {errors.url && <p>{errors.url.message}</p>}
            </div>

            <div>
              <label htmlFor="description">Description</label>
              <textarea id="description" {...register("description")} />
            </div>

            <div>
              <label htmlFor="comments">Comments</label>
              <textarea id="comments" {...register("comments")} />
            </div>

            <div>
              <label htmlFor="imageUrl">Image URL</label>
              <input type="url" id="imageUrl" {...register("imageUrl")} /> {/* Changed to type="url" */}
            </div>

            <div>
              <label htmlFor="tags">Tags</label>
              <input type="text" id="tags" {...register("tags")} /> {/* Changed to type="text" */}
            </div>

          </div>

          {/* ... (created at and updated at fields) */}
          <div className={s.btnsFooter}>      
            <button type="submit">Save & Back</button>
            <button type="button">Save as Copy</button>
            <button type="submit">Save</button>
            <button type="button">Back</button>
            <button type="button">Delete</button></div>

        </DialogContent>
      </form>

    </Dialog>

  );
};

export default EditItemForm;