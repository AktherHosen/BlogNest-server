# Blog Nest

Blog Nest allows users to explore, create, and engage with blog posts across various categories. Authenticated users can add, edit, delete their own blogs, comment on others' posts, and manage a personalized wishlist of favorite blogs. Public users can browse and filter blogs, search by title, and view featured or latest posts. The platform offers a smooth, responsive experience with user-friendly navigation, customizable themes, and interactive elements for enhanced engagement.

## Features

### Responsivenes

- The website is fully responsive and optimized for mobile, tablet, and desktop views, ensuring a seamless experience

### Authentication

- Supports secure login and registration using email and password credentials.
- Integration with Google and GitHub for convenient, secure sign-in options.
- Implements JWT for stateless authentication, ensuring secure user sessions and token-based authorization.
- Maintains secure user sessions, ensuring the authentication status is preserved across the website during navigation.

### Authenticated User Permissions

- Authenticated users can create and publish new blog posts.
- Users can edit their own blog posts to update or modify content.
- Users have the ability to delete their own blog posts.
- Users can comment on blog posts written by other users, enhancing interaction and engagement on the platform. However, they cannot comment on their own blogs.
- Authenticated users can add any blog to their wishlist for future reference but each blog can only be added to a user's wishlist once, preventing duplicate entries.
- All wishlisted blogs are stored on the user's dedicated wishlist page, where users can view and manage their saved blogs.
- Users can remove blogs from their wishlist directly from the wishlist page.

### Public User Features (Unauthenticated)

- Visitors can browse and view all blog posts without the need to log in or authenticate.
- Visitors can filter blog posts based on specific categories for easy content discovery also a search functionality is available, allowing users to find blog posts by entering title and any word.
- Users can view top featured blog posts and sort them in ascending or descending order based on various criteria.
- The homepage showcases the most recent blog posts, allowing visitors to easily access the latest content.

## Acknowledgements

- [node js](https://nodejs.org/en/learn/getting-started/an-introduction-to-the-npm-package-manager)
- [express](https://www.npmjs.com/package/express)
- [mongodb](https://www.mongodb.com/docs/)
- [cookie-parser](https://www.npmjs.com/package/react-fast-marquee)
- [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken)
- [dontenv](https://www.npmjs.com/package/dotenv)

## API Reference

#### Get all Blogs

```https://blog-nest-server.vercel.app
  GET /blogs
```

#### Post Blog

```https://blog-nest-server.vercel.app
  GET /blog
```

#### Get single Blog

```https://blog-nest-server.vercel.app
  GET /blog/:id
```

#### Update Blog Post

```https://blog-nest-server.vercel.app
  PUT /blogs
```

#### Get All Comment

```https://blog-nest-server.vercel.app
  GET /comments
```

#### Post a comment

```https://blog-nest-server.vercel.app
  POST /comments
```

#### GET Wishlist

```https://blog-nest-server.vercel.app
  GET /wishlisht
  need email as a query
```

#### Add to wishlist

```https://artcraft-server.vercel.app
  POST /wishlist
```

#### Delete from wishlist

```https://artcraft-server.vercel.app
  DELETE /wishlist
```

### Get all post with query like (search and filter)

````https://artcraft-server.vercel.app
  GET /all-blogs

## Installation

Install my-project with npm

```bash
  git clone https://github.com/AktherHosen/BlogNest-client
  npm init
  npm install
````

## Deployment

To deploy this project in you localhost run

```bash
  nodemon index.js
  npm run dev

```

## Tech Stack

**Client:** React, React Router DOM, TailwindCSS, Flowbite, Firebase.

**Server:** Node, Express, MongoDB, JWT

## Live

### Client

https://blog-nest-9b582.web.app/

### Server

https://blog-nest-server.vercel.app
