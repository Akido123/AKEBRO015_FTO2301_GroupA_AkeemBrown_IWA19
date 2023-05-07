/* ---Data Capture--- */

import { authors as bookAuthors, genres as bookGenres, books, BOOKS_PER_PAGE } from "./data.js";

const range = [bookAuthors.length, bookGenres.length]
const matches = books
const page = 1;

/**
 * The if statements check for if the data imported is valid of being an array.
 * @type {Array}
 */
if (!books && !Array.isArray(books)) throw new Error('Source required') 
if (!range && range.length < 2) throw new Error('Range must be an array with two numbers')

/* ---Day and Night Mode RGB's--- */

const day = {
    dark: '10, 10, 20',
    light: '255, 255, 255',
}

const night = {
    dark: '255, 255, 255',
    light: '10, 10, 20',
}

/* ---Data Splice and HomePage Preview definition--- */
/**
 * Here we use a specific range of the imported data to create a fragment document for use in presenting the homepage books.
 * @type {Array}
 * @param {object}
 * @returns {Element}
 */
const fragment = document.createDocumentFragment()
const extracted = books.slice(0, 36)

function createPreview({author, image, title, id}) {
    const myDiv = document.createElement("div")
    const authorElement = document.createElement("h3")
    const imageElement = document.createElement("img")
    const titleElement = document.createElement("h2")
    const idElement = document.createElement("p")

    authorElement.textContent = bookAuthors[author]
    imageElement.src = image
    titleElement.textContent = title
    idElement.textContent = id

    myDiv.appendChild(imageElement)
    myDiv.appendChild(titleElement)
    myDiv.appendChild(authorElement)
    myDiv.appendChild(idElement)

    return myDiv
}


for (const { author, image, title, id } of extracted) {
    const preview = createPreview({
        author,
        id,
        image,
        title
    })

    fragment.appendChild(preview)
}

/* ---Genres Definition--- */
/**
 * Creating a list of book genres for later use.
 * @type {Array}
 */

document.querySelector('[data-list-items]').appendChild(fragment)

const genres = document.createDocumentFragment()
const allGenreElement = document.createElement('option')
allGenreElement.value = 'any'
allGenreElement.innerHTML = 'All Genres'
genres.appendChild(allGenreElement)

for (const [id, name] of Object.entries(bookGenres)) {
    const genreElement = document.createElement('option')
    genreElement.value = id
    genreElement.innerText = name
    genres.appendChild(genreElement)
}

document.querySelector('[data-search-genres]').appendChild(genres)

/* ---Authors Definition--- */
/**
 * Creating a list of book authors for later use.
 * @type {Array}
 */

const authors = document.createDocumentFragment()
const allAuthorElement = document.createElement('option')
allAuthorElement.value = 'any'
allAuthorElement.innerText = 'All Authors'
authors.appendChild(allAuthorElement)

for (const [id, name] of Object.entries(bookAuthors)) {
    const authorElement = document.createElement('option')
    authorElement.value = id
    authorElement.innerText = name
    authors.appendChild(authorElement)
}

document.querySelector('[data-search-authors]').appendChild(authors)

/* ---Dark and Light Mode Definition--- */
/**
 * Here we define the toggleing between light and dark mode on the app.
 * @type {boolean}
 */

let themeSetting = document.querySelector('[data-settings-theme]').value = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'night' : 'day'
const v = themeSetting = 'night' || (themeSetting === '' && prefersDarkMode) ? 'night' : 'day';

const css = {
    day: {
      dark: '#333333',
      light: '#FFFFFF'
    },
    night: {
      dark: '#FFFFFF',
      light: '#333333'
    }
};

document.documentElement.style.setProperty('--color-dark', css[v].dark);
document.documentElement.style.setProperty('--color-light', css[v].light);

/* ---Display/Show more books--- */
/**
 * Decides wether a button is disabled due to the list of books being revealed completed.
 */

document.querySelector('[data-list-button]').innerHTML = "Show more (books.length - BOOKS_PER_PAGE)"

document.querySelector('[data-list-button]').setAttribute('disabled',!(matches.length - [page * BOOKS_PER_PAGE] > 0))

document.querySelector('[data-list-button]').innerHTML = /* html */ [
    '<span>Show more</span>',
    `<span class="list__remaining"> (${matches.length - [page * BOOKS_PER_PAGE] > 0 ? matches.length - [page * BOOKS_PER_PAGE] : 0})</span>`,
]

/* ---Cancel Option--- */
/**
 * This defines all the cancel options of the displays so that they may be closed whenever the option arises.
 */

document.querySelector('[data-search-cancel]').addEventListener('click', () => {(document.querySelector('[data-search-overlay]')).close()})
document.querySelector('[data-settings-cancel]').addEventListener('click', () => {(document.querySelector('[data-settings-overlay]')).close()})
document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {event.preventDefault();(document.getElementById('settings')).submit()})
document.querySelector('[data-list-close]').addEventListener('click', () => {(document.querySelector('[data-list-active]')).close()})

/**
 * Defines an element fragment based on the books referenced.
 * @param {object} matches 
 * @param {number} startIndex 
 * @param {Number} endIndex 
 * @returns {Element}
 */
function createPreviewsFragment(matches, startIndex, endIndex) {
    const fragment = document.createDocumentFragment();
    const books = matches.slice(startIndex, endIndex);
    for (const book of books) {
      const preview = createBookPreview(book);
      fragment.appendChild(preview);
    }
    return fragment;
  }

    document.querySelector('[data-list-button]').addEventListener('click', () => {
    document.querySelector(['data-list-items']).appendChild(createPreviewsFragment(matches, page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE))
    actions.list.updateRemaining()
    page = page + 1
})

    document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').showModal()
    document.querySelector('[data-search-title]').focus();
})

/* ---Filter Option--- */
/**
 * Here we filter various previews dependant on if statements passed.
 */

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    let result = []
    
    /**
     * The for loop checks for the if statements and compare to later only preview the if statements.
     * @type {boolean}
     */

    for (const book of books) {
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes[filters.title.toLowerCase()]
        const authorMatch = filters.author === 'any' || book.author === filters.author


        const genreMatch = filters.genre === 'any'
        for (const genre of book.genres) {
            if (genre === filters.genre) {
            genreMatch = true
            break
            }
        }


        if (titleMatch && authorMatch && genreMatch) () => result.push(book)
    }

    if (matches.length < 1) {
        document.querySelector('[data-list-message]').classList.add('list__message_show')
    } 
    else {document.querySelector('[data-list-message]').classList.remove('list__message_show')}
    

    /**
     * We append the new list of books to a fragment document
     */
    document.querySelector('[data-list-items]').innerHTML = ''
    const fragment = document.createDocumentFragment()
    const extracted = books.slice(range[0], range[1])

    for (const { author, image, title, id } of extracted) {
        const { author: authorId, id, image, title } = books

        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)

        element.innerHTML = /* html */ `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[authorId]}</div>
            </div>
        `

        fragment.appendChild(element)
    }
    
    document.querySelector('[data-list-items]').appendChild(fragment)
    const initial = matches.length - [page * BOOKS_PER_PAGE]
    const remaining = hasRemaining ? initial : 0
    document.querySelector('[data-list-button]').disabled = initial > 0

    document.querySelector('[data-list-button]').innerHTML = /* html */ `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining})</span>
    `

    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('[data-search-overlay]').showModal()
})

/* ---Dark and Light mode Toggle--- */
/**
 * Toggle between color scheme ,light and day, when click
 * @type {object}
 */

document.querySelector('[data-settings-overlay]').addEventListener('click', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const result = Object.fromEntries(formData)
    document.documentElement.style.setProperty('--color-dark', css[result.theme].dark);
    document.documentElement.style.setProperty('--color-light', css[result.theme].light);
    document.querySelector('[data-settings-overlay]').showModal()
})

/* ---View Preview--- */
/**
 * When a book is clicked in the homepage an overlay is opened on which previews the click book.
 * @type {Array}
 */

document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active;

    for (const node of pathArray) {
        if (active) break;
        const previewId = node
    
        for (const singleBook of books) {
            if (singleBook.id === previewId) active = singleBook
        } 
    }

    /**
     * The clicked book preview elements is appended to the preview page.
     * @returns {Element}
     */
    
    if (!active) return
    document.querySelector('[data-list-active]').showModal()
    document.querySelector('[data-list-blur]').src = active.image; document.querySelector('[data-list-image]').src = active.image
    document.querySelector('[data-list-title]').textContent = active.title
    
    document.querySelector('[data-list-subtitle]').textContent = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
    document.querySelector('[data-list-description]').textContent = active.description
})
