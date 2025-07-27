let currentCategory = 'Life';
        let editingNoteId = null;
        let notes = {
            'Life': [
                {id: 1, title: 'The Power of the Long Game', image: '',content:'Lorem Ipsum'},
                {id: 2, title: 'The Power of the Long Game', image: '', content: 'Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks'},
                {id: 3, title: 'The Power of the Long Game', image: '', content: 'Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks Lorem Ipsum bla bla bla coding sucks'}
            ],
            'School': [],
            'Friends': [],
            'Work': []
        };

        document.getElementById('addCategoryBtn').addEventListener('click', () => {
            document.getElementById('categoryModal').classList.add('active');
        });

        document.getElementById('addCategoryConfirm').addEventListener('click', () => {
            const categoryName = document.getElementById('categoryNameInput').value.trim();
            if (categoryName) {
                addCategory(categoryName);
                document.getElementById('categoryNameInput').value = '';
                document.getElementById('categoryModal').classList.remove('active');
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('category-btn')) {
                switchCategory(e.target.dataset.category);
            }
        });

        document.getElementById('addNoteCard').addEventListener('click', () => {
            openNoteModal();
        });

        document.addEventListener('click', (e) => {
            if (e.target.closest('[data-note-id]') && !e.target.closest('#addNoteCard')) {
                const noteId = parseInt(e.target.closest('[data-note-id]').dataset.noteId);
                openNoteModal(noteId);
            }
        });

        document.getElementById('saveNoteBtn').addEventListener('click', saveNote);

        document.getElementById('imagePreview').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });

        document.getElementById('imageInput').addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    updateImagePreview(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });

        document.getElementById('imageUrlInput').addEventListener('input', (e) => {
            if (e.target.value) {
                updateImagePreview(e.target.value);
            }
        });

        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                e.target.classList.remove('active');
            }
        });

        function addCategory(name) {
            const categoriesDiv = document.getElementById('categories');
            const button = document.createElement('button');
            button.className = 'category-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-200';
            button.dataset.category = name;
            button.textContent = name;
            categoriesDiv.appendChild(button);
            notes[name] = [];
        }

        function switchCategory(category) {
            currentCategory = category;
            document.querySelectorAll('.category-btn').forEach(btn => {
                btn.className = 'category-btn w-full text-left px-4 py-3 rounded-lg hover:bg-gray-200';
            });
            document.querySelector(`[data-category="${category}"]`).className = 'category-btn w-full text-left px-4 py-3 rounded-lg bg-white shadow-sm';
            renderNotes();
        }

        function renderNotes() {
            const grid = document.getElementById('notesGrid');
            const categoryNotes = notes[currentCategory] || [];
            
            grid.innerHTML = '';
            
            categoryNotes.forEach((note, index) => {
                const noteDiv = document.createElement('div');
                noteDiv.className = 'note-card rounded-2xl p-4 h-80 flex flex-col cursor-pointer hover:shadow-lg transition-shadow';
                noteDiv.dataset.noteId = note.id;
                noteDiv.innerHTML = `
                    <div class="flex-1 mb-4">
                        <img src="${note.image}" alt="Note" class="w-full h-48 object-cover rounded-lg">
                    </div>
                    <h3 class="text-lg font-medium text-gray-800">${note.title}</h3>
                `;
                grid.appendChild(noteDiv);
            });

            const addCard = document.createElement('div');
            addCard.id = 'addNoteCard';
            addCard.className = 'bg-gray-300 rounded-2xl h-80 flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors';
            addCard.innerHTML = '<span class="text-6xl text-gray-600">+</span>';
            addCard.addEventListener('click', () => openNoteModal());
            grid.appendChild(addCard);
        }

        function openNoteModal(noteId = null) {
            editingNoteId = noteId;
            const modal = document.getElementById('noteModal');
            
            if (noteId) {
                const note = notes[currentCategory].find(n => n.id === noteId);
                if (note) {
                    document.getElementById('noteTitleInput').value = note.title;
                    document.getElementById('noteContentInput').value = note.content;
                    document.getElementById('imageUrlInput').value = note.image;
                    updateImagePreview(note.image);
                    document.getElementById('saveNoteBtn').textContent = 'Save';
                }
            } else {
                document.getElementById('noteTitleInput').value = '';
                document.getElementById('noteContentInput').value = '';
                document.getElementById('imageUrlInput').value = '';
                document.getElementById('imagePreview').innerHTML = '<span class="text-6xl text-gray-500">+</span>';
                document.getElementById('saveNoteBtn').textContent = 'Add';
            }
            
            modal.classList.add('active');
        }

        function updateImagePreview(src) {
            const preview = document.getElementById('imagePreview');
            preview.innerHTML = `<img src="${src}" alt="Preview" class="w-full h-full object-cover rounded-2xl">`;
        }

        function saveNote() {
            const title = document.getElementById('noteTitleInput').value || 'Untitled';
            const content = document.getElementById('noteContentInput').value;
            const image = document.getElementById('imageUrlInput').value || 'https://via.placeholder.com/300x200?text=No+Image';

            if (editingNoteId) {
                const noteIndex = notes[currentCategory].findIndex(n => n.id === editingNoteId);
                if (noteIndex !== -1) {
                    notes[currentCategory][noteIndex] = { id: editingNoteId, title, content, image };
                }
            } else {
                const newNote = {
                    id: Date.now(),
                    title,
                    content,
                    image
                };
                notes[currentCategory].push(newNote);
            }

            document.getElementById('noteModal').classList.remove('active');
            renderNotes();
        }

        renderNotes();