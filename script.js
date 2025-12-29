/**
 * Simple Blog Logic
 * This script handles all the interactions for our blog, including:
 * - Creating new posts
 * - Reading and displaying posts
 * - Updating existing posts
 * - Deleting posts
 * - Saving everything to the browser's LocalStorage
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Elements ---
    const postsContainer = document.getElementById('postsContainer');
    const blogForm = document.getElementById('blogForm');
    const blogModal = document.getElementById('blogModal');
    const viewPostModal = document.getElementById('viewPostModal');

    // Buttons
    const newPostBtn = document.getElementById('newPostBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelBtn = document.getElementById('cancelBtn');
    const closeViewModalX = document.getElementById('closeViewModalX');
    const closeViewModalBtn = document.getElementById('closeViewModalBtn');

    // Form Inputs
    const postIdInput = document.getElementById('postId');
    const titleInput = document.getElementById('title');
    const descriptionInput = document.getElementById('description');
    const imageInput = document.getElementById('image');
    const modalTitle = document.getElementById('modalTitle');
    const savePostBtn = document.getElementById('savePostBtn');

    // View Content Area
    const viewPostContent = document.getElementById('viewPostContent');

    // --- 2. State management ---
    let posts = JSON.parse(localStorage.getItem('myBlogPosts')) || [];

    // --- 3. Functions ---

    const saveToLocalStorage = () => {
        localStorage.setItem('myBlogPosts', JSON.stringify(posts));
    };

    const renderPosts = () => {
        postsContainer.innerHTML = '';

        if (posts.length === 0) {
            postsContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-muted); padding: 2rem;">No posts yet. Be the first to share a story!</p>';
            return;
        }

        posts.forEach(post => {
            const postElement = document.createElement('article');
            postElement.className = 'post';

            const imageUrl = post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop';

            postElement.innerHTML = `
                <div class="post-img-container">
                    <img src="${imageUrl}" alt="${post.title}">
                </div>
                <div class="post-content">
                    <h3 class="post-title">${post.title}</h3>
                    <p class="post-excerpt">${post.description}</p>
                    <div class="post-actions">
                        <button class="btn btn-outline btn-sm" onclick="viewPost(${post.id})">Read More</button>
                        <button class="btn btn-secondary btn-sm" onclick="editPost(${post.id})">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="deletePost(${post.id})">Delete</button>
                    </div>
                </div>
            `;
            postsContainer.appendChild(postElement);
        });
    };

    const openCreateModal = () => {
        blogForm.reset();
        postIdInput.value = '';
        modalTitle.innerText = 'Create New Post';
        savePostBtn.innerText = 'Publish Post';
        blogModal.classList.add('active');
    };

    const closeModals = () => {
        blogModal.classList.remove('active');
        viewPostModal.classList.remove('active');
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        const title = titleInput.value;
        const description = descriptionInput.value;
        const image = imageInput.value;
        const id = postIdInput.value;

        if (id) {
            const index = posts.findIndex(p => p.id == id);
            if (index !== -1) {
                posts[index] = { ...posts[index], title, description, image };
            }
        } else {
            const newPost = {
                id: Date.now(),
                title,
                description,
                image,
                date: new Date().toLocaleDateString()
            };
            posts.unshift(newPost);
        }

        saveToLocalStorage();
        renderPosts();
        closeModals();
    };

    window.viewPost = (id) => {
        const post = posts.find(p => p.id == id);
        if (post) {
            const imageUrl = post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1000&auto=format&fit=crop';
            viewPostContent.innerHTML = `
                <img src="${imageUrl}" class="view-img" alt="${post.title}">
                <p style="color: var(--primary); font-weight: 500; margin-bottom: 0.5rem;">${post.date || ''}</p>
                <div class="view-content">${post.description}</div>
            `;
            document.getElementById('viewTitle').innerText = post.title;
            viewPostModal.classList.add('active');
        }
    };

    window.editPost = (id) => {
        const post = posts.find(p => p.id == id);
        if (post) {
            postIdInput.value = post.id;
            titleInput.value = post.title;
            descriptionInput.value = post.description;
            imageInput.value = post.image || '';

            modalTitle.innerText = 'Edit Post';
            savePostBtn.innerText = 'Update Post';
            blogModal.classList.add('active');
        }
    };

    window.deletePost = (id) => {
        if (confirm('Are you sure you want to delete this post?')) {
            posts = posts.filter(p => p.id != id);
            saveToLocalStorage();
            renderPosts();
        }
    };

    newPostBtn.addEventListener('click', openCreateModal);
    closeModal.addEventListener('click', closeModals);
    cancelBtn.addEventListener('click', closeModals);
    closeViewModalX.addEventListener('click', closeModals);
    closeViewModalBtn.addEventListener('click', closeModals);

    blogForm.addEventListener('submit', handleFormSubmit);

    window.addEventListener('click', (e) => {
        if (e.target === blogModal || e.target === viewPostModal) {
            closeModals();
        }
    });

    renderPosts();
});