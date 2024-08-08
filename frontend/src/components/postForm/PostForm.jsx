import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TagsInput from "react-tagsinput";
import "react-tagsinput/react-tagsinput.css";
import "./PostForm.css";
import Input from "../common/Input";
import RTE from "../common/RTE";
import Button from "../common/Button";
import PostService from "../../services/postServices";
import TagService from "../../services/tagServices";
import { useNavigate } from "react-router-dom";
import Select from "../common/Select";
import CategoryService from "../../services/categoryServices";
// ------------
import { MdOutlineSubtitles, MdOutlineDescription } from "react-icons/md";
// import { TbCategoryPlus } from "react-icons/tb";

function PostForm({ post }) {
  const navigate = useNavigate();
  const { register, handleSubmit, control, getValues } = useForm({
    defaultValues: {
      title: post?.title || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
    },
  });
  const [allTags, setAllTags] = useState([]);
  const [tags, setTags] = useState([]);
  const [category, setCategory] = useState([]);
  // const [selectedCategory, setSelectedCategory] = useState("");
  useEffect(() => {
    TagService.getAllTags()
      .then((result) => {
        setAllTags(result);
      })
      .catch((error) => {
        console.log(error.message);
      });
    CategoryService.getAllCategory()
      .then((result) => {
        // console.log("CAT RESULT :", result);
        setCategory(result);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const submit = async (data) => {
    try {
      const categoryId = category.filter((cat) => cat.name === data.category)[0]
        ._id;

      if (!post) {
        // const blog = { data: { _id: "66ad79d2462e83c47c99dbae" } };
        const blog = await PostService.postBlog(data);
        if (blog) {
          if (tags.length === 0) {
            console.log("No tags to process");
            return;
          }

          const blogId = blog.data._id;
          const tagPromises = tags.map(async (tag) => {
            let tagId;
            const existingTag = allTags.find((t) => t.name === tag);
            if (existingTag) {
              tagId = existingTag._id;
            } else {
              const newTagResponse = await TagService.addTag({ name: tag });
              tagId = newTagResponse.data._id;
              console.log("Tag Added Successfully");
            }
            await TagService.addPostTag({ tagId, blogId });
            await CategoryService.addPostCategory({
              blogId: blogId,
              categoryId: categoryId,
            });

            console.log("Blog Posted Successfully");
          });

          await Promise.all(tagPromises);

          navigate("/myblogs");
        }
      }
    } catch (error) {
      console.error("Error submitting the form:", error);
    }
  };

  const handleChange = (tags) => {
    setTags(tags);
  };


  return (
    <form onSubmit={handleSubmit(submit)} className="post-form-container">
      <div className="post-form">
        <div className="sec-1">
          <Input
            Icon={MdOutlineSubtitles}
            type="text"
            placeholder="Title"
            {...register("title", { register: true })}
          />
          <Input
            type="text"
            placeholder="excerpt"
            {...register("excerpt")}
            Icon={MdOutlineDescription}
          />
          <RTE
            name="content"
            control={control}
            defaultValue={getValues("content")}
          />

          <TagsInput value={tags} onChange={handleChange} maxTags={3} />

          <Select
        
            label="Category : "
            placeholder="Select Category"
            options={category?.map((cat) => cat.name)}
            {...register("category", { required: true })}
          />
        </div>
        <div className="sec-2">
          <Input
            type="file"
            label="Thumbnail"
            placeholder="Blog Thumbnail"
            accept="image/png, image/jpg, image/jpeg, image/gif"
            {...register("thumbnail", { required: !post })}
          />
        </div>
        <Button type="submit">{post ? "Update" : "Submit"}</Button>
      </div>
    </form>
  );
}

export default PostForm;
