export default class SponLax {
	defaults = {
		rootMargin: '0px',
		threshold: 0,
		shouldUnObserve: () => false,
		onEnter: () => {},
		onLeave: () => {},
		inview: () => {}
	}

	prevFrame = -1

	constructor(selector = '[data-inview]', options = {}) {
		this.options = { ...this.defaults, ...options }

		const { rootMargin, threshold } = this.options
		const observer = new IntersectionObserver(this.onIntersection(), {
			rootMargin,
			threshold
		})

		this.nodes = [...document.querySelectorAll(selector)].map(node => {
			observer.observe($node)
			return node
		})

		this.elements = new Set()
		this.handle = null
	}

	within = node => node.getAttribute('data-inview') === 'true'

	loop = () => {
		if (window.pageYOffset === this.prevFrame) {
			this.handle = requestAnimationFrame(this.loop)
			return
		}

		this.prevFrame = window.pageYOffset

		const { inview } = this.options
		;[...this.elements].forEach(inview)
		this.handle = requestAnimationFrame(this.loop)
	}

	onIntersection = () => (entries, observer) => {
		const { shouldUnObserve, onEnter, onLeave } = this.options

		entries.forEach(entry => {
			const { target: $node, isIntersecting } = entry

			if (isIntersecting) {
				if (shouldUnObserve($node)) {
					observer.unobserve($node)
				}

				$node._props = entry

				this.elements.add($node)
				onEnter($node)

				!this.within($node) && node.setAttribute('data-inview', 'true')
			} else {
				this.within($node) && node.setAttribute('data-inview', 'false')
				onLeave($node)

				this.elements.delete($node)
			}
		})

		if (this.elements.size > 0 && this.handle === null) {
			this.loop()
		}

		if (this.elements.length === 0) {
			cancelAnimationFrame(this.handle)
			this.handle = null
		}
	}
}
