export class Opportunity {
    #title: string
    #subtitle: string
    #description: string
    #url: string
    #source: {
        name: string
        url: string
    } 

    constructor(title: string, subtitle: string, description: string, url: string, souce: { name: string, url: string }) {
        this.#title = title
        this.#subtitle = subtitle
        this.#description = description
        this.#url = url
        this.#source = souce
    }

    get title() {
        return this.#title
    }

    get subtitle() {
        return this.#subtitle
    }

    get description() {
        return this.#description
    }

    get url() {
        return this.#url
    }

    get source() {
        return this.#source
    }
}