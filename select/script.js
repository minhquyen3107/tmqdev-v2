//@ts-check

// Library
import { URLState } from "../modules/classes/URLState.js"

// DOM Elements
const button = /** @type HTMLButtonElement */ (document.getElementById('randomize'))
const input = /** @type HTMLInputElement */ (document.getElementById('input'))
const list = /** @type HTMLDivElement */ (document.getElementById('list'))
const backToTop = /** @type HTMLDivElement */ (document.getElementById('back-to-top'))

// -----
// STATE
// -----

// URL State Manager
const urlState = new URLState()

// State
let state = urlState.get('q')?.split(',') || []

/** Updates the URL to correspond to the current state */
function updateURL() {
    urlState.set('q', state.join(','))
    urlState.push()
}

// Initialize the options list on page load
if (state.length) {
    state.forEach(x => addToList(x))
    makeSelection() // If the options were provided by URL, make a selection automatically
}

// -------------
// SELECT BUTTON
// -------------

// Register a on-click event listener to select one of the element from the list
button.addEventListener('click', makeSelection)

// -----
// INPUT
// -----

// Add the text-input to the list of options when the "Enter" key is pressed
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        let text = input.value
        if (!text) { return }   // If text is null, return

        addToList(text)         // Add text to the list of options

        state.push(text)         // Update the state
        updateURL()             // Update the url

        input.value = ""        // Clear the input element
    }
})

// ----
// LIST
// ----

/**
 * Adds the given text to the list of options
 * @param {string} item The text to add to the list of options
 */
function addToList(item) {
    /** List Item Container */
    const div = document.createElement('div')
    div.classList.add('list-item', 'fade-in')

    /** List Item Text */
    const text = document.createElement('p')
    text.innerText = item
    div.appendChild(text)

    /** List Item Buttons */
    const buttons = document.createElement('div')
    buttons.classList.add('flex', 'flex-row')

    // Buttons tooltip
    const tooltip = document.createElement('p')
    tooltip.classList.add('font-size-1')
    buttons.appendChild(tooltip)

    /** List Item Button - Copy to Clipboard */
    const copyBtn = document.createElement('button')
    copyBtn.classList.add('btn-secondary')
    copyBtn.innerText = "📋"
    copyBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(item)
        copyBtn.innerText = "✅"
        setTimeout(() => {
            copyBtn.innerText = "📋"
        }, 2000)
    })
    copyBtn.addEventListener('mouseover', () => tooltip.innerText = 'Copy to Clipboard')
    copyBtn.addEventListener('mouseleave', () => tooltip.innerText = '')
    buttons.appendChild(copyBtn)

    /** List Item Button - Delete */
    const clearBtn = document.createElement('button')
    clearBtn.classList.add('btn-secondary')
    clearBtn.innerText = "🗑️"
    clearBtn.addEventListener('click', () => {
        state.filter(x => x !== item)
        updateURL()
        list.removeChild(div)
    })
    clearBtn.addEventListener('mouseover', () => tooltip.innerText = 'Delete')
    clearBtn.addEventListener('mouseleave', () => tooltip.innerText = '')
    buttons.appendChild(clearBtn)

    // Append nodes
    div.appendChild(buttons)
    list.appendChild(div)
}

// --------------
// MAKE SELECTION
// --------------

/** Select one of the many list options */
function makeSelection() {
    // Remove the selected class from any items that already have it
    for (const child of list.children) {
        child.classList.remove('selected')
    }
    // Select one option at random
    const idx = Math.floor(Math.random() * list.children.length)
    const selection = list.children.item(idx)
    if (!selection) { return }

    // Add the select class to highlight the selection
    selection.classList.add('selected')
    // and scroll it into view if it is off-screen
    scrollToViewIfNeeded(selection)
}

// -----------
// BACK TO TOP
// -----------

// Create a back to top scroll listener
document.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
    const progress = Math.min(window.scrollY / totalHeight, 1)
    if (progress > 0.2) {
        backToTop.classList.remove('hidden', 'fade-out')
        backToTop.classList.add('fade-in')
    } else {
        backToTop.classList.remove('fade-in')
        backToTop.classList.add('hidden', 'fade-out')
    }
})

// Scroll back to the top
backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
})

// ----------------
// HELPER FUNCTIONS
// ----------------

/**
 * Scroll the element into view if it is off screen
 * @param {Element} element Element
 */
function scrollToViewIfNeeded(element) {
    if (!element) { return }
    var rect = element.getBoundingClientRect()
    if (rect.top < 0 || rect.bottom > window.innerHeight) {
        element.scrollIntoView({ behavior: 'smooth' })
    }
}
