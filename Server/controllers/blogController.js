import fs from "fs"
import imagekit from "../Config/imageKit.js";
import Blog from "../modals/Blog.js";
import Comment from "../modals/Comment.js";
import main from "../Config/Gemini.js";


export const addBlog = async (req, res) => {
    try {

        console.log(req.body);
        const { title, subTitle, description, category, isPublished } = JSON.parse(req.body.blog);

        const imageFile = req.file;
        console.log(req.file);

        if (!title || !description || !subTitle || !category || !imageFile) {
            return res.json({ success: true, message: "Missing required Fileds" })
        }

        const fileBuffer = fs.readFileSync(imageFile.path)

        const response = await imagekit.upload({
            file: fileBuffer,
            fileName: imageFile.originalname,
            folder: "/blogs"
        })

        const optimizedImageUrl = imagekit.url({
            path: response.filePath,
            transformation: [
                { quality: 'auto' },
                { format: 'webp' },
                { width: '1280' }
            ]
        })

        const image = optimizedImageUrl;

        await Blog.create({ title, subTitle, description, category, image, isPublished })

        res.json({ success: true, message: "Blog Added succesfully" })

    } catch (error) {

        res.json({ success: false, message: error.message })

    }

}


export const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find({ isPublished: true })
        res.json({ success: true, blogs })

    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

export const getBlogById = async (req, res) => {
    try {
        const { blogId } = req.params;
        const blog = await Blog.findById(blogId)

        if (!blog) {
            res.json({ success: false, message: "Blog Not Found" })
        }
        res.json({ success: true, blog })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}


export const deleteBlogById = async (req, res) => {
    try {
        const { id } = req.body;
        await Blog.findByIdAndDelete(id);


        await Comment.deleteMany({ blog: id })

        res.json({ success: true, message: "Blog Deleted Succesfully" })
    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}

export const togglePublish = async (req, res) => {
    try {
        const { id } = req.body;
        const blog = await Blog.findById(id);

        blog.isPublished = !blog.isPublished;

        await blog.save();
        res.json({ success: true, message: "Blog Status Updated" })

    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}


export const addComment = async (req, res) => {
    try {
        const { blog, name, content } = req.body;

        await Comment.create({ blog, name, content });

        res.json({ success: true, message: "comment added for review" })

    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}


export const getBlogComment = async (req, res) => {
    try {
        const { blogid } = req.body;
        console.log(req.body)
        const comments = await Comment.find({ blog: blogid, isApproved: true }).sort({ createdAt: -1 });
        res.json({ success: true, comments })

    } catch (error) {
        res.json({ success: false, message: error.message })

    }
}


export const generateContent = async (req, res) => {
    try {
        const { prompt } = req.body;
        const content = await main(prompt + 'Generate a blog content for this topic in simple text format')
        res.json({ success: true, content })
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}

