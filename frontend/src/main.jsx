import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthLayout, CategoryPage } from "./components/index.js";
import {
  Bookmarks,
  Category,
  Explore,
  History,
  Home,
  LoginPage,
  SignupPage,
  Tags,
  Search,
  AddPost,
  Profile,
  MyBlogs,
  BlogPage,
  TagPage,
} from "./pages/index.js";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "categories",
        element: <Category />,
      },
      {
        path: "tags/tag/:slug",
        element: <TagPage />,
      },
      {
        path: "categories/category/:slug",
        element: <CategoryPage />,
      },
      {
        path: "explore",
        element: <Explore />,
      },
      {
        path: "tags",
        element: <Tags />,
      },
      {
        path: "blogs/blog/:slug",
        element: <BlogPage />,
      },

      {
        path: "bookmarks",
        element: (
          <AuthLayout authentication>
            <Bookmarks />
          </AuthLayout>
        ),
      },
      {
        path: "history",
        element: (
          <AuthLayout authentication>
            <History />
          </AuthLayout>
        ),
      },
      {
        path: "search",
        element: <Search />,
      },
      {
        path: "addpost",
        element: (
          <AuthLayout authentication>
            <AddPost />
          </AuthLayout>
        ),
      },
      {
        path: "profile",
        element: (
          <AuthLayout authentication>
            <Profile />
          </AuthLayout>
        ),
      },
      {
        path: "myblogs",
        element: (
          <AuthLayout authentication>
            <MyBlogs />
          </AuthLayout>
        ),
      },
      {
        path: "login",
        element: (
          <AuthLayout authentication={false}>
            <LoginPage />
          </AuthLayout>
        ),
      },
      {
        path: "signup",
        element: (
          <AuthLayout authentication={false}>
            <SignupPage />
          </AuthLayout>
        ),
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  // </React.StrictMode>
);
