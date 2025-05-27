// =========
// URL STATE
// =========

export class URLState extends URLSearchParams {

    /** The URL */
    #url = ""

    /**
     * Instantiate an URLState object
     * @param {string | URL | null} url The URL to use for the state management
     */
    constructor(url = window.location.href) {
        url = typeof url === 'string' ? new URL(url) : url
        super(url.searchParams)
        this.#url = url
    }

    /** Update the URL to reflect the current state */
    push() {
        this.#url.search = this.toString()
        history.pushState(null, '', this.#url)
    }

    /**
     * Set the state and update the URL to reflect the current state
     * @param {string} key
     * @param {string} value 
     */
    setState(key, value) {
        this.set(key, value)
        this.push()
    }

}
